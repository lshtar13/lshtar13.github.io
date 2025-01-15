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
![gRPC Logo](https://grpc.io/img/logos/grpc-icon-color.png "from https://grpc.io")
gRPC는 서로 다른 프로세스에 대하여 상대의 함수를 원격으로 실행시키는 프로토콜인 RPC(Remote Procedure Call)의 일종으로,
protoBuf와 HTML2를 사용함으로써 높은 성능과 서로 다른 언어간의 호환성을 지원하는 프로토콜이다.
빠른 속도와 서로 다른 언어간 호출이 가능한 특성 덕분에 MSA(Micro-Service Architecture)에서 많이 사용된다.

## Golden Retriever PanCakes

gRPC는 gRPC 프로젝트의 마스코트인 pancake의 준말이기도 하다.
![Golden Retriever PanCakes](https://raw.githubusercontent.com/grpc/grpc-community/main/PanCakes/Pancakes_Birthday.png
"from https://grpc.io")

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

![RPC Flow Chart](https://media.geeksforgeeks.org/wp-content/uploads/20240812165636/RPCmechanism.webp 
"from GeeksforGeeks")

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
![gRPC Flow Chart](https://grpc.io/img/landing-2.svg "from https://grpc.io")

.proto 파일에는 다음과 같이 주고 받을 데이터 타입과 제공할 서비스 함수들을 미리 정의한다.

```protobuf
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

## gRPC in Golang

### Prerequisite

protoBuf와 gRPC 패키지를 설치한다.

```sh
$ apt install -y protobuf-compiler
```

```sh
$ go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
$ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

protoBuf가 접근할 수 있도록 golang 패키지의 위치를 환경변수에 추가한다.

```sh
$ export PATH="$PATH:$(go env GOPATH)/bin"
```

### Proto to Golang

간단한 예제를 통해 어떻게 작성해야 하는지, 어떻게 작동하는지 알아본다.
아래는 간단한 채팅 프로그램을 gRPC를 이용해 golang으로 작성하는 내용이다.

한 프로그램 안에 server와 client를 둘 다 구현할 것이다.
server로 메세지를 받아 출력하고, client를 통해 메세지를 보내는 구조이다.

#### Compile

.proto 파일을 작성하고 컴파일한다.

```protobuf
syntax = "proto3";

option go_package = "github.com/lshtar13/gRPC-chat/chat";

package chat;

service Chat {
    rpc BasicSend(Msg) returns (Ack) {}
    rpc ContSend(stream Msg) returns (Ack){}
}

message Msg{
    string msg = 1;
    string sendTime = 2;
}

message Ack {}
```

service에 서버에서 제공할 메서드의 signature를, message에는 파라미터로 사용할 자료형을 작성하면 된다.
package와 option을 통해 어떤 패키지로 golang에서 import될지, 어떤 파일명으로 만들어질지 정해둔다.
gRPC는 proto3만 지원하기 때문에 proto3의 문법을 사용하다고 명시해두었다.

컴파일 하는 명령어는 다음과 같다.

```sh
$ protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative Your_Path.proto
```

해당 명령어를 실행 하면 두 개 파일이 생성 된다.
package_grpc.pb.go와 package.pb.go이다.
전자는 client와 server에서 사용될 코드를 제공하고, 후자는 message를 압축, 복원, 직렬화 등의 작업을 실행하는 코드이다.

#### Server

서버에서는 .proto에 작성한 서비스를 바탕으로 메서드를 작성한다.
작성하는 메서드들은 하나의 struct의 메서드로 묶는다.
gRPC 서버를 만들고, 해당 서버에 작성한 메서드들이 있는 객체를 넘겨 준다.
이후 Serve()를 통해 요청을 기다린다.

proto파일에 작성한 두 메서드는 사실 같은 역할을 한다.
둘 다, 메세지와 전송 시간을 보내는 메서드이다.
BasicSend는 가장 기본이 되는 gRPC를 이용한 것이고, ContSend는 client-side stream을 이용한 것이다.
BasicSend는 메세지 하나 보내고, 답변을 하나 받아오는 간단한 방식이다.
ConstSens는 메세지를 go channel 사용하듯이, 연속적으로 보낼 수 있다.
서버는 EOF가 들어올 때까지 해당 stream을 통해 메세지들을 받아 볼 수 있다.
다음은 이를 구현한 golang 코드이다.

```go
func (s *server) BasicSend(_ context.Context, msg *pb.Msg) (*pb.Ack, error) {
	txt := msg.Msg
	sendTime, _ := time.Parse(time.RFC3339, msg.SendTime)
	fmt.Printf("%s : %s\n", sendTime.Format("2006-01-02 15:04:05"), txt)
	return &pb.Ack{}, nil
}
```
BasicSend는 msg를 하나 받아와서 ack를 하나 반환하며 끝난다.

```go
func (s *server) ContSend(stream pb.Chat_ContSendServer) error {
	for {
		in, err := stream.Recv()
		if err == io.EOF {
			return stream.SendAndClose(&pb.Ack{})
		} else if err != nil {
			return err
		}

		txt := in.Msg
		sendTime, _ := time.Parse(time.RFC3339, in.SendTime)
		fmt.Printf("%s : %s\n", sendTime.Format("2006-01-02 15:04:05"), txt)
	}
}
```
ContSend는 stream을 받아와, Recv()로 EOF가 나올때까지 값을 읽어낼 수 있다.
이후, SendAndClose()를 통해 ack를 반환하고 끝난다.

서버를 시작하는 코드는 다음과 같다.
```go
func startServer(port int) {
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("fail to listen %v\n", err)
	}

	s := grpc.NewServer()
	pb.RegisterChatServer(s, &server{})
	log.Printf("Start Server at %d ...\n", port)
	s.Serve(lis)
}
```

#### Client

클라이언트는 서버와 연결을 생성하고,
protobuf가 생성한 코드에서 제공하는 메서드를 사용함으로써 서버와 통신한다.
다음은 client의 코드이다.

```go
func startClient(addr string, isBasic bool) {
	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect with %s\n", addr)
	}
	defer conn.Close()

	c := pb.NewChatClient(conn)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	location, _ := time.LoadLocation("Asia/Seoul")

	reader := bufio.NewScanner(os.Stdin)
	if isBasic {
		for {
			reader.Scan()
			msg := reader.Text()
			sendTime := time.Now().In(location).Format(time.RFC3339)

			if msg == "done" {
				break
			}

			_, err := c.BasicSend(ctx, &pb.Msg{Msg: msg, SendTime: sendTime})
			if err != nil {
				log.Fatalf("Failed to send %s to %s\n", msg, addr)
			}
		}
	} else {
		stream, err := c.ContSend(ctx)
		if err != nil {
			log.Fatalf("Failed to connect with %s", addr)
		}

		for {
			reader.Scan()
			msg := reader.Text()
			sendTime := time.Now().In(location).Format(time.RFC3339)

			if msg == "done" {
				_, err := stream.CloseAndRecv()
				if err != nil {
					log.Fatalf("%v.CloseAndRecv() got error %v, want %v", stream, err, nil)
				}
				break
			}

			if err := stream.Send(&pb.Msg{Msg: msg, SendTime: sendTime}); err != nil {
				log.Fatalf("Failed to send %s to %s\n", msg, addr)
			}
		}
	}
}
```

BasicSend를 사용할 때는 BasicSend()를 통해 전송하고,
ContSend를 사용할 때는 ConstSend()가 생성한 stream을 이용해 보내는 것을 알 수 있다.

### Simple Chat Program

완성된 프로그램은 다음과 같이 작동한다.

![grpc-chat](/grpc-chat.png)