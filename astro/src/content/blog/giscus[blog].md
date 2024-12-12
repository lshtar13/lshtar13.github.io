---
title: 'Giscus를 이용한 블로그 댓글 기능 추가'
description: '1분 컷'
pubDate: 'Dec 12 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Blog", "Astro", "Giscus"]
series: "Blog"
---

# 댓글 기능

## 배경

Github 페이지를 이용한 정적 웹페이지 호스팅으로 운영되는
이 블로그를 찾아와주시는 몇명 안되는 고마운 독자분(사실 한 명)들께로부터 흥미로운 제안을 들었다.

댓글 기능을 만들어 운영하면 좋을 것 같다고 하셨다. 방법도 제안해주셨는데
Giscus를 이용해 만들면 쉬울 것이라고 하셔서 한번 시도 해봤다.

진짜 쉽고 간단하게 댓글 기능을 추가할 수 있었다.

## 과정

Giscus는 github의 discussion으로 구성된다.
특정한 레포지토리에 discussion에 댓글을 저장해놓고,
웹페이지가 로딩될 때 그 discussion들을 불러와서 보여주는 식이다.

이를 위해선, 특정한 github 레포지토리에 [giscus 앱](https://github.com/apps/giscus)을 설치하고
해당 레포의 disscusion을 활성화해야 한다.

이후, [giscus 설정 페이지](https://giscus.app/ko)에 들어가서
html 태그를 구성한다.

![image](/giscus0.png)

해당 태그를 블로그 포스트의 웹 페이지의 적절한 위치에 추가하면 된다.
현재 Astro를 이용하고 있는데, `src/components/BlogPost.astro`에 추가하였다.
Sidebar를 방해하지 않게, `<article>`태그 안에 넣어준다.

![image](/giscus1.png)

아래와 같이 댓글과 반응 남기기 기능이 추가된 것을 확인할 수 있다.