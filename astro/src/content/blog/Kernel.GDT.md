---
title: 'OS개발 - GDT'
description: 'GDT Tutorial'
pubDate: 'Apr 22 2025'
#updatedDate: ''
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Operating System", "OS", "osdev.org", "Tutorial", "GDT", "Global Descriptor Table"]
series: "OSDev 따라잡기"
---

# [Global Descriptor Table](https://wiki.osdev.org/GDT_Tutorial)

메모리 관리를 구현할 때, 가상 메모리와 물리 메모리로 계층을 나눠 구현하곤 한다.
가상 메모리를 구현하기 위해선 물리 메모리에 대한 관리가 구현되어야 한다.
x86 아키텍쳐는 Segmentation을 통해서 물리 메모리를 관리한다.
이 Segmentation은 GDT라는 자료구조를 참조해서 작동한다.

## [Segmentation](https://wiki.osdev.org/Segmentation)

Segmentation은 메모리의 구획을 나누어 용도에 맞게 각 구획을 이용하는 방법을 의미한다.
커널 코드, 커널 데이터, 유저 코드, 유저 데이터가 들어가 구획을 미리 나눠놓고,
해당 구획들에 대하여 각각 알맞은 권한이나 제한을 설정한다.
따라서, 해당 제한을 어기는 접근이 일어날 때 fault를 발생하게끔 한다.
메모리에 접근할 때는, 해당 segment를 지칭하는 segment selector(index)와 offset을 전달한다.
그러면, segment에 해당하는 base에 대하여 base + offset이 계산되어 메모리 접근이 이루어지게 된다.

GDT는 segment의 권한과 제한, base와 limit 등을 저장하는 자료구조로써 메모리에 접근할때마다 참조하게 된다.

그러나, 이러한 Segmentation은 이제는 더이상 사용하지 않는 사양된 기술이다.
메모리 관리에 있어서 많이 쓰이는 방법은 Paging으로 Segmentation이 Paging에 영향을 주지 않게 하기 위하여
네가지 segment에 대하여 base가 0x0이며 limit을 전체로 하는 flat mode로 만드는 것이 일반적이다.
여기서는 paging 구현을 궁극적인 목표로 flat mode로 GDT를 구현해보도록 한다.

## GDT Structure

GDT는 GDT entry들로 이루어진다.
GDT entry들은 base, limit, flags, access로 이루어져 있다.
Base는 해당 segment의 시작점을 나타낸다.
Limit은 해당 segment가 가질 수 있는 크기의 제한을 나타낸다.
Flags는 해당 segment에 대한 정보를 저장한다.
예를 들어 해당 segment의 limit 단위가 page인지 byte인지,
16비트 주소 체계인지 32비트 주소 체계인지 등을 나타낸다,
Access에는 해당 세그먼트의 접근 권한이 정의되어 있다.
해당 세그먼트가 code segment인지 data segment인지,
읽기 혹은 쓰기 작업이 허용되는지, ring level이 무엇인지 등이 저장되어 있다.

CPU는 GDT에 대한 정보가 담긴 배열을 lgdt 명령어를 통해 전달바다 활용한다.
GDT배열에 대한 정보를 담은 구조체와, GDT entry 구조체를 C로 구현한 바는 아래와 같다.
GDT entry는 연속적으로 정보를 저장하는 것이 아니라, base와 limit에 대하여 두세개의 부분으로 나누어 저장한다.
이러한 부분들의 배열의 순서와 배치는 반드시 지켜야 한다.
컴파일러가 최적화 과정 중에 패딩을 추가하여 요소들 간의 간격이 생성되는 것은 방지하기 위하여
__attribute__(((packe)))을 꼭 첨부해야 한다.

