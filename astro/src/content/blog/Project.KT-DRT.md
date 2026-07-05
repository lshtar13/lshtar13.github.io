---
title: '114 연계형 DRT AI 콜센터 만들기'
description: 'KT 디지털인재장학생 사회공헌 프로젝트에서 실제 전화와 AI 서버 없이 AI 콜센터 백엔드 PoC를 설계한 과정'
pubDate: 'Jul 05 2026'
tags: ['DRT', 'AI Call Center', 'Asterisk', 'SIP', 'Backend']
series: 'KT 디지털인재장학생 26학년도 사회공헌 프로젝트 X 한국교통안전공단'
---

# 배경

KT 디지털인재장학생 26학년도 사회공헌 프로젝트로 한국교통안전공단과 함께
114 연계형 DRT AI 콜센터를 만드는 프로젝트를 진행하게 되었다.

DRT는 Demand Responsive Transport, 수요응답형 교통체계이다.
정해진 노선을 계속 도는 버스와 달리 승객의 호출에 따라 운행 경로와 시간이 정해진다.
앱 사용이 익숙한 사람이라면 앱에서 출발지와 목적지를 넣고 예약하면 되지만,
누구에게나 앱이 가장 편한 인터페이스인 것은 아니다.

특히 고령자나 디지털 기기 사용이 익숙하지 않은 이용자에게는 전화가 더 자연스럽다.
114에 전화해 사람과 이야기하듯 출발지와 목적지, 시간을 말하면 DRT 예약까지 이어지는 것.
이번 프로젝트에서 만들고자 하는 것이 대략 그런 형태의 AI 콜센터이다.

# 문제

그런데 시작부터 없는 것이 많았다.

```text
- 실제 114 또는 070 전화 회선
- 통신사 SIP Trunk
- 실제 음성 AI 서버
- 실제 DRT 예약 API
```

말 그대로 콜센터를 만들어야 하는데 전화 회선도 없고,
예약 시스템을 연동해야 하는데 예약 API도 없는 상황이다.
그렇다고 외부 시스템이 준비될 때까지 기다리고만 있을 수는 없었다.

그래서 프로젝트 전체를 한 번에 완성하려 하지 않고,
각 외부 시스템을 mock으로 바꾸어 백엔드의 데이터 흐름부터 끝까지 검증하기로 하였다.

```text
Linphone
→ Asterisk
→ AudioSocket
→ Voice Session Server
→ Mock STT / Dialog / TTS
→ Mock DRT Backend API
→ Database / Logs
```

실제 전화기 대신 Linphone을 사용하고, Asterisk를 작은 전화 교환기로 사용한다.
실제 STT, LLM, TTS와 DRT API는 정해진 값을 반환하는 mock으로 대체한다.

이렇게 하면 당장 실제 예약 한 건을 만들 수는 없어도,
전화 한 통이 들어와 하나의 세션이 되고, 대화를 거쳐 예약 API를 호출한 뒤,
통화가 끝나면 사용하던 리소스가 정리되는지는 확인할 수 있다.

# 어디까지 검증할 것인가

이번 PoC의 목표는 AI의 인식률이나 자연스러운 목소리를 보여주는 것이 아니다.
전화형 AI 서비스의 백엔드가 가져야 할 기본 골격이 실제로 이어지는지를 보는 것이다.

확인하려는 것은 다음과 같다.

1. 전화 한 통마다 독립적인 세션이 만들어지는가?
2. 통화 음성이 백엔드 스트림 서버까지 도달하는가?
3. 서로 다른 통화의 대화 상태가 섞이지 않는가?
4. transcript가 대화 상태 머신을 따라 흘러가는가?
5. DRT 예약 API를 호출하고 그 결과를 저장할 수 있는가?
6. 통화 종료 후 연결과 세션이 정상적으로 정리되는가?
7. 여러 통화를 반복해도 세션이나 goroutine이 남지 않는가?

결국 멋진 AI 데모보다 먼저 확인해야 하는 것은
`전화 한 통 = 백엔드 세션 하나`라는 가장 기본적인 규칙이다.

# PBX와 Asterisk

처음에는 전화가 서버로 들어온 이후만 생각했다.
음성을 STT로 넘기고, LLM이 답을 만들고, TTS로 다시 재생하면 될 것 같았다.
하지만 그 전에 실제 전화 통화를 받아 백엔드로 넘겨줄 계층이 필요하다.

그 역할을 하는 것이 PBX(Private Branch Exchange)이다.
회사 내선 전화를 관리하는 작은 전화국과 비슷하다.

```text
외부 전화 또는 SIP 단말
        ↓
       PBX
        ├─ 내선 1001
        ├─ 내선 1002
        └─ 내선 9000: AI 콜봇
```

