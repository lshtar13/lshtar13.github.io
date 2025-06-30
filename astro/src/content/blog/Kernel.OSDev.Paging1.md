---
title: 'OS개발 - Paging(1)'
description: '귀찮은 일은 최소로'
pubDate: 'Jun 29 2025'
#updatedDate: ''
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Operating System", "OS", "osdev.org", "Tutorial", "Paging"]
series: "OSDev 따라잡기"
---
# Issues

기존에 구현하였던 기초적인 paging을 변형하여, higher half 커널을 구현하고 동적으로 page를 할당하는 로직을 구현하였다.

## [Higher Half](https://wiki.osdev.org/Higher_Half_Kernel)

많은 운영체제들이 커널 코드을 0xC0000000에 위치시킨다.
이전에 설계한 코드에서는 0x0000000에 커널 코드가 위치하는데
대부분의 컴파일러와 링커를 통해 만들어진 프로그램들, 라이브러리 등이 0x00000000 위치하기 때문에
커널은 0xC0000000에 옮겨 놓을 필요가 있다.
이러한 작업은 현재 아는 바에 따르면 boot시에 이루어져야 한다.
컴파일 및 링크 시 코드가 0xC0000000에 위치해 있다고 가정하고 만들어진다.
코드에서 함수를 호출할 때 0xC0000000를 기준으로 호출한다.
그러나, 처음 부팅하였을 때는 0x00000000에 위치해 있는다.
따라서 이러한 불일치를 해결해 주어야 한다.

```asm
# Declare constants for the multiboot header.
.set ALIGN,    1<<0             # align loaded modules on page boundaries
.set MEMINFO,  1<<1             # provide memory map
.set FLAGS,    ALIGN | MEMINFO  # this is the Multiboot 'flag' field
.set MAGIC,    0x1BADB002       # 'magic number' lets bootloader find the header
.set CHECKSUM, -(MAGIC + FLAGS) # checksum of above, to prove we are multiboot

# Declare a multiboot header that marks the program as a kernel.
.section .multiboot.data, "aw"
.align 4
.long MAGIC
.long FLAGS
.long CHECKSUM

# Allocate the initial stack.
.section .bootstrap_stack, "aw", @nobits
stack_bottom:
.skip 16384 # 16 KiB
stack_top:

# Preallocate pages used for paging. Don't hard-code addresses and assume they
# are available, as the bootloader might have loaded its multiboot structures or
# modules there. This lets the bootloader know it must avoid the addresses.
.section .bss, "aw", @nobits
.global boot_page_directory
.global boot_page_table1 
.global swap_page_table0
.global swap_page_table1
	.align 4096
boot_page_directory:
	.skip 4096
boot_page_table1:
	.skip 4096
swap_page_table0:
	.skip 4096
swap_page_table1:
	.skip 4096
# Further page tables may be required if the kernel grows beyond 3 MiB.

# The kernel entry point.
.section .multiboot.text, "a"
.global _start
.type _start, @function
_start:
	# set page table (kernel)
	movl $(boot_page_table1 - 0xC0000000), %edi
	movl $0, %esi
	movl $1023, %ecx

1:
	# map only kernel codes 
	cmpl $startkernel, %esi
	jl 2f

	# mapping done
	cmpl $(endkernel - 0xC0000000), %esi
	jge 3f

	# set table 
	# esi => physical address
	movl %esi, %edx
	# flags (present)
	orl $0x003, %edx
	movl %edx, (%edi)

2:
	# next page
	addl $4096, %esi
	addl $4, %edi
	loop 1b

3:
	# VGA text buffer
	movl $(0x000B8000 | 0x003), boot_page_table1 - 0xC0000000 + 1023 * 4

	# sharing page table between identity paging and higher half
	# identity paging
	movl $(boot_page_table1 - 0xC0000000 + 0x003), boot_page_directory - 0xC0000000 + 0
	# higher half
	movl $(boot_page_table1 - 0xC0000000 + 0x003), boot_page_directory - 0xC0000000 + 768 * 4

	# set register(page directory)
	movl $(boot_page_directory - 0xC0000000), %ecx
	movl %ecx, %cr3

	# enable paging
	movl %cr0, %ecx
	orl $0x80010000, %ecx
	movl %ecx, %cr0

	# jump to higher half
	lea 4f, %ecx
	jmp *%ecx

.section .text

4:
	# erase identity paging
	movl $0, boot_page_directory + 0

	# flush tlb cache 
	movl %cr3, %ecx
	movl %ecx, %cr3

	mov $stack_top, %esp

	call kernel_main

	cli
1:	hlt
	jmp 1b
```

## [Recursive Mapping](https://wiki.osdev.org/User:Neon/Recursive_Paging)

0xD0000000에 모든 table을 담은 page들을 위치시키는 식으로 해결하였다.
확장성이 많이 떨어지는 접근법으로 수정이 필요하다.

## 후기

Paging을 본격적으로 구현하기로 마음을 먹으니,
초보 단계임을 고려했을 때 생각해봐야 할 문제가 꽤나 많고 복잡하였다.
내 특유의 문제를 회피하려는 성향과 이러한 문제들이 만나 상당한 정체를 빚어내었다.
사실 크게 어려운 부분은 없었다고 회고할 수 있겠지만 처음 이슈들을 마주했을 때는 