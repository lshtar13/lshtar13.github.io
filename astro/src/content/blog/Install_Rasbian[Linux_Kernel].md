---
title: 'QEMU에 라즈비안 설치 [Linux Kernel]'
description: 'github codespace에서'
pubDate: 'Oct 07 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Linux", "Kernel", "Raspberry Pi"]
series: "Linux Kernel"
---

# 배경
리눅스 커널 공부함에 있어 디버깅하며 실제 동작을 보기 위해 라즈베리파이를 애뮬레이팅하기로 했다. 
몇몇 강의([강의1](http://www.kocw.net/home/search/kemView.do?kemId=1266434), [강의2](https://www.inflearn.com/roadmaps/1668)들에서 
라즈베리파이를 사용해서 실습을 진행하기에 QEMU에 라즈베리파이를 애뮬레이팅하게 되었다.

# Material
## Codespace
현재 군대 사지방에서 작업을 진행하고 있고, 따로 접근해 개발 가능한 원격 서버가 없기 때문에 github에서 제공하는 codespace를 사용하였다.
## 참고 자료
[Guide](https://azeria-labs.com/emulate-raspberry-pi-with-qemu/)와 [Guide1](https://interrupt.memfault.com/blog/emulating-raspberry-pi-in-qemu)를 참고하였다.

# 설치
1. Codespace 설정
빈 github repo를 만들고, codespace를 만든다.
![image](https://github.com/user-attachments/assets/f8f96eb3-f708-4a8a-afe9-306caac1f2d8)
codespace에 `.github/devcontainer.json`을 만들고 다음 내용을 넣는다.
```
{
    "image": "mcr.microsoft.com/vscode/devcontainers/base:ubuntu-22.04",
    "hostRequirements": {
	"cpus": 4,
	"memory": "8gb",
	"storage": "32gb"
 },
    "runArgs": ["--privileged"],
	"forwardPorts": [2222],
    "portsAttributes": {
	"2222": {
	    "visibility": "public"
	}
    }
}
```
* image 버전
우분투의 버전을 22.04로 명시해 이미지를 로드해야 QEMU의 최신 버전을 사용할 수 있다. 그냥 `ubuntu`이미지를 사용하면, raspberry pi 3b 를 애뮬레이팅하지 못할 수 있다.
* Privileged 모드
Privileged 모드로 로드해야 [loop device](https://w.cublr.com/linux/loop-device/)와 관련하여 문제를 겪지 않는다. 
* Port fowarding
나중에 QEMU로 애뮬레이팅 된 라즈베리 파이에 접속하기 위하여 ssh를 사용하는데 이를 위해선 devcontainer의 2222번 포트를 포워딩 시켜놔야 한다.

2. QEMU 설치
아래 명령어를 통해 QEMU를 설치한다.
```
$ sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get install qemu-system -y
```

3. 라즈베리 파이 이미지 다운로드 및 설정
아래 명령어를 통해 라즈베리파이 압축 이미지를 다운로드하고 압축해제한다.
```
$ wget https://downloads.raspberrypi.org/raspios_arm64/images/raspios_arm64-2023-05-03/2023-05-03-raspios-bullseye-arm64.img.xz
$ xz -d 2023-05-03-raspios-bullseye-arm64.img.xz
```
fdisk를 사용해서 다운로드 받은 이미지 파일의 파티션을 살펴본다.
```
$ fdisk -l ./2023-05-03-raspios-bullseye-arm64.img
```
![image](https://github.com/user-attachments/assets/b9517306-7c49-4681-a8ea-3f325102855e)
첫번째 boot 파티션을 마운트하여 필요한 [디바이스 트리](https://kernel.bz/boardPost/118684/3)와 커널 이미지를 복사하여 작업 영역에 위치시킨다.

4. SSH 설정
`openssl`을 이용해서 유저 정보를 생성하고 이를 boot 파티션에 등록시켜 로그인하게끔 한다.
```
$ openssl passwd -6
Password:
Verifying - Password:
<hash>
$ echo '<hash>' | sudo tee /mnt/image/userconf
$ sudo touch /mnt/image/ssh
```

6. QEMU 실행
이미지 크기를 조정한다.
```
$ qemu-img resize ./2023-05-03-raspios-bullseye-arm64.img 8G
```

아래 명령어를 통해 QEMU를 실행하고
```
$ qemu-system-aarch64 -machine raspi3b -cpu cortex-a72 -nographic -dtb bcm2710-rpi-3-b-plus.dtb -m 1G -smp 4 -kernel kernel8.img -sd 2023-05-03-raspios-bullseye-arm64.img -append "rw earlyprintk loglevel=8 console=ttyAMA0,115200 dwc_otg.lpm_enable=0 root=/dev/mmcblk0p2 rootdelay=1" -device usb-net,netdev=net0 -netdev user,id=net0,hostfwd=tcp::2222-:22
```
2222번 포트로 접근한다.
```
$ ssh -p 2222 pi@localhost
```
![image](https://github.com/user-attachments/assets/246b7c58-1849-44db-9597-75203d52cd4f)