이번 PoC에서 PBX는 AI 서버가 아니다.
전화를 받고, 어느 내선으로 보낼지 결정하고,
AI 콜봇으로 들어온 통화의 음성을 Voice Session Server에 넘기는 Call Gateway이다.

Asterisk와 FreePBX를 후보로 두었고,
우선 Asterisk를 OCI VM에 직접 설치해 SIP 단말 등록과 RTP 음성 송수신부터 확인하기로 하였다.
AI 서버를 붙이기도 전에 전화가 제대로 연결되지 않는다면 그 뒤의 구조는 아무 의미가 없기 때문이다.

# Voice Session Server

일반적인 HTTP API는 요청을 받고 응답을 돌려주면 일이 끝난다.
반면 통화는 몇 분 동안 연결이 유지되며 그 안에서 음성, transcript, API 호출과 응답이 계속 오간다.

따라서 Voice Session Server는 단순한 API 서버가 아니라
통화가 유지되는 동안 함께 살아 있는 session runtime에 가깝다.

```text
전화 한 통
= CallSession 하나
= audio input
+ transcript
+ dialog state
+ collected slots
+ API calls
+ response output
+ logs
```

각 `CallSession`은 자신의 이벤트 큐와 종료 신호를 가진다.
통화가 끝나면 음성 reader, dialog processor, output writer를 모두 취소하고
SessionManager의 active session 목록에서도 제거해야 한다.

이 부분이 제대로 처리되지 않으면 통화는 끝났는데 백엔드에는 연결이나 작업이 계속 남는다.
한두 번의 데모에서는 보이지 않다가 반복 콜 테스트에서 터지기 딱 좋은 문제다.

# 음성을 대화로 바꾸는 과정

AudioSocket에서 받은 packet을 바로 LLM에 넣을 수는 없다.
packet은 네트워크가 잘라놓은 오디오 조각일 뿐, 사람이 말한 문장 단위가 아니기 때문이다.

```text
AudioSocket PCM
→ Audio Frame Buffer
→ VAD / Endpointing
→ STT
→ Transcript Event
→ Dialog Orchestrator
```

VAD로 사용자가 말하기 시작하고 끝난 시점을 찾아 하나의 발화로 묶은 뒤 STT에 전달한다.
침묵 시간을 너무 짧게 잡으면 생각하며 말한 문장이 중간에 잘리고,
너무 길게 잡으면 AI의 응답이 답답할 정도로 늦어진다.

현재 단계에서는 실제 VAD와 STT까지 바로 구현하지 않는다.
AudioSocket packet 수와 byte 수를 기록해 음성이 도달했는지만 확인하고,
transcript는 시나리오나 테스트 API를 통해 주입한다.

실제 구현을 뒤로 미룬다고 구조까지 미루는 것은 아니다.
mock과 실제 구현이 같은 interface를 사용하게 만들어,
나중에는 adapter만 바꾸어 끼울 수 있도록 할 계획이다.

# LLM을 마음대로 말하게 두지 않기

콜센터에서 LLM은 그럴듯한 문장을 만드는 것만으로는 부족하다.
사용자의 예약을 실제로 생성하거나 취소할 수 있기 때문에
무슨 행동을 할 것인지 정해진 형식으로 반환해야 한다.

LLM에는 transcript만 던지는 대신 현재 통화 상태를 함께 전달한다.

```text
DialogRequest
= current state
+ collected slots
+ latest transcript
+ recent history
+ available actions
+ available tools
+ policy
```

출력 역시 자유 텍스트가 아니라 구조화된 `DialogAction`으로 받는다.

```json
{
  "action": "CALL_TOOL",
  "next_state": "CHECK_AVAILABILITY",
  "slot_updates": {
    "origin": "집",
    "destination": "서울대병원",
    "requested_time": "내일 오전 10시"
  },
  "tool_call": {
    "name": "availability.check",
    "arguments": {}
  },
  "response_text": "예약 가능한 시간을 확인하겠습니다."
}
```

중요한 것은 LLM의 출력을 그대로 실행하지 않는 것이다.
세션 서버가 JSON schema, 현재 state에서 가능한 전이인지,
필수 slot이 모두 있는지, 사용자의 최종 확인을 받았는지를 다시 검증한다.

예를 들어 사용자가 아직 예약을 확정하지 않았는데 LLM이 `reservations.create`를 요청하면,
세션 서버가 이를 거부하고 확인 단계로 되돌린다.

LLM은 다음 행동을 제안하고, 실제 실행 여부는 백엔드가 결정한다.
당연해 보이지만 실제 예약을 다루는 시스템에서는 꽤 중요한 경계라고 생각한다.

