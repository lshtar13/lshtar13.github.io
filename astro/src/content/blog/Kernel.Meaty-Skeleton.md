---
title: 'OS 개발 - Meaty Skeleton(1)'
description: '튜토리얼 따라하기(2)'
pubDate: 'Apr 10 2025'
updatedDate: 'Apr 15 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Operating System", "OS", "osdev.org", "Tutorial", "Meaty Skeleton"]
series: "OSDev 따라잡기"
hide: false
---

# [Meaty Skeleton](https://wiki.osdev.org/Meaty_Skeleton)

## Makefile

Meaty Skeleton을 분석하기에 앞서서, 이전에 만들었던 barebones를 수정하도록 하겠다.
컴파일 스크립트를 bash 파일로 작성해놨는데, Makefile로 옮겨 적는 것이 유지보수 등에 용이할 듯 싶다.
기존의 스크립트는 다음과 같다. 가독성도 상당히 떨어지고 유지보수에 어려움이 많아 보인다.

```sh
  bootSrc="boot.s"
  bootObj="boot.o"
  kernelSrc="kernel.c"
  kernelObj="kernel.o"
  linkScript="linker.ld"
  binTgt="myos.bin"
  rootPath="sysroot"
  bootPath="$rootPath/boot"
  grubPath="$bootPath/grub"
  isoTgt="myos.iso"

  echo -n "assemble bootstrap file($bootSrc) ... "
  if i686-elf-as $bootSrc -o $bootObj; then
      echo "done!"
  else
      echo "failed-exiting"
      exit 1
  fi

  echo -n "compile kernel source file($kernelSrc) ... "
  if i686-elf-gcc -c $kernelSrc -o $kernelObj -std=gnu99 -ffreestanding -O2 -Wall -Wextra; then
      echo "done!"
  else
      echo "failed-exiting"
      exit 1
  fi

  echo -n "link $bootObj and $kernelObj ... "
  if i686-elf-gcc -T $linkScript -o $binTgt -ffreestanding -O2 -nostdlib $bootObj $kernelObj -lgcc; then
      echo "done!"
  else
      echo "failed-exting"
      exit 1
  fi

  echo -n "verify multiboot ... "
  if grub-file --is-x86-multiboot $binTgt; then
      echo "confirmed!"
  else
      echo "failed"
      exit 1
  fi

  echo -n "create directory $grubPath ... "
  if mkdir -p $grubPath; then
      echo "done!"
  else
      echo "failed-exiting"
      exit 1
  fi

  echo -n "copy $binTgt to $bootPath ... "
  if cp $binTgt $bootPath/$binTgt; then
      echo "done!"
  else
      echo "failed-exiting"
      exit 1
  fi

  echo -n "copy grub.cfg to $grubPath/grub.cfg ... "
  if cp grub.cfg $grubPath/grub.cfg; then
      echo "done!"
  else
      echo "failed-exiting"
      exit 1
  fi

  echo -n "create iso file($isoTgt) from isodir ... "
  if grub-mkrescue -o $isoTgt $rootPath; then
      echo "done!"
  else
      echo "failed-exiting"
      exit 1
  fi

  echo "Run 'qemu-system-i386 -cdrom $isoTgt -curses'!"
```

### 적용

Makefile에서 지향할 목표는 크게 다음 3개이다.

1. 컴파일(어셈블). (.c 혹은 .S => .o)
2. 링크. (.o(1에서 생성한 오브젝트 파일들) => .bin)
3. 검증 및 설치. (multiboot 표준에 부합한지 검증)

옮기면 다음과 같다.

