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
Unix계열의 운영체제들은 다른 계열의 운영체제들과는 다르게 프로세스의 생성을 `fork()`와 `exec()`로 분리해두었다. `fork()`를 통해 자식 프로세스를 만들고 pid를 부여한다. 
이때, 부모 프로세스의 주소공간 등 자원들을 상속 받지만 실제로 복사가 일어나는 것은 아니다. `exec()`를 통해 새로운 주소공간에 실행될 프로그램 코드를 적어넣은 후 실행시킨다.
이렇게 `fork`와 `exec`를 분리함으로써 리다이렉션등의 사전 작업을 프로그램이 실행되기 전에 처리할 수 있게 된다.

## Copy-on-Write
`fork()`시 자식 프로세스에 새로운 주소공간이 부여되고 부모의 주소공간에 있던 자원들이 그대로 복사되지만, 사실 실제로 복사되지 않을 수 있다. 
처음에 `fork()`를 실행하게 되면 자식 프로세스의 페이지 테이블은 부모 주소공간의 페이지를 가리킨다. `dup_task_struct()`를 통해 task_struct를 그대로 복사했기 때문이다. 따라서 부모 프로세스의 스택이나 코드 등에 접근할 수 있는데,
쓰기 작업이 일어나면 새로운 페이지를 할당하고 기존 페이지를 복사한 다음 쓰기 작업이 이루어진다. 
이렇게 실제로 쓰기 작업이 일어날때만 복사가 일어나게 하는 것은 대부분의 경우 exec가 실행 되면서 기존의 내용이 지워지고 새롭게 적히기 때문이다.
쓰기 작업이 일어날때만 조금씩 수정하면 의미없는 복사 작업을 하지 않아도 된다.

## Thread
리눅스에서 thread는 프로세스와 크게 다르지 않다. 그저 자원을 공유하는 프로세스로 thread를 정의하는 편이 낫다. 실제로, thread와 process를 생성하는 함수는 `clone()`으로 동일하며 flag를 다르게 설정할 뿐이다.
## Kernel Thread
백그라운드에서 진행하고픈 작업이 있을 때, 커널 thread를 사용한다. 커널 thread는 `kthread`라는 하나의 프로세스가 관리하며 모든 커널 thread는 `kthrea`의 자식 thread이다. 커널 thread는 kernel-space에서만 작업할 수 있다.

# Process Terminatioin
프로세스가 `exit()`을 실행하거나 예외가 발생했을 때 프로세스는 종료된다. 프로세스의 종료는 `do_exit()`을 통해 이루어지는데 대략적인 작업 내용은 다음과 같다. 주소공간이나 열어둔 파일 등 점유하고 있던 자원들을 반납하고, 종료되지 않은 자식 프로세스들을 자신의 부모 혹은 조부모 프로세스에게 넘겨준다. 이후 EXIT_ZOMBIE 상태로 스케쥴링에서 빠진다. 
## Orpahn Process
`do_exit()` 이후에도 task_struct는 여전히 존재하며 부모 프로세스에게 자신의 정보를 전달해 준다. 
부모 프로세스가 실행한 `wait()`는 `release_task()`를 통해 task_struct를 삭제함으로써 완전히 프로세스를 종료시킨다. 만약, `wait()`를 사용하기 전에 부모 프로세스가 죽어버리면 남아있는 zombie 자식 프로세스들은 `find_new_reaper()`를 통해 새 부모 프로세스를 받게된다. 그렇지 않으면 영원히 종료되지 않은 채 남아있을 것이기 때문이다. 먼저 부모 프로세스의 thread 그룹에서 새 부모 프로세스를 찾고, 실패할 경우 init 프로세스의 자식 프로세스가 된다.<br/>
ptrace를 통해 디버깅 중인 프로세스의 re-parenting은 조금 더 복잡한데, 이는 디버깅 중에는 원래 부모 프로세스 대신 디버깅 프로세스를 부모 프로세스로 갖기 때문이다. 디버깅이 종료된 이후에는 다시 원래 부모 프로세스로 돌아가야 하는데, 만약 원래 부모 프로세스가 죽으면 찾을 수 없다. 이러한 경우를 대비해서 tracing 중인 자식 리스트를 따로 관리하여 이러한 자식 프로세스들의 새 부모 프로세스를 지정해주도록 한다.