# MVP 대화 흐름

첫 MVP에서는 신규 예약만 다룬다.

```text
CALL_STARTED
→ IDENTIFY_PURPOSE
→ IDENTIFY_REGION
→ COLLECT_RIDE_INFO
→ RESOLVE_LOCATION
→ CHECK_AVAILABILITY
→ CONFIRM_RESERVATION
→ COMMIT_RESERVATION
→ SUMMARY_AND_END
```

필수로 수집해야 하는 값은 지역, 출발지, 목적지, 요청 시간이다.
모든 값이 모이기 전에는 예약 가능 여부 API를 호출하지 않는다.
예약 생성 전에는 반드시 사용자에게 최종 확인을 받는다.

예상하는 대화는 다음과 같다.

```text
AI: 안녕하세요. DRT 예약 안내입니다. 어떤 업무를 도와드릴까요?

사용자: 종로구 DRT 예약하고 싶어요.
AI: 어디에서 어디로, 언제 이동하시나요?

사용자: 집에서 서울대병원으로 내일 오전 10시에 가고 싶어요.
AI: 내일 오전 10시 15분 차량으로 예약 가능합니다. 예약해드릴까요?

사용자: 네.
AI: 예약이 완료되었습니다. 예약 정보를 다시 안내해드리겠습니다.
```

PoC에서는 이 흐름을 rule-based orchestrator와 Mock DRT API로 먼저 통과시킨다.
추후 실제 LLM을 붙여도 state와 action을 검증하는 session harness는 그대로 유지한다.

# Barge-in

전화 대화에서 빠질 수 없는 것이 barge-in이다.
AI가 말하는 도중 사용자가 끼어들면 현재 재생을 멈추고 새 발화를 우선 처리해야 한다.

```text
AI response playing
→ user speech detected
→ output queue clear
→ current LLM / TTS generation cancel
→ USER_INTERRUPTED event
→ new transcript processing
```

단순히 소리가 들렸다고 모두 끊어버리면 기침이나 짧은 맞장구에도 응답이 중단된다.
VAD가 일정 시간 이상 음성을 감지했는지, STT partial result가 있는지 등을 함께 확인해야 한다.

아직 실제 TTS가 없는 단계에서는 상태와 취소 흐름만 먼저 만든다.
mock 응답을 출력 중일 때 transcript를 주입하면 output queue를 비우고
`USER_INTERRUPTED` 로그가 남는 정도면 현재의 검증 목적에는 충분하다.

# Mock DRT API

실제 DRT API 대신 간단한 예약 API를 만든다.

```text
POST  /locations/resolve
POST  /availability/check
POST  /reservations
GET   /reservations/{reservationId}
PATCH /reservations/{reservationId}/cancel
```

장소명은 미리 준비한 데이터에서 찾고,
운영 시간 안의 요청이라면 가장 가까운 15분 단위 시간을 배정한다.
실제 배차 알고리즘을 흉내 내려는 것이 아니라,
대화 시스템이 도메인 API를 호출하고 그 결과를 세션과 DB에 남기는지 확인하기 위한 것이다.

# 테스트 계획

먼저 Linphone으로 직접 전화를 걸어 한 통의 전체 흐름을 확인한다.
그다음 SIPp로 짧은 통화를 반복해 session lifecycle을 확인할 계획이다.

```text
1 call/sec × 1분
3 calls/sec × 1분
동시 5콜
동시 10콜
```

여기서 성공한 통화 수만 보는 것은 별 의미가 없다.
테스트가 끝난 뒤 다음 조건이 만족되는지가 더 중요하다.

```text
created_session_count == ended_session_count + failed_session_count
active_session_count == 0
cleanup_error_count == 0
```

통화가 많이 연결되는 것보다 끝난 통화가 제대로 사라지는 것이 먼저다.

# 첫 번째 실습

전체 구조를 그린 뒤 가장 먼저 한 일은 OCI에 Asterisk를 설치하는 것이었다.
Linphone을 내선으로 등록하고 Echo Test를 걸어,
SIP signaling과 RTP 음성이 양방향으로 오가는지부터 확인하였다.

처음에는 통화 연결까지 성공해서 금방 끝날 줄 알았다.
물론 음성은 돌아오지 않았다.
Asterisk가 클라이언트의 사설 IP로 RTP를 보내고 있었기 때문이다.

이 과정에서 OCI Security List, VM iptables, PJSIP NAT 설정이 각각 어디에서 문제를 만드는지 확인할 수 있었다.
AI 콜센터 백엔드로 가기 전, 일단 전화부터 제대로 받아보는 과정은 [다음 글](/blog/serverasterisk/)에 정리하였다.

