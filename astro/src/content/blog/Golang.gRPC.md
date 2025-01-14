---
title: 'gRPC in Go'
description: 'Golang에서의 gRPC'
pubDate: 'Jan 14 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Go", "Golang", "gRPC", "REST"]
series: "Golang"
---

>   * [ByteByteGo 'What is RPC? gRPC Introduction.'](https://www.youtube.com/watch?v=gnchfOojMk4&t=16s)
>   * [gRPC 공식 문서](https://grpc.io/docs/)
>   * [GeeksforGeeks 'What is Remote Procedural Call (RPC) Mechanism in Distributed System?'](https://www.geeksforgeeks.org/what-is-rpc-mechanism-in-distributed-system/)

# gRPC(Google Remote Procedure Call)
![image](https://grpc.io/img/logos/grpc-icon-color.png)
gRPC는 서로 다른 프로세스에 대하여 상대의 함수를 원격으로 실행시키는 프로토콜인 RPC(Remote Procedure Call)의 일종으로,
protoBuf와 HTML2를 사용함으로써 높은 성능과 서로 다른 언어간의 호환성을 지원하는 프로토콜이다.
빠른 속도와 서로 다른 언어간 호출이 가능한 특성 덕분에 MSA(Micro-Service Architecture)에서 많이 사용된다.

## Golden Retriever PanCakes

gRPC는 gRPC 프로젝트의 마스코트인 pancake의 준말이기도 하다.
![image](https://raw.githubusercontent.com/grpc/grpc-community/main/PanCakes/Pancakes_Birthday.png)

## RPC(Remote Procedure Call)

RPC는 분산 컴퓨팅 환경 등에서 많이 사용되는 기술로써, 다른 주소 공간에 있는 Procedure(명령 집합, 함수 등)을 실행할 수 있게 한다.
서버가 로컬 메서드를 다루는 것과 같이, 클라이언트도 원격으로 해당 메서드를 다룰 수 있게 하는 것이다.
마치 클라이언트의 로컬 메서드인 것과 같이.

이를 위해서 서버 측의 메서드를 호출할 때 사용하는 stub 객체를 생성한다.
Stub의 메서드를 호출하면, 해당 메서드에 전달된 파라미터들을 압축해 서버에 전달한다.
서버에서는 호출된 메서드를 실행하고, 결과값을 압축해 클라이언트에 전달한다.
전달된 결과값을 복원해 해당 context에 제공하고 클라이언트는 해당 값을 활용할 수 있게 된다.

이러한 RPC에서는 stub을 만드는 것과, 파라미터들을 압축하고 전달하는 과정이 동반된다.
이러한 과정을 어떻게 풀어내는지에 따라 성능이 결정된다.

![image](https://media.geeksforgeeks.org/wp-content/uploads/20240812165636/RPCmechanism.webp)

## gRPC

Google이 개발한 gRPC는 압축 프로토콜으로써의 protoBuf와 HTML2로 인해 빠르며,
IDL로써의 protoBuf로 인해 얻게 된 언어 간 호환성이 뛰어난 RPC이다.

gRPC의 전반적인 작동 흐름은 다음과 같다.
* .proto 파일로 미리 지정해 놓은 message 타입들과 service를 protobuf 컴파일러를 통해 컴파일 하면,
서버 혹은 클라이언트에서 사용하고 있는 언어에 맞게 stub 객체를 만들어 준다.
* Stub 객체 외에도 이러한 객체의 메서드가 호출되면 어떻게 메세지를 전달하고 받아 오는 지에 관한 내용이 담긴
코드가 작성된다.
* 해당 객체의 메서드를 클라언트에서 호출하면, 호출한 내역을 gRPC runtime이 protobuf를 이용해
binary 형태로 압축하여 http 요청을 만들어 전송한다.
* 서버로 전송된 http 요청은 protobuf에 의해 서버의 메서드에 맞게 파라미터 등이 복원된다.
* 복원된 요청을 바탕으로 작업이 수행되고, 결과값은 protoBuf에 의해 압축되어 클라이언트로 전달된다.
* 전달된 결과값은 protoBuf에 의해 복원되고 메서드를 호출한 context에 제공된다.
![image](https://grpc.io/img/landing-2.svg)

.proto 파일에는 다음과 같이 주고 받을 데이터 타입과 제공할 서비스 함수들을 미리 정의한다.

```proto
// The greeter service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
  string name = 2;
}
```

ProtoBuf 컴파일러는 이렇게 정의된 타입과 rpc들을 각 언어에 맞게 컴파일하여 서로 다른 언어끼리 소통이 가능하게 한다.
또한, 미리 정의되어 있는 타입을 사용하여 값들을 전달하기 때문에 필드명 등을 저장할 필요가 없어 http 요청의 크기가 
줄어들게 된다. 따라서 전달 속도가 빨라진다.

이 외에도, multiplexing 등 http1보다 향상된 기능을 제공하는 http2를 사용하기 때문에 gRPC는 다른 RESTful API 등에 비해
월등히 빠른 속도를 자랑한다.
하지만, http2의 고급 기능을 완전히 사용하고 있기 때문에 gRPC는
http2를 완전히 제공하고 있지 못하는 현재의 웹브라우저에서 사용하기 수월하지 않다.

## gRPC with Golang