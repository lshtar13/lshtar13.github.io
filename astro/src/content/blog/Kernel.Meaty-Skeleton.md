---
title: 'OS 개발 - Meaty Skeleton'
description: '튜토리얼 따라하기(2)'
pubDate: 'Apr 10 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Operating System", "OS", "osdev.org", "Tutorial", "Meaty Skeleton"]
series: "OSDev 따라잡기"
hide: true
---

# [Meaty Skeleton](https://wiki.osdev.org/Meaty_Skeleton)

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