```Makefile
  HOST=i686-elf
  OS=myos

  CC=$(HOST)-gcc
  GRUB=grub-mkrescue

  BIN=$(OS).bin
  ISO=$(OS).iso

  OBJS=\
  boot.o \
  kernel.o \

  LSCRIPT=linker.ld

  LINKS=\
  $(OBJS) \
  -lgcc \

  CFLAGS=-ffreestanding -O2 -Wall -Wextra
  GRUBCFG=\
  menuentry "$(OS)" {\
    multiboot /boot/$(BIN)\
  }\

  ROOTDIR=sysroot
  BOOTDIR=$(ROOTDIR)/boot
  GRUBDIR=$(BOOTDIR)/grub

  .PHONY: all clean myos.bin install-kernel create install-kernel install-grub_cfg
  .SUFFIXES: .o .c .S .iso .cfg

  all: $(BIN)

  $(BIN): $(OBJS) $(LSCRIPT)
    $(CC) -T $(LSCRIPT) -o $@ $(CFLAGS) -nostdlib $(LINKS)
    grub-file --is-x86-multiboot $@

  .c.o:
    $(CC) -MD -c $< -o $@ -std=gnu99 $(CFLAGS)

  .S.o:
    $(CC) -MD -c $< -o $@ $(CFLAGS)

  clean:
    rm -f $(ISO)
    rm -rf $(ROOTDIR)
    rm -f $(BIN)
    rm -f $(OBJS) *.o */*.o */*/*.o
    rm -f $(OBJS:.o=.d) *.d */*.d */*/*.d

  create: $(ISO)

  $(ISO): install-kernel install-grub_cfg
    $(GRUB) -o $@ $(ROOTDIR)

  install-kernel: $(BIN)
    mkdir -p $(BOOTDIR)
    cp $< $(BOOTDIR)

  install-grub_cfg: 
    mkdir -p $(GRUBDIR)
    echo $(GRUBCFG) > $(GRUBDIR)/grub.cfg
```

## System Root

기본적으로 크로스 컴파일러는 호스트(host)의 `/home/usr/include`등에 존재하는 라이브러리들을 이용하지 않는다.
크로스 컴파일러는 만들어질 운영체제(tgt)에 맞는 라이브러리를 사용해야 하기 때문이다.
이 때문에 freestanding 옵션을 설정하고 그랬던 것인데, 개발의 편의를 위해서 system root를 지정해 사용할 수 있다.

디렉토리(dir)를 생성해, 여타의 root directory와 비슷하게 구성해 놓고 컴파일 시에 --sysroot=dir 옵션을 설정하게 되면
해당 디렉토리를 root directory로 인식하여 그 내부에 존재하는 sysroot/usr/include, sysroot/usr/lib 등을 탐색하며
컴파일 및 링크를 진행하게 된다. 이렇게 하게 되면 개발의 용이성이 훨씬 증대된다.

