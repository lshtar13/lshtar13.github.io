---
title: '<Blockchain in Go> 따라해보기'
description: '과정과 후기'
pubDate: 'Jan 12 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS",]
series: "Bitcoin"
---

# Mimicking <[Blockchain in Go](https://github.com/Jeiwan/blockchain_go)>

## Abstract

[Ivan Kuznetsov](https://github.com/Jeiwan)가 작성한 [블로그](https://jeiwan.net/)포스트를 보고,
[github](https://github.com/Jeiwan/blockchain_go)에 게시한 코드들을 따라 치며 블록체인을 공부한 후기이다.
책만 읽는 것보다 훨씬 많은 도움이 되었다. 코드 구조도 나에게 편한 대로 재구성하며 블록체인에 대한 이해가 늘어나는 계기가 되었다.
또한, golang에 보다 친숙해지는 효과도 얻었다. 

굉장히 잘 쓰여진 블록체인 입문서이지만, 네트워크 등의 부분에서 상당히 허술한 면을 보이고 있다.
P2P 네트워크에 대하여 아주 간단하게만 작성하고 넘어가고 있어 갈증을 채워주지 못하고 있다.
또한, 전반적으로 특정한 디자인 패턴 없이 가독성이 떨어지는 코드를 제공하고 있다.

## Motivation

블록체인에 대해 근본적으로, 또 능동적으로 배우고 싶다는 생각에 시작하게 되었다.

처음에는 [Mastering Bitcoin](https://github.com/bitcoinbook/bitcoinbook)을 읽으며 공부하였지만,
쏟아지는 설명들을 코드 한 줄 없이, 입력에 따라 바뀌는 출력없이 공부하자니 답답하기도 하고 이해가 잘 안되었다.
따라서, 직접 따라하면서 블록체인과 비트코인을 배워볼 수 있는 학습 자료를 찾다가
[Jeiwan/blockchain_go](https://github.com/Jeiwan/blockchain_go) 레포를 깃허브에서 발견하였다.

해당 레포는 단계별로 따라 할 수 있게끔 나뉘어져 있었고,
코드에 대한 설명이 블로그에 포스팅되어 있어 공부를 시작하기에 좋아보여 시작하였다.

## Content

총 7개의 포스팅으로 구성되어있다.

1. [Basic Prototype](https://jeiwan.net/posts/building-blockchain-in-go-part-1/)
2. [Proof-of-Work](https://jeiwan.net/posts/building-blockchain-in-go-part-2/)
3. [Persistence and CLI](https://jeiwan.net/posts/building-blockchain-in-go-part-3/)
4. [Transactions 1](https://jeiwan.net/posts/building-blockchain-in-go-part-4/)
5. [Addresses](https://jeiwan.net/posts/building-blockchain-in-go-part-5/)
6. [Transactions 2](https://jeiwan.net/posts/building-blockchain-in-go-part-6/)
7. [Network](https://jeiwan.net/posts/building-blockchain-in-go-part-7/)

각 포스트의 제목에 따라, 해당 기능을 구현하는 내용이 적혀져 있다.
포스트를 읽고 따라 코딩함에 있어 주의할 사항은 다음과 같다.

* 저자도 언급하고 있지만 포스트가 넘어갈 때 마다 
코드가 많이 바뀌며 변경사항을 전부 설명해주고 있는 것은 아니기 때문에 github를 수시로 확인해야 한다.

* 작성된지 10년이 다 되어가는 코드이기 때문에 최신 버전의 golang과는 맞지 않는 부분이 존재한다.
예를 들어, 
  - Deprecate된 ioutil 패키지 사용하고 있다([참고](https://wookiist.dev/89)).
  -  구조체를 직렬화 하여 저장하고 다시 불러오는 기능을 구현함에 있어,
  private key와 public key에 대하여 golang 버전 관련한 문제가 발생한다([참고](https://github.com/golang/go/issues/57422)). 
  해당 문제는 파일로 저장할 때 사용할 때 사용하는 별도 구조체를 만들어 해결하였다.

* 저자도 언급하고 있지만 7번째 네트워크 부분이 너무 부실하다. 부족한 부분은 다른 책들을 읽으며 보충해나갈 계획이다.

## Methodology

포스트를 먼저 정독하고, 해당 포스트에서 설명한 기능들을 최대한 코드를 참고하지 않고 따라 만들어가며 공부하였다.
만들고, 출력값을 포스트에 나온 것과 비교해가며 수정하였다. 그러하다 보니 원본 코드와는 조금 다른 코드가 완성되었다.
특히 7번째 네트워크 부분은 마음에 안들어 많은 수정을 하였다.

## Conclusion

블록체인, 비트코인에 대한 전반적인 지식을 얻는 데 매우 큰 도움이 되었다.
무엇보다, 반쪽짜리이긴 하다만 작동하는 블록체인을 손수 코딩해보아 좋은 경험이었다.
여기서 배운 내용을 바탕으로 더 복잡한 블록체인을 구현해 볼 것이다.
[지금까지 구현한 것](https://github.com/lshtar13/BlockHoldem/)

저자는 database로써의 블록체인과 network_node로써의 블록체인을 분리해서 설명하였다.
이 포스팅들은 database로써의 블록체인을 많이 치중하고 있다.
Network와 관련된 부분을 다른 학습자료들을 찾아 보며 공부할 예정이다.
현재 예정하고 있는 것은 
<[Build a blockchain from scratch in Go with gRPC](https://github.com/volodymyrprokopyuk/go-blockchain)> 이다.
Network node로써의 블록체인을 자세히 설명하고 있는 것 같다.
이외에도 smart contract 등을 공부할 예정이다.

궁극적으로는, 나만의 On-Chain Gaming 플랫폼을 만드는 것이 목표이다.
