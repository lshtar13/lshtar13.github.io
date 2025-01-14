---
title: 'Ch5. System Calls [Linux_Kernel]'
description: 'Linux Kernel Development 3rd'
pubDate: 'Oct 11 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Linux", "Kernel", "System Calls", "Syscall"]
series: "Linux Kernel"
---

# Material
Robter Love의 [Linux Kernel Development 3rd](https://www.amazon.com/Linux-Kernel-Development-Robert-Love/dp/0672329468)를 공부하며 정리한 것. 리눅스 커널 `v3.0` 기준.

# System Call
User-space에서는 kernel-space에 마음대로 접근할 수 없다. 시스템 자원과 커널 주소 공간에 유저 프로세스가 접근할 수 있다면, 보안 그리고 시스템 관리 상에 큰 문제가 생길것이다.
이러한 상황을 피하는 동시에 유저 프로세스가 시스템 자원을 효과적으로 활용할 수 있도록 API와 시스템 콜을 이용한다.
## POSIX API
API(Application Programming Interface)는 시스템 콜의 wrapper로, 프로그램이 시스템 콜을 직접적으로 호출하지 않고 C 라이브러리에 구현되어 있는 인터페이스를 사용하여 간접적으로 시스템 콜을 사용할 수 있도록 한다.
시스템 콜을 하드웨어 아키텍쳐 그리고 운영체제에 따라 다르게 구현되어 있기 때문에 프로그램이 시스템 콜을 직접 호출하게 되면, 프로그램의 이식성이 저해되고 구현이 복잡해진다. 
이러한 문제를 해결하고자 gblic 등의 표준 C 라이브러리는 API를 제공해 추상화를 지원한다. 프로그램은 시스템 콜을 고려하지 않고 API만 사용하면 된다. 
실제로 시스템콜을 호출하고 그 결과를 처리하는 것은 각 C 라이브러리가 처리하기 때문이다.
## Syscall
시스콜(Syscall)은 시스템 콜의 준말이다. 시스콜은 프로세스가 user-space에서 kernel-space로 진입할 유일한 정상적인 경로이다. 
이러한 시스콜의 처리는 아래와 같이 interrupt를 이용해 이루어진다.
1. API를 제공하는 C라이브러리는 필요한 시스콜의 호출 번호를 %eax 레지스터(x86 기준)에 저장한다.
2. `int $0x80` 명령어를 통해 `interrupt`(128번 interrupt는 시스템 콜 핸들러인 system_call()을 실행시킨다)를 발생시키고 kernel-space로 진입한다.
3. %eax에 담긴 호출번호를 바탕으로 알맞은 시스템 콜 함수를 찾는다.
4. 레지스터 혹은 스택에 저장되어 있는 매개변수를 참조하여 시스템 콜 함수를 실행한다.
5. 실행 결과를 %eax에 담아 user-space로 복귀한다.

# Implementation
시스템 콜은 `SYSCALL_DEFINE{n}(SYSCALL_NAME, TYPE_0, PARAM_0, TYPE_1, PARAM_1, ...)` 매크로를 통해 구현 가능하다. 이 매크로를 이용하여 syscalls.h에 프로토타입을, sys.c에 함수 구현을 작성하면 된다.
작성된 시스템 콜은 시스템 콜 핸들러가 처리할 수 있도록 고유의 호출 번호가 있어야 한다. entry.S와 asm/unistd.h에 시스템 콜을 추가하여 호출번호를 추가한다. 
entry.S에 등록한 호출 번호를 통해 시스템 콜 핸들러가 적절한 시스템 콜을 찾아 호출하게 된다. unistd.h에 등록된 호출번호를 통하여 API를 제공하는 C라이브러리가 올바른 어셈블리 명령을 조합하게 한다. 
이러한 방법을 사용하면 어떤 아키텍쳐(구현했다면)에서도 실행가능한 이식성이 뛰어나 시스템콜을 얻게 된다.
## Inspection
시스템 콜을 구현함에 있어 매개변수의 적절성 조사는 필수적이다. 시스템 콜을 수행하는데 필요한 자원들에 대한 권한이 해당 프로세스에게 없을 수도 있고, 전달한 내용이 유효하지 않을 수 있다.
대표적으로 신경써야하는 것들은 다음과 같다.
* Pointer
  User-space에서 전달한 포인터는 user-space의 주소를 가리키고 있어야 한다. User-space에서는 커널 주소 공간에 접근할 수 없으며, kernel-space의 데이터를 직접적으로 읽을 수 없다.
  다른 프로세스의 주소 공간을 참조하는 것 또한 방지해야 한다. 메모리의 상태에 맞게, 읽기만 가능한 상태면 읽기만, 쓰기만 가능한 상태면 쓰기만 수행되도록 해야한다. 그러한 상태를 뛰어넘는 접근은 금지되어야 한다.
  이러한 확인 작업과 동시에 주소 공간에 읽고 쓰는 작업을 실행하는 함수가 `copy_to_user()`와 `copy_from_user()`이다. 아래와 같이 확인 작업(`access_ok()`)을 먼저 수행한다.
  ```c
  unsigned long
  copy_to_user(void __user *to, const void *from, unsigned long n)
  {
  	if (access_ok(VERIFY_WRITE, to, n))
  		n = __copy_to_user(to, from, n);
  	return n;
  }
  ```
* Authority(Capability)
  커널은 어떤 자원에 대하여 사용자가 권한을 가지고 있는지 `capable()`을 이용하여 확인한다. `capable(CAP_SYS_NICE)`는 호출한 대상이 다른 프로세스의 나이스 값을 수정할 수 있는 능력이 있는지 확인한다. 다음은 reboot 시스템 콜이다.
  재부팅에 관한 권한을 확인하는 부분을 확인할 수 있다.
  ```
  SYSCALL_DEFINE4(reboot, int, magic1, int, magic2, unsigned int, cmd,
		  void __user *, arg)
  {
  	char buffer[256];
  	int ret = 0;
  
  	/* We only trust the superuser with rebooting the system. */
  	if (!capable(CAP_SYS_BOOT))
  		return -EPERM;
  
  	/* For safety, we require "magic" arguments. */
  	if (magic1 != LINUX_REBOOT_MAGIC1 ||
  	    (magic2 != LINUX_REBOOT_MAGIC2 &&
  	                magic2 != LINUX_REBOOT_MAGIC2A &&
  			magic2 != LINUX_REBOOT_MAGIC2B &&
  	                magic2 != LINUX_REBOOT_MAGIC2C))
  		return -EINVAL;
  
  	/* Instead of trying to make the power_off code look like
  	 * halt when pm_power_off is not set do it the easy way.
  	 */
  	if ((cmd == LINUX_REBOOT_CMD_POWER_OFF) && !pm_power_off)
  		cmd = LINUX_REBOOT_CMD_HALT;
  
  	mutex_lock(&reboot_mutex);
  	switch (cmd) {
  	case LINUX_REBOOT_CMD_RESTART:
  		kernel_restart(NULL);
  		break;
  
  	case LINUX_REBOOT_CMD_CAD_ON:
  		C_A_D = 1;
  		break;
  
  	case LINUX_REBOOT_CMD_CAD_OFF:
  		C_A_D = 0;
  		break;
  
  	case LINUX_REBOOT_CMD_HALT:
  		kernel_halt();
  		do_exit(0);
  		panic("cannot halt");
  
  	case LINUX_REBOOT_CMD_POWER_OFF:
  		kernel_power_off();
  		do_exit(0);
  		break;
  
  	case LINUX_REBOOT_CMD_RESTART2:
  		if (strncpy_from_user(&buffer[0], arg, sizeof(buffer) - 1) < 0) {
  			ret = -EFAULT;
  			break;
  		}
  		buffer[sizeof(buffer) - 1] = '\0';
  
  		kernel_restart(buffer);
  		break;
  
  #ifdef CONFIG_KEXEC
  	case LINUX_REBOOT_CMD_KEXEC:
  		ret = kernel_kexec();
  		break;
  #endif
  
  #ifdef CONFIG_HIBERNATION
  	case LINUX_REBOOT_CMD_SW_SUSPEND:
  		ret = hibernate();
  		break;
  #endif
  
  	default:
  		ret = -EINVAL;
  		break;
  	}
  	mutex_unlock(&reboot_mutex);
  	return ret;
  }
  ```
