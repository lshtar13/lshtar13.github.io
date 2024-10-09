---
title: 'QEMU에 라즈비안 설치 (in github codespace) [Linux Kernel]'
description: '작성 중'
pubDate: 'Oct 07 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Linux", "Kernel"]
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
codespace에 `.github/


3. QEMU 설치
4. 라즈베리 파이 이미지 다운로드
5. SSH 설정
6. QEMU 실행

[Guide](https://azeria-labs.com/emulate-raspberry-pi-with-qemu/)
[Loop Device](https://www.lenovo.com/us/en/glossary/loop-device/?orgRef=https%253A%252F%252Fwww.google.com%252F&srsltid=AfmBOooEigEwZHL0w-3GUvmXSuVx3iexUbaKzVzSxkJUXrgS3p4uIlkH)
[Guide1](https://interrupt.memfault.com/blog/emulating-raspberry-pi-in-qemu)
* devcontainer 설정 시 포트 포워딩(나중 접속 시 문제), privileged 모드 설정(loop device 문제), 우분투 비교적 최신 버전 명시(qemu 지원 아키텍쳐)
