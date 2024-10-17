---
title: 'Ch8. Bottom Halves and Deferring Work [Linux Kernel]'
description: 'Linux Kernel Development 3rd'
pubDate: 'Oct 17 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Linux", "Kernel", "Interrupt", "Bottom half", "softirq", "workqueue"]
series: "Linux Kernel"
---

# Material
Robter Love의 [Linux Kernel Development 3rd](https://www.amazon.com/Linux-Kernel-Development-Robert-Love/dp/0672329468)를 공부하며 정리한 것. 리눅스 커널 `v2.6` 기준.

# Two Part of Interrupt Handling
Interrupt handling은 두 부분, Top half(전반부 처리, TH)와 Bottom half(후반부 처리, BH)으로 나뉜다. Interrupt handling은 process context와는 다른 interrupt context에서,
다른 interrupt를 막아둔 채로 이루어지기 때문에 빠른 처리가 이루어져야 한다. 다른 프로세스들의 작업이 지연되기 때문이다. 빠른 처리를 위해서 interrupt handling을 두 부분으로 나눈 것이다.</br>
TH에서는 interrupt context에서 다른 interrupt의 방해 받지 않는 환경에서 이루어져야하는 필수적인 작업들만 이루어진다. 하드웨어에 interrupt에 대한 ack를 보내는 등의 작업들이 이루어진다. 
BH에서는 이와는 다르게, 특수한 환경이 필요하지 않고 시간에 구애받지 않거나 시간이 많이 걸리는 작업들이 이루어진다. 네트워크 장치로부터 수신내용을 복사하는 등의 작업들이 이루어진다.

# Bottom Half
BH를 수행하는데 사용되는 방식은 크게 두가지이다. softirq와 workqeue가 그것인데, softirq를 이용한 tasklet도 존재한다. 각각 구현 방식과 그 쓰임새가 다르다.

## softirq
softirq는 프로세서별로 수행되는, 정적으로 등록된 작업들을 수행하는 BH 구현 방식이다. softirq 방식을 통해 수행되는 작업들은 컴파일시에 고정되며, 프로세서별로 해당 작업 집합 내에서 필요한 작업들을 수집하여 수행한다. 
softirq 작업은최대 32개까지 등록될 수 있으며, v2.6.34기준으로 9개가 등록되어있다. 각 softirq 작업들은 0~8까지의 인덱스를 가지며, 인덱스가 작을수록 먼저 수행된다.</br>
softirq는 open_softirq()를 통해 각 작업들에 대한 softirq handler를 등록한다. 등록된 softirq작업을 실행하려면 raise_softirq('softirq 인덱스')함수를 호출하여 해당 인덱스에 해당하는 softirq의 작업을 요청한다.
raise_softirq()를 통해 요청된 작업들은 다음과 같은 상황에 do_softirq()를 통해 실행된다.
* Interrupt Hanlidng 종료 시
* ksoftirqd 커널 스레드 내에서 
* 명시적으로 등록된 softirq를 확인하고 실행하는 경우
### Interrupt Hanlidng 종료 시
timer interrupt를 다루는 아래의 코드들을 살펴보며 softirq가 작동하는 방식을 살펴보자.</br>
```
/*
 * Called from the timer interrupt handler to charge one tick to the current
 * process.  user_tick is 1 if the tick is user time, 0 for system.
 */
void update_process_times(int user_tick)
{
	struct task_struct *p = current;
	int cpu = smp_processor_id();

	/* Note: this timer irq context must be accounted for as well. */
	account_process_tick(p, user_tick);
	run_local_timers();
	rcu_check_callbacks(cpu, user_tick);
	printk_tick();
	perf_event_do_pending();
	scheduler_tick();
	run_posix_cpu_timers(p);
}

/*
 * Called by the local, per-CPU timer interrupt on SMP.
 */
void run_local_timers(void)
{
	hrtimer_run_queues();
	raise_softirq(TIMER_SOFTIRQ);
	softlockup_tick();
}
```</br>
timer interrupt가 발생하면 raise_softirq(TIMER_SOFTIRQ)를 호출하여 softirq를 요청하는 것을 볼 수 있다. 해당 softirq는 요청 즉시 처리되는 것이 아니라 interrupt handling이 종료될 때 irq_exit()에 의해 실행된다.
다음은 x86 아키텍쳐에서 interrupt handling을 처리하는 코드이다. 해당 코드의 끝자락, interrupt handling을 종료하는 코드에서 softirq 수행을 요청하는 do_softirq()를 호출하는 것을 볼 수 있다.</br>
```
/*
 * do_IRQ handles all normal device IRQ's (the special
 * SMP cross-CPU interrupts have their own specific
 * handlers).
 */
unsigned int __irq_entry do_IRQ(struct pt_regs *regs)
{
	struct pt_regs *old_regs = set_irq_regs(regs);

	/* high bit used in ret_from_ code  */
	unsigned vector = ~regs->orig_ax;
	unsigned irq;

	exit_idle();
	irq_enter();

	irq = __get_cpu_var(vector_irq)[vector];

	if (!handle_irq(irq, regs)) {
		ack_APIC_irq();

		if (printk_ratelimit())
			pr_emerg("%s: %d.%d No irq handler for vector (irq %d)\n",
				__func__, smp_processor_id(), vector, irq);
	}

	irq_exit();

	set_irq_regs(old_regs);
	return 1;
}

...

/*
 * Exit an interrupt context. Process softirqs if needed and possible:
 */
void irq_exit(void)
{
	account_system_vtime(current);
	trace_hardirq_exit();
	sub_preempt_count(IRQ_EXIT_OFFSET);
	if (!in_interrupt() && local_softirq_pending())
		invoke_softirq();

	rcu_irq_exit();
#ifdef CONFIG_NO_HZ
	/* Make sure that timer wheel updates are propagated */
	if (idle_cpu(smp_processor_id()) && !in_interrupt() && !need_resched())
		tick_nohz_stop_sched_tick(0);
#endif
	preempt_enable_no_resched();
}

...

#ifdef __ARCH_IRQ_EXIT_IRQS_DISABLED
# define invoke_softirq()	__do_softirq()
#else
# define invoke_softirq()	do_softirq()
#endif
```</br>
### ksoftirqd
