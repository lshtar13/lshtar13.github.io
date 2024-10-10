---
title: 'Ch4. Process Scheduling [Linux_Kernel]'
description: 'Linux Kernel Development 3rd'
pubDate: 'Oct 10 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Linux", "Kernel", "Scheduler", "CFS"]
series: "Linux Kernel"
---

# Material
Robter Love의 [Linux Kernel Development 3rd](https://www.amazon.com/Linux-Kernel-Development-Robert-Love/dp/0672329468)를 공부하며 정리한 것. 리눅스 커널 `v3.0` 기준.

# Process Scheduling
## Linux's Process Scheduler
리눅스는 v2.4 이전까지는 간단한 스케쥴러를 사용하였다. 간단한 만큼 확장성에 있어 문제를 겪었고, v2.5부터는 O(1) 스케쥴러를 도입하였다. 
O(1) 스케쥴러는 빠른 작업 속도와 대기열 관리 최적화로 대량의 프로세스와 프로세서를 사용하는 환경에서 좋은 성능을 보여주었다. 
하지만, interactive한 프로세스가 주가 되는 환경에선 좋지 못한 성능을 보여주었다. 이 문제를 해결하기 위해 v2.6.23부터 도입된 것이 CFS(Completely Fair Scheduler)이다.
## Processes
### I/O-Bound Vs. CPU-Bound Process
프로세스는 입출력 중심의 프로세스와 프로세서 중심의 프로세스로 구분할 수 있다. 전자는, 주로 사용자 등으로부터 입출력을 기다리는 작업을 반복한다. 따라서 자주 중단되며, 자주 실행시킬 수록 좋다. 
프로세서 중심의 프로세스는 중단없이 연산을 지속하며, 자주 중단(선점, prempt)될수록 성능이 저하되는 특징을 가지고 있다. 따라서, 입출력 중심의 프로세스에게 높은 우선순위를 부여하여 해당 프로세스가 입출력 interrupt를 받아 돌아왔을때,
빠르게 선점할 수 있어야한다.
### Process Priority
리눅스 커널에서는 이와 같은 프로세스간의 위계를 나타내기 위하여 nice값을 사용한다. 이는 -20부터 +19까지의 범위를 가지며,숫자가 작을수록 더 높은 우선순위를 나타내고 각 프로세스마다 주어진다. 
CFS를 제외한 몇몇 스케쥴러들은 이러한 nice값을 바탕으로 프로세스에게 부여하는 timeslice의 크기를 조정한다. 한번 선점했을때, 우선순위가 높을수록 더 긴 실행시간을 갖도록 하는 것이다.
그러나 이러한 방식은 위에서 설명한 프로세스간의 차이를 극복하지 못한다. 입출력 중심의 프로세스는 분명히 프로세서 중심의 프로세스보다 더 높은 우선순위를 가지며, 먼저 실행되는 것이 좋다.
하지만, 긴 실행시간을 필요로 하는 것은 아니며 긴 실행시간을 부여할 경우 오히려 긴 실행시간을 필요로 하는 프로세서 중심의 프로세스가 피해를 입으며, 자주 context switching이 일어나 전체적인 시스템 성능이 떨어진다.
당연히 이는 입출력 중심 프로세스에게도 악영향을 끼친다. 자원을 제대로 활용하지 못하는 경우가 발생하는 것이다.</br>
따라서, 우리는 프로세스의 우선순위와 프로세스의 각기 다른 실행 시간을 신경쓰며 스케쥴링을 해야 한다.

## [CFS(Completely Fair Scheduler)](https://docs.kernel.org/scheduler/sched-design-CFS.html)
### Unix Systems
기존의 유닉스 운영체제들에서는 nice값에 따라 timeslice크기를 조정하는 방식으로 프로세스간의 우선순위를 반영했다. 
이러한 스케쥴링 정책은 context switching 최적화를 어렵게 만든다. 상황에 따라 바뀌는 공정함의 기준을 충족시키지 못하기 때문이다.
### CFS
CFS는 virtual runtime을 도입함으로써 프로세스 간 우선순위와 자원의 활용도 모두 고려하며 스케쥴링을 한다. 
Virtual runtime은 프로세스의 우선순위에 따라 정규화한 실행시간으로써, 우선순위에 따른 가중치 값을 바탕으로 계산된다.
우선순위가 높을수록 가중치는 커지고, 우선순위가 낮을수록 가중치는 작아진다. 이러한 가중치를 바탕으로 virtual runtime을 계산하는 공식은 아래와 같다.</br>
![image](https://github.com/user-attachments/assets/12de9922-3f0e-4d24-a0e3-bb0aa65bae5a)</br>
이러한 process들의 virtual runtime을 [Red-Black tree](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree) 라는 구조체에 담아 기록한다.
가장 작은 virtual runtime을 가진 프로세스를 우선적으로 스케쥴링하게 된다.</br>
![image](https://github.com/user-attachments/assets/3749db91-3165-436c-8e28-c82c1bc7c8e2)</br>
이런 방식으로 우선순위가 높은 프로세스를 먼저 스케쥴링하는 동시에 우선순위가 낮은 프로세스에게도 순번이 돌아가게끔, 
또 우선순위가 높은 프로세스가 입출력 등을 기다리는 이유로 스케쥴링에서 제외되었을 때 우선순위가 낮은 프로세스가 잦은 context switching 없이
자원을 효과적으로 활용할 수 있게 된다. 고정적인 time slice대로 선점하는 것이 아니라, 유동적인 할당 비율대로 선점하기 때문에 상황에 유연하게 대처할 수 있다.

## Code
### `check_preempt_tick()`
CFS 스케쥴링은 `kernel/sched.c`에 정의되어 있는 `schedule()`에서 진행된다. 각종 interrupt들을 처리할 때마다 해당 함수를 실행하게 된다.
스케쥴링에 있어 중요한 interrupt는 timer interrupt로써, 일정한 시간간격으로 발생한다. Timer interrupt를 처리하는 interrupt handler에서는 `update_process_times()`을 호출하게 된다.
이는 `scheduler_tick()`을 실행하는데 이는 `check_preempt_tick()`를 통해 재스케쥴링 여부를 판단한다. 
판단 기준은 우선순위(nice)값에 따른 적정 실행시간이며, 이 적정 실행시간을 초과하였을 경우에는 재스케쥴링을 하도록 한다. 이때 `need_resched` 플래그를 설정한다.
```
static void
check_preempt_tick(struct cfs_rq *cfs_rq, struct sched_entity *curr)
{
	unsigned long ideal_runtime, delta_exec;

	ideal_runtime = sched_slice(cfs_rq, curr);
	delta_exec = curr->sum_exec_runtime - curr->prev_sum_exec_runtime;
	if (delta_exec > ideal_runtime) {
		resched_task(rq_of(cfs_rq)->curr);
		clear_buddies(cfs_rq, curr);
		return;
	}

  ...

	if (cfs_rq->nr_running > 1) {
		struct sched_entity *se = __pick_first_entity(cfs_rq);
		s64 delta = curr->vruntime - se->vruntime;
    ...
		if (delta > ideal_runtime)
			resched_task(rq_of(cfs_rq)->curr);
	}
}
```
### `schedule()`
`schedule()`은 CFS 스케쥴링을 수행함에 있어 가장 핵심이 되는 함수이다. 이는 대략적으로 아래와 같이 움직인다.</br>
1. 스케쥴링 간에 선점(preemption)이 일어나지 않도록 막는다.
2. 스케쥴링 간에 사용할 정보들에 대하여 race condition을 방지하기 위해 각종 lock contention을 진행한다.
3. 현재 실행중인 프로세스(`prev`)를 다시 rb-tree에 집어넣는다. (`put_prev_task()`)
4. Rb-tree에서 vruntime이 가장 작은 프로세스(`next`)를 고른다. (`pick_next_task()`)
5. 만약 `prev`와 `next`가 다르면, context switching을 통해 선점(preemption)을 진행한다.
```
asmlinkage void __sched schedule(void)
{
	struct task_struct *prev, *next;
	unsigned long *switch_count;
	struct rq *rq;
	int cpu;

need_resched:
	preempt_disable();
  ...
	prev = rq->curr;
  ...

	pre_schedule(rq, prev);

	if (unlikely(!rq->nr_running))
		idle_balance(cpu, rq);

	put_prev_task(rq, prev);
	next = pick_next_task(rq);
	clear_tsk_need_resched(prev);
	rq->skip_clock_update = 0;

	if (likely(prev != next)) {
		rq->nr_switches++;
		rq->curr = next;
		++*switch_count;

		context_switch(rq, prev, next); /* unlocks the rq */
		cpu = smp_processor_id();
		rq = cpu_rq(cpu);
	} else
		raw_spin_unlock_irq(&rq->lock);

	post_schedule(rq);

	preempt_enable_no_resched();
	if (need_resched())
		goto need_resched;
}
```
