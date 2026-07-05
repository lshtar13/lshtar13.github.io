---
title: 'AI 콜센터를 만들기 전에 Asterisk부터 띄워보기'
description: '114 연계형 DRT AI 콜센터 PoC를 위해 OCI에 Asterisk를 설치하고 Linphone Echo Test와 RTP NAT 문제를 해결한 기록'
pubDate: 'Jul 05 2026'
tags: ['Asterisk', 'SIP', 'RTP', 'OCI', 'Linphone', 'VoIP']
series: 'KT 디지털인재장학생 26학년도 사회공헌 프로젝트 X 한국교통안전공단'
featured: 2
---

# 배경

[앞선 글](/blog/projectkt-drt/)에서 114 연계형 DRT AI 콜센터의 전체 구조를 정리하였다.
전화 한 통을 하나의 백엔드 세션으로 만들고,
음성 인식과 대화를 거쳐 DRT 예약 API까지 연결하는 것이 목표이다.

그 구조의 시작은 당연히 전화다.
그런데 현재는 실제 전화 회선도, SIP Trunk도 없다.
그래서 Linphone을 전화기 대신 사용하고 Asterisk를 PBX로 두어
`SIP Client → PBX → RTP` 구간부터 검증하기로 하였다.

Oracle Cloud Infrastructure(OCI)의 Ubuntu VM에 Asterisk를 직접 설치하고,
Linphone을 PJSIP 내선으로 등록한 뒤 Echo Test를 거는 것이 이번 실습의 목표였다.

SIP 등록과 통화 연결만 성공했다고 음성까지 오가는 것은 아니다.
실제로 통화 연결까지는 비교적 빨리 성공했지만 내 목소리는 돌아오지 않았다.
이번 작업에서 가장 오래 붙잡고 있었던 것도 SIP가 아니라 OCI와 단말 양쪽의 NAT를 통과하는 RTP 경로였다.

글에서 사용하는 값은 다음과 같이 치환한다.

```text
PUBLIC_IP       = OCI VM의 공인 IP
LOCAL_NET       = OCI VCN 대역 (예: 10.0.0.0/16)
SIP_USER        = SIP 내선 번호 (예: 1001)
SIP_PASSWORD    = 충분히 긴 SIP 비밀번호
ECHO_EXTENSION  = Echo Test 번호 (예: 600)
```

이번에 확인하려는 연결 구조는 다음과 같다.

```text
Linphone
  ├─ SIP REGISTER / INVITE ─ UDP 5060 ─┐
  └─ RTP Audio ─ UDP 10000-20000 ──────┤
                                       ▼
                              OCI Public IP / NAT
                                       ▼
                              Ubuntu VM / Asterisk
                                       ▼
                           PJSIP → Dialplan → Echo()
```

# 일단 Asterisk부터 설치하기

OCI에서 Ubuntu VM을 생성하고 SSH로 접속한다.

```bash
ssh -i ~/.ssh/oci_asterisk ubuntu@PUBLIC_IP
```

패키지 저장소에서 Asterisk를 설치한다.

```bash
sudo apt update
sudo apt install -y asterisk
sudo systemctl enable --now asterisk
```

서비스 상태를 확인하고 Asterisk CLI에 접속한다.

```bash
sudo systemctl status asterisk
sudo asterisk -rvvv
```

# RTP 포트 범위

`/etc/asterisk/rtp.conf`에서 Asterisk가 사용할 RTP 포트 범위를 지정한다.

```ini
[general]
rtpstart=10000
rtpend=20000
```

이 범위는 Asterisk 설정만 바꾼다고 사용할 수 있는 것이 아니다.
OCI Security List와 VM 내부 방화벽에도 똑같이 허용해야 한다.

# Linphone이 접속할 PJSIP 내선 만들기

`/etc/asterisk/pjsip.conf`에 UDP transport와 내선 계정을 추가한다.

```ini
[transport-udp]
type=transport
protocol=udp
bind=0.0.0.0:5060
external_signaling_address=PUBLIC_IP
external_media_address=PUBLIC_IP
local_net=LOCAL_NET

[SIP_USER]
type=endpoint
transport=transport-udp
context=from-internal
disallow=all
allow=ulaw
allow=alaw
auth=SIP_USER-auth
aors=SIP_USER
direct_media=no
force_rport=yes
rewrite_contact=yes
rtp_symmetric=yes

[SIP_USER-auth]
type=auth
auth_type=userpass
username=SIP_USER
password=SIP_PASSWORD

[SIP_USER]
type=aor
max_contacts=1
remove_existing=yes
```

여기서 NAT 환경을 위한 설정이 특히 중요하다.