```c
  #ifndef _ARCH_I386_GDT_H
  #define _ARCH_I386_GDT_H

  #include <stdint.h>

  #define GDT_ENTRY_N 5

  struct gdt_entry {
    uint16_t limit;
    uint16_t base_low;
    uint8_t base_middle;
    uint8_t access;
    uint8_t flags;
    uint8_t base_high;
  } __attribute__((packed));

  struct gdt_ptr {
    uint16_t limit;
    unsigned int base;
  } __attribute__((packed));

  void initGdt();
  void setGdtEntry(uint32_t idx, uint32_t base, uint32_t limit, uint8_t access,
                  uint8_t flags);

  #endif
```

## Set GDT

GDT를 초기화 시키는 코드는 다음과 같다.
첫번째 descriptor는 null descriptor로써 모두 0으로 초기화해준다.
Flat mode로 모든 segment들이 같은 메모리 공간을 공유하도록 base와 limit은 똑같이 설정한다.
각 세그먼트에맞게 접근권한을 설정한다.

```c
  extern void gdt_flush(addr_t);

  struct gdt_entry gdt_entries[GDT_ENTRY_N];
  struct gdt_ptr gdt_ptr;

  void initGdt(){
    gdt_ptr.base = &gdt_entries;
    gdt_ptr.limit = (sizeof(struct gdt_entry)*GDT_ENTRY_N) -1;
    
    setGdtEntry(0, 0, 0, 0, 0);
    setGdtEntry(1, 0, 0xFFFFFFFF, 0x9A, 0xCF); // kcode
    setGdtEntry(2, 0, 0xFFFFFFFF, 0x92, 0xCF); // kdata
    setGdtEntry(3, 0, 0xFFFFFFFF, 0xFA, 0xCF); // ucode
    setGdtEntry(4, 0, 0xFFFFFFFF, 0xF2, 0xCF); // udata
    
    gdt_flush(&gdt_ptr);
  }

  void setGdtEntry(uint32_t idx, uint32_t base, uint32_t limit, uint8_t access,
                  uint8_t gran){
    gdt_entries[idx].base_low = (base & 0xFFFF);
    gdt_entries[idx].base_middle = (base>>16) & 0xFF;
    gdt_entries[idx].base_high = (base >> 24) & 0xFF;

    gdt_entries[idx].limit= (limit & 0xFFFF);
    gdt_entries[idx].flags= (limit>>16) & 0x0F;
    gdt_entries[idx].flags |=(gran&0xF0);

    gdt_entries[idx].access = access;
  }
```

gdt_flush 함수는 완성된 GDT를 lgdt를 이용해 등록하는 과정을 담고 있다.

```asm
  .global gdt_flush

  gdt_flush:
    movl 4(%esp), %eax
    lgdtl (%eax)
    
    movl $0x10, %eax
    jmpl $0x08, $.reload_cs
  .reload_cs:
    movw %ax, %ds
    movw %ax, %es
    movw %ax, %fs
    movw %ax, %gs
    movw %ax, %ss

    ret
```

# Debugging

이 튜토리얼을 진행하면서 커널 디버깅하는 법을 배우게 되었다.
처음에 함수들을 구현하고 컴파일한 후 실행하니 부팅이 실패하고 무한 로딩이 진행되었다.
어느 부분에서 실패하는지 알 수가 없었다.
[유튜브](https://www.youtube.com/watch?v=q5vagAJ2YH8)를 통해
gdb를 이용해 qemu에 띄운 커널에 대한 디버깅하는 법을 배우게 되었다.

원활한 디버깅을 위해 gcc 컴파일 옵션에 -g를 포함시켜 디버깅 심볼들을 남기게 하였다.
최적화하는 옵션인 -O2를 제거하여 소스파일과 비교하여 디버깅할 수 있도록 하였다.
qemu를 실행함에 있어서 -s -S 옵션을 추가한다.
해당 옵션들로 인해서 1234 포트를 이용하여 gdb와 qemu가 소통할 수 있게 된다.
`gdb myos.bin`을 실행하고, `target remote :1234`를 입력하여 qemu의 가상머신과 매칭한다.
이후 브레이크 포인트 등을 설정하여 디버깅하면 된다.