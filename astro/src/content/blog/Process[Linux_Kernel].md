---
title: 'Ch3. Process [Linux Kernel]'
description: 'Linux Kernel Development 3rd'
pubDate: 'Oct 09 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Linux", "Kernel", "Process"]
series: "Linux Kernel"
---

# Material
Robter Love의 [Linux Kernel Development 3rd](https://www.amazon.com/Linux-Kernel-Development-Robert-Love/dp/0672329468)를 공부하며 정리한 것. 리눅스 커널 `v2.6` 기준.

# Process
## Process란
* Resource(virtual processor, virtual memory 등)을 점유하고 program을 실행하고 있는 것을 process라고 한다.
* Process는 `fork()`와 `exec()`를 통해서 생성된다.
* Process에 관한 정보들은 `task_struct`구조체에 기록된다. `task_struct`에는 프로세스가 사용하고 있는 파일 정보, address space 등에 관한 정보를 저장하고 있다.
  - `task_struct`의 위치
    2.6버전 이전에는 각 프로세스의 커널 스택 끝에 위치했다. 따라서 스택 포인터를 활용해서 간단히 계산할 수 있었다.
    2.6버전 이후로는 slab allocator를 이용해서 `task_struct`를 할당하기 때문에 동적으로 그 위치가 변한다. 몇몇 아키텍처에서는 레지스터를 하나 따로 배정해서 `task_struct`의 포인터를 기록한다.
    x86과 같이 레지스터가 적은 경우, 커널 스택 끝에 위치한 `thread_info`에 `task_struct`의 포인터를 저장하고 접근한다.
## Process State
Process는 5가지 상태 중 한 상태를 갖는다. 
* TASK_RUNNING
  User-space에서 실행되고 있는 process가 가질 수 있는 유일한 상태로써, 스케쥴링될 수 있는 상태를 의미한다.
* TASK_INTERRUPTIBLE
  특정한 조건(mutex lock 등)을 기다리며 스케쥴링에서 빠져있는 상태. 조건이 충족되면 TASK_RUNNING으로 변경된다. 조건이 충족되지 않아도 특정 시그널(스스로 깨어나기)을 받으면 TASK_RUNNING으로 변경될 수 있다.
* TASK_UNINTERRUPTIBLE
  TASK_UNINTERRUPTIBLE과 거의 동일하다. 다만, 스스로 깨어나지 못한다.
* __TASK_TRACED
  ptrace등을 사용해서 추적하고 있는 프로세스임을 의미한다.
* __TASK_STOPPED
## Process Context
Process는 두 가지 adress space에서 실행가능하다. User-space와 kernel-space인데, user-space에서 실행될 때는 program의 코드를 실행하고 kerenl-space에서 실행될 때는 커널 코드를 실행하게 된다. 
각 address space는 다른 코드와 스택을 가지고 있으며 kernel-space에서 실행되는 process를 process상태에서 실행되는 커널이라고 부른다. 시스템 콜 등을 이용해서 kernel-space에 진입할 수 있다.
## Process Family Tree
프로세스는 `fork()`와 `exec()`를 통해 자식 프로세스를 만들 수 있다. 자신의 `task_struct`의 자식 프로세스와, 또 자신을 만든 부모 프로세스(의 pid)를 기록한다. 
이렇듯, 부모-자식 관계로 이루어지 프로세스들을 추적해보면 하나의 프로세스 군을 형성하는 것을 알 수 있다. 부모 프로세스가 같은 프로세스들을 sibling이라 한다. 
모든 프로세스는 부모 프로세스가 있지만 가장 처음 만들어진 init 프로세스는 부모 프로세스가 없다. 다시 말해, 모든 프로세스를 거슬러 올라가보면 init 프로세스를 찾을 수 있다.

# Process Creation
Unix계열의 