그런데, --sysroot 옵션을 사용하려면 크로스 컴파일러를 빌드할 때 설정해줘야 한다.
크로스 컴파일러 빌드 스크립트 중 [아래 대목](https://wiki.osdev.org/GCC_Cross-Compiler#GCC)에서 
--with-sysroot 옵션을 설정하지 않으면 완성된 크로스 컴파일러에서 --sysroot 옵션을 사용할 수 없다.

```sh
  ../$gccName/configure --target=$TARGET --prefix="$PREFIX" --with-sysroot --disable-nls --enable-languages=c,c++ --without-headers --disable-hosted-libstdcxx
```

빌드 후에도 반드시 --with-sysroot가 설정되었는지 확인해 보아야 한다.

```sh
    i686-elf-gcc -v
    ...
    Target: i686-elf
    Configured with: ../gcc-11.4.0/configure --with-sysroot --target=i686-elf --prefix=/home/lshtar/os/cross --with-sysroot --disable-nls --enable-languages=c,c++ --without-headers --disable-hosted-libstdcxx : (reconfigured) ../gcc-11.4.0/configure --target=i686-elf --prefix=/home/lshtar/os/cross --with-sysroot --disable-nls --enable-languages=c,c++ --without-headers --disable-hosted-libstdcxx : (reconfigured) ../gcc-11.4.0/configure --target=i686-elf --prefix=/home/lshtar/os/cross --disable-nls --enable-languages=c,c++ --without-headers --disable-hosted-libstdcxx
    ...
    gcc version 11.4.0 (GCC) 
```

## [Global Constructor](https://wiki.osdev.org/Calling_Global_Constructors)

소스 파일 중 crti.S와 crtn.S가 존재한다.
주석에는 crtend.o와 crtbegin.o에 대한 언급이 존재한다.
이들은 gcc의 컴파일 과정에서 사용되는 파일들이며 global constructor에 대한 코드가 담겨져 있다.
일반적인 user-space에서의 컴파일시에는 gcc에서 제공하기 때문에 따로 만들어 사용하지 않아도 되는데,
커널 개발과 같은 특수한 상황에 있어서는 따로 만들어 사용해야 한다.

C 프로그램을 개발할 때, 프로그램의 진입점으로 main 함수를 작성한다.
이 main 함수에는 매개변수들이 전달되고, 해당 매개변수를 가지고 main 함수내에 정의되어 있는 작업들이 실행된다.
이 main 함수를 호출하고, 매개변수를 건네주는 역할을 하는 것이 global constructor이다.
항상 진입점을 main 함수로 작성해야 하는 이유가 여기에 있다.
Global constructor에서 진입점을 main으로 설정해 놓았기 때문에, main이 아닌 다른 함수 명을 사용하게 되면 진입할 수 없게 된다.
만약, global constructor를 맞춤제작할 수 있다면 함수 명을 main으로 사용하지 않아도 된다.
우리가 개발하는 커널의 경우가 그렇다. boot.S에서 커널의 시작을 위해 호출하는 함수는 main이 아니라 kernel_main이다.
이는 global constructor를 맞춤제작해 사용하고 있기 때문이다.
더 깊은 이해를 위해 프로그램의 생성과정을 살펴보도록 한다.

하나의 프로그램을 이룰 obj 파일들이 컴파일(foo0.c, foo1.c foo2.S => foo0.o foo1.o foo2.o)을 통해 생성된다.
이렇게 떨어져 있는 obj 파일들을 링커를 이용해 하나의 바이너리 파일로 합친다.
이때 사용하는 명령어는 다음과 같다.

```sh
  i686-elf-gcc foo0.o foo1.o foo2.o -o program
```

위 명령어는 사실 아래 명령어와 다르지 않다.

```sh
  i686-elf-ld crt0.o crti.o crtbegin.o foo0.o foo1.o foo2.o crtend.o crtn.o
```

### crt0.o, crti.o, crtbegin.o, crtend.o, crtn.o

crt0.o, crti.o, crtbegin.o, crtend.o, crtn.o는 gcc에서 제공해주는 파일들로 명시적으로 언급하지 않아도 사용된다.
해당 파일들에는 프로그램의 시작과 끝을 정의한 _init 함수와 _fini 함수가 정의되어있다.

_init는 main에 넘겨줄 매개변수를 처리하고 c 표준 라이브러리를 초기화하며 main 함수를 호출한다.
_fini는 프로그램 종료를 정의한다.
_init와 _fini의 초입부는 crti.o에 정의되어 있으며, 실질적인 작업은 crtbegin.o에 정의 되어있다.
crtn.o는 두 함수의 종료 부분을 정의하고 있다.

_init과 _fini는 crt0.o에 정의된 _start에 의해 호출된다.
커널의 경우, _start가 boot.S에 정의되어 있다.
따라서 crt0.o를 사용할 필요가 없다.
이에 따라 gcc를 이용한 컴파일 시에 crt0.o가 자동으로 추가되지 않도록 -nostartfiles 옵션을 넣어준다.
그러면 gcc는 링크 시에 위 다섯개 파일을 자동으로 추가하지 않는데, _init 혹은 _fini를 사용하려면 위 다섯개 파일을 직접 넣어주어야 한다.
이렇게 직접 넣어주게 되면 _init과 _fini를 직접 만들어 사용할 수도 있다.

이 튜토리얼에 포함되어 있는 crti.S와 crtn.S는 다음과 같다.
해당 파일들을 컴파일 하여 crti.o와 crtn.o를 만든다.

```asm crti.S
  .section .init
  .global _init
  .type _init, @function
  _init:
    push %ebp
    movl %esp, %ebp
    /* gcc will nicely put the contents of crtbegin.o's .init section here. */

  .section .fini
  .global _fini
  .type _fini, @function
  _fini:
    push %ebp
    movl %esp, %ebp
    /* gcc will nicely put the contents of crtbegin.o's .fini section here. */
```

```asm crtn.S
  .section .init
    /* gcc will nicely put the contents of crtend.o's .init section here. */
    popl %ebp
    ret

  .section .fini
    /* gcc will nicely put the contents of crtend.o's .fini section here. */
    popl %ebp
    ret
```

crtbegin.o와 crtend.o는 기존에 사용하던 것들을 사용한다. 해당 파일들의 위치는 다음과 같이 확인할 수 있다.

```sh
  i686-elf-gcc $CFLAGS -print-file-name=crtbegin.o
```

주의해야 할 점은 gcc를 이용해 링크할 때,
crt0.o, crti.o, crtbegin.o, crtend.o, crtn.o의 순서를 반드시 지켜서 적어야 한다는 것이다.

### 적용

위에서 설명한 global constructor 관련된 파일들을 추가하여 커널을 빌드해보자.

crti.S(crti.o)와 crtn.S(crtn.o)는 [튜토리얼](https://wiki.osdev.org/Calling_Global_Constructors)에 제시된대로 구성하였다.
crtbegin.o와 crtend.o는 기존 크로스 컴파일러에서 사용하던 것을 복사해와 사용하였다.
crt0.o는 boot.o가 그 역할을 대신할 것이다.

Makefile에 crtbegin.o와 crtend.o를 복사하는 target을 추가하고,
링크할 파일들을 수정하였다.

```Makefile
...

LINKS=\
crti.o \
crtbegin.o \
$(OBJS) \
crtend.o \
crtn.o \

CFLAGS=-ffreestanding -O2 -Wall -Wextra
GRUBCFG=\
menuentry "$(OS)" {\
	multiboot /boot/$(BIN)\
}\

...

all: $(BIN)

$(BIN): $(LINKS) $(LSCRIPT)
	$(CC) -T $(LSCRIPT) -o $@ $(CFLAGS) -nostdlib -lgcc $(LINKS)
	grub-file --is-x86-multiboot $@

crtbegin.o crtend.o:
	POS=`$(CC) --print-file-name=$@` && cp "$$POS" $@

...

.S.o:
	$(CC) -MD -c $< -o $@ $(CFLAGS)

...
```

## Architecture Dependency

아키텍쳐 의존적 파일들을 그렇지 않은 파일들과 분리하였다.
이 시점에서, 최상위 디렉토리에 기준없이 널부러져 있던 파일들을 kernel 디렉토리를 생성하여 몰아넣었다.
이후 libc를 구현할 것이기 때문에 kernel 관련 파일들을 정리하는 것이 좋다.

기존 kernel.c에서 아키텍쳐 의존적인 코드들을 분리하여 tty.c와 vga.h를 만들었다.
해당 파일들에는, vga의 text mode에 글을 쓰는 코드들이 포함되어 있다.
해당 코드들은 stdint.h 헤더 파일을 참조하는데, 해당 파일은 아키텍쳐 의존적인 파일이라 분리하였다.
tty.c와 vga.h는 arch/i386에 넣었다. 어셈블리(.S)파일들도 아키텍쳐 의존적이라 arch/i386에 넣었다.
이외 의존적이지 않은 tty.h와 kernel.c는 각각 include/kernel와 kernel에 넣었다.
include 디렉토리를 만들어 쓰는 방식은 기능을 추가하기에 편하기때문에 커널을 모듈식으로 제작하려면 필요하다.
해당 방식을 사용하기 위해 gcc의 --sysroot 옵션을 이용하였다.

Makefile도 개편된 디렉토리 구조에 맞게 바꾸었다.
만약, 아키텍쳐를 바꾼다면 arch/에 해당 아키텍쳐에 맞는 코드들을 작성해 넣고
Makefile에서 사용하는 ARCH 변수를 수정해주면 된다.

## libc
