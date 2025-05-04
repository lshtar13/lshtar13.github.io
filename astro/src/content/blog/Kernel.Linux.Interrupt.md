---
title: 'Ch7. Interrupts and Intterrupt Handlers [Linux_Kernel]'
description: 'Linux Kernel Development 3rd'
pubDate: 'Oct 15 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Linux", "Kernel", "Scheduler", "Interrupt", "Interrupt Handler"]
series: "Linux Kernel"
---

# Material
Robter Love의 [Linux Kernel Development 3rd](https://www.amazon.com/Linux-Kernel-Development-Robert-Love/dp/0672329468)를 공부하며 정리한 것. 리눅스 커널 `v3.0` 기준.

# Interrupt
인터럽트는 주로 하드웨어와 소통하기 위해 사용된다. 이러한 하드웨어의 사용에는 키보드나 마우스 등이 포함되며, 시스템 시간을 동기화하기 위한 타이머 동작도 포함된다.</br>
하드웨어와 소통할 때, 소통을 처리하기 위해 필요한 시스템 동작을 최소화해야 한다. Interrupt의 대체재인 polling은 하드웨어의 응답을 주기적으로 확인하며 계속 기다려야 하기 때문에 시스템 부하가 크다. 
시스템 부하를 최소화하는 동시에, 하드웨어의 응답, 요청들을 빠르게 처리할 수 있어야 한다.</br>
대기시간과 시스템 부하의 최소화라는 두가지 목표를 모두 만족시키기 위해 사용하는 것이, 비동기식 처리 방식은 interrupt이다.</br>
Interrupt는 하드웨어가 프로세서에게 보내는 신호로써, 하드웨어에서 interrupt가 발생하면 interrupt controller는 프로세서에게 신호를 보낸다.
그러면, 프로세서는 진행중인 작업을 중단하고 interrupt handler를 실행해 interrupt를 처리하게 된다.</br>
서로 다른 하드웨어들은 서로 다른 interrupt를 발생시키고 이러한 interrupt들은 그들 고유의 번호로 구분된다.
구분자 역할을 하는 번호들은 interrupt request(IRQ) line으로 불린다. 이 번호에 의하여 어떠한 interrupt handler가 실행된지 결정된다.

## Interrupt Handlers
각 interrupt들에 맞는 interrupt handler가 존재한다. 어떠한 interrupt handler가 실행될지는 위에서 설명한 interrupt들의 구분자(번호)에 의해 결정된다.</br>
이러한 interrupt handler는 실행 시간이 길어선 안된다. Interrupt handler는 interrupt context라는 특수한 context에서 실행되는데 이 context는 여타 context들과는 다르게 중단될 수 없다.
이 특성 때문에 interrupt handling이 길어질수록 이전에 실행되던 프로세스의 실행이 늦어지게 된다.</br>
### Top Halves & Bottom Halves
Interrupt handling으로 인한 지체를 최소화하기 위해 interrupt handling을 전반부 처리와 후반부 처리로 양분하여 처리한다. Interrupt를 처리할 때는, 하드웨어에게 interrupt를 정상적으로 수신했다는 신호를 보내고
해당 하드웨어의 정보를 읽는 등의 작업이 이루어진다. 전반부에서는 전자와 같은 시간에 민감한 작업을 수행한다. 이후 이어지는 작업들은 후반부 처리에 수행한다.
### Registering
`request_irq()`를 이용하여 interrupt handler를 등록한다. 이 함수에는 interrupt 번호(irq), handler 함수 포인터 등이 들어가는데, 어떤 디바이스에 해당하는 handler인지 확인하기 위해 dev 변수가 들어간다.
하나의 interrupt line을 여러 디바이스들이 공유하기 때문에 어떤 디바이스에 대한 interrupt 였는지 확인하기 위해 dev값을 이용한다. 
Interrupt handler는 어떤 interrupt가 발생하면 그 interrupt에 대하여 등록된 handler들을 모두 호출하여 실행하기 때문에 dev값을 이용하여 알맞은 handling routine을 실행시키도록 한다.
### Handling
Interrupt가 발생하면 프로세서는 커널을 중단하고, do_IRQ()를 실행한다. 각 interrupt line 별로 각자 entry point가 존재하며, 각 entry point에서 do_IRQ()를 실행하여 handler를 호출하게 된다.
do_IRQ()는 해당 interrupt를 인지 했다는 것을 알리고 해당 interrupt line을 비활성화 시킨다. 이후 handle_interrupt()를 이용하여 handler를 호출한다.