- `force_rport=yes`: 요청을 실제로 보낸 주소와 포트로 SIP 응답을 전송한다.
- `rewrite_contact=yes`: 단말의 사설 Contact 주소 대신 관측된 공인 주소를 사용한다.
- `rtp_symmetric=yes`: RTP가 들어온 주소로 미디어를 되돌려 보낸다.
- `direct_media=no`: 단말끼리 직접 RTP를 주고받지 않고 Asterisk를 경유한다.

이 설정이 빠지면 Asterisk가 SDP에 적힌 클라이언트의 사설 IP를 순진하게 믿고 그 주소로 RTP를 보낼 수 있다.
내가 정확히 이 문제를 겪었다.
통화는 멀쩡히 연결되는데 Echo 음성만 들리지 않는 전형적인 one-way audio 상태였다.

# Echo Test Dialplan

`/etc/asterisk/extensions.conf` 끝에 테스트용 context를 추가한다.

```ini
[from-internal]
exten => 600,1,Answer()
 same => n,Echo()
 same => n,Hangup()
```

설정을 반영하고 dialplan을 확인한다.

```bash
sudo systemctl restart asterisk
sudo asterisk -rvvv
```

Asterisk CLI에서 다음 명령을 실행한다.

```text
dialplan show from-internal
```

`Answer()`, `Echo()`, `Hangup()`이 차례대로 출력되면 dialplan이 정상적으로 로드된 것이다.

# 방화벽은 두 군데다

외부 SIP 클라이언트가 서버에 도달하려면 두 계층을 모두 통과해야 한다.
OCI에서 포트를 열었다고 끝난 줄 알았는데 VM 안에 iptables가 하나 더 기다리고 있었다.

| 용도 | 프로토콜 | 포트 |
| --- | --- | --- |
| SIP signaling | UDP | 5060 |
| RTP media | UDP | 10000-20000 |

OCI Security List 또는 Network Security Group에 위 ingress 규칙을 추가한다.
테스트 중이라도 가능하면 `0.0.0.0/0` 대신 SIP 클라이언트가 사용하는 공인 IP만 source로 허용한다.

OCI 규칙을 열었는데 Asterisk CLI에 REGISTER 로그가 전혀 나타나지 않는다면 VM의 iptables도 확인한다.

```bash
sudo iptables -L INPUT -n -v --line-numbers
```

SSH 허용 규칙 다음에 모든 패킷을 거부하는 `REJECT`가 있다면,
그 규칙보다 앞에 SIP와 RTP 허용 규칙을 삽입한다.

```bash
sudo iptables -I INPUT 5 -p udp --dport 5060 -j ACCEPT
sudo iptables -I INPUT 5 -p udp --dport 10000:20000 -j ACCEPT
```

규칙을 재부팅 후에도 유지하려면 다음 패키지를 사용할 수 있다.

```bash
sudo apt install -y iptables-persistent
sudo netfilter-persistent save
```

규칙 번호 `5`는 환경마다 다르다. 반드시 `--line-numbers` 출력에서 REJECT 규칙의 위치를 먼저 확인해야 한다.

# Linphone에 내선 등록하기

여기서도 한 번 헤맸다.
Linphone을 처음 실행하면 나오는 자체 서비스 로그인 화면에 Asterisk 계정을 넣으면 안 된다.
`Use a third party SIP account`를 선택해야 한다.

```text
Username:          SIP_USER
Password:          SIP_PASSWORD
Domain:            PUBLIC_IP
Display name:      SIP_USER
Transport:         UDP
Authentication ID: SIP_USER
Registrar URI:     sip:PUBLIC_IP:5060
```

정상 등록되면 Linphone에는 `Connected` 또는 `Registered`가 표시된다.
Asterisk에서는 다음 명령으로 contact를 확인할 수 있다.

```text
pjsip show contacts
```

# SIP REGISTER 디버깅

Asterisk CLI에서 SIP 전문 로그를 활성화한다.

```text
pjsip set logger on
```

정상적인 Digest 인증은 대략 다음 순서로 진행된다.

```text
REGISTER
401 Unauthorized
REGISTER with Authorization
200 OK
Endpoint SIP_USER is now Reachable
```

중간의 `401 Unauthorized`는 로그인 실패가 아니다.
서버가 nonce를 전달하고 클라이언트가 인증 정보를 포함해 요청을 다시 보내도록 만드는 정상적인 challenge 과정이다.
마지막에 `200 OK`가 반환되는지를 확인하면 된다.

Linphone 등록 직후 다음 경고가 출력될 수도 있다.

```text
No registered publish handler for event presence from SIP_USER
489 Bad Event
```

Linphone이 presence 상태를 publish했지만 Asterisk에 handler가 설정되지 않아 발생하는 메시지다.
SIP 등록이나 통화에는 영향을 주지 않으므로 Echo Test 단계에서는 무시해도 된다.

# 드디어 Echo Test

Linphone Dialer에서 `600` 또는 다음 SIP URI로 전화를 건다.

```text
sip:600@PUBLIC_IP
```

Asterisk CLI에서 아래와 같이 `Echo()`까지 실행되면 SIP signaling과 dialplan은 정상이다.

```text
INVITE sip:600@PUBLIC_IP SIP/2.0
401 Unauthorized
INVITE ... Authorization ...
100 Trying
Executing [600@from-internal:1] Answer(...)
200 OK
Executing [600@from-internal:2] Echo(...)
```

이 상태에서 말한 소리가 그대로 돌아오면 RTP 송수신까지 성공한 것이다.
내 경우에는 여기까지 로그가 나왔는데도 아무 소리도 돌아오지 않았다.

# 통화는 되는데 음성이 들리지 않았다

`Echo()`까지 진입했는데 소리가 돌아오지 않는다면 SIP보다 RTP 경로를 의심해야 한다.
Asterisk CLI에서 RTP 로그를 활성화한다.

```text
rtp set debug on
```

문제가 있었던 로그는 다음과 같은 형태였다.

```text
Got  RTP packet from CLIENT_PUBLIC_IP:CLIENT_RTP_PORT
Sent RTP packet to   CLIENT_PRIVATE_IP:CLIENT_RTP_PORT
```

클라이언트의 공인 IP에서 패킷을 받았지만, Asterisk는 SDP에 들어 있던 사설 IP로 패킷을 돌려보내고 있었다.
사설 IP는 인터넷에서 라우팅할 수 없으므로 Echo 음성이 클라이언트에 도달하지 않는다.

PJSIP endpoint에 NAT 설정을 적용한 뒤에는 송수신 주소가 모두 실제 공인 IP로 나타나야 한다.

```text
Got  RTP packet from CLIENT_PUBLIC_IP:CLIENT_RTP_PORT
Sent RTP packet to   CLIENT_PUBLIC_IP:CLIENT_RTP_PORT
```

디버깅이 끝나면 로그를 꺼둔다.

```text
rtp set debug off
pjsip set logger off
```

# 삽질을 줄이기 위한 증상별 체크리스트

## Linphone이 계속 Connecting 상태인 경우

1. `Use a third party SIP account`로 등록했는지 확인한다.
2. OCI에서 UDP 5060을 허용했는지 확인한다.
3. VM의 iptables가 5060을 REJECT하지 않는지 확인한다.
4. Asterisk의 `pjsip set logger on`에 REGISTER가 들어오는지 확인한다.

## tcpdump에는 REGISTER가 보이는데 Asterisk 로그에는 없는 경우

패킷은 VM까지 도달했지만 로컬 방화벽에서 버려지는 경우다.
iptables의 INPUT chain과 REJECT 규칙 순서를 확인한다.

## 등록과 통화는 되는데 Echo가 들리지 않는 경우

1. OCI에서 UDP 10000-20000을 허용했는지 확인한다.
2. VM iptables에서도 같은 범위를 허용했는지 확인한다.
3. `rtp set debug on`으로 Asterisk가 RTP를 보내는 목적지를 확인한다.
4. `external_media_address`, `local_net`, `rtp_symmetric` 등의 NAT 설정을 확인한다.

# 어디까지 성공한 것인가

다음 조건을 모두 만족하면 SIP/RTP 기본 연결 검증이 끝난다.

- `pjsip show transports`에 UDP 5060 transport가 존재한다.
- `pjsip show contacts`에 Linphone contact가 존재한다.
- Linphone이 Registered 상태다.
- 600번 통화가 `Echo()`에 진입한다.
- 말한 소리가 다시 들린다.
- RTP 송신 대상이 클라이언트의 공인 IP로 표시된다.

# 운영에 쓰기 전

이 구성은 학습과 PoC를 위한 최소 설정이다.
UDP 5060을 인터넷 전체에 공개하면 SIP 스캐너와 brute-force 요청이 금방 들어온다.

- 긴 무작위 SIP 비밀번호를 사용한다.
- Security List의 source를 필요한 IP로 제한한다.
- fail2ban과 요청 rate limit을 적용한다.
- 운영 환경에서는 SIP TLS와 SRTP를 검토한다.
- 디버그 로깅은 테스트 직후 비활성화한다.

Echo Test는 실제 전화 회선을 붙이기 전 `SIP Client ↔ Asterisk ↔ RTP` 경로를 검증한 단계다.
아직 AI 콜센터라고 부르기에는 전화 한 통 메아리치게 만든 것이 전부다.
하지만 적어도 이후 문제가 생겼을 때 SIP/RTP 구간과 AI 백엔드 구간을 분리해 볼 수 있게 되었다.

다음 단계에서는 AudioSocket으로 음성을 Voice Session Server에 전달하고,
통화마다 `CallSession`을 생성해 mock transcript와 DRT 예약 흐름까지 이어볼 예정이다.
