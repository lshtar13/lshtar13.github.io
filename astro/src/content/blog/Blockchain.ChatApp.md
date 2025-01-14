---
title: 'ChatApp 구현'
description: '구상'
pubDate: 'Jan 13 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Blockchain"]
series: "Blockchain"
hide: true
---

# 구상

P2P 메세징 플랫폼.
1번째 장애 . 비밀키 교환 ... 
1. handshake ==> 비밀키 전송(상대의 pubKey로 암호화한)
2. 메세지 작성하고, 암호화해서 output에 저장.
3. 추가로 output에는 miner를 위한 수수료, 저장을 위한 수수료가 들어있다.
4. receiver는 output을 확인하고, 저장을 취소하는 tx를 발행한다.
5. node들은 block들을 저장하고, 메세지 내용을 저장한다.