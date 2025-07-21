---
title: '4243 BOJ'
description: '보안 업체'
pubDate: 'Jul 21 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP", "Prefix Sum"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/4243)

## 접근

누적합과 DP를 이용해 해결하였다.

시작점을 기준으로 구간 경계를 양옆으로 한칸씩 넓혀가며 해당 구간을 전부 방문할 동안 소요되는 대기 시간을 구하였다.
구간에 대한 대기 시간을 저장할 때, 마지막으로 방문한 지점이 왼쪽인지 오른쪽인지 구분하여야 한다.
순차적으로 구한다는 가정 하에, 이전에 구한 구간의 대기 시간을 이용하여 점화식을 세울 수 있다.

자율활동 시간에 PS를 하는 것은 이병때부터 자리잡은 습관이다.
바람직한 습관이지만, 때론 내 긴고아가 되어 나를 괴롭힌다.
하루에 한 문제를 해결하지 못하면 그날 하루 기분을 완전히 망쳐버린다.
객관적으로 쉬운 문제를 푸는 것이 아닌지라 비록 해결하지 못하는 문제가 있다하더라도 무던히 넘어가는 것이 이상하지 않다.
그러나, 강박이 가시가 되어 폐부를 찌른다.
기어코 내가 거뜬히 해결할 수 있는, 비슷한 티어의 문제를 찾아내 해결하고 만다.

오늘 첫번째로 접한 문제가 이 문제는 아니다.
[10982번 문제](https://www.acmicpc.net/problem/10982)가 그것이다.
이 문제는 이전에 [거의 똑같은 문제](https://www.acmicpc.net/problem/17528) 접한 바 있음에도 불구하고
쉽사리 해결책을 도출하지 못하였다. 두 오븐 간의 실행시간의 차이에 집중해야 한다는 점, 냅색 문제로 접근해야 하는 점도
알아차렸지만 이를 잘 버무려 하나의 해결책으로 만들지 못하였다.

한 번의 실패를 맛 본 후, 플 3 상당의 DP를 풀고야 말겠다는 집념과 강박이 해 문제로 나를 이끌었다.

## Haruki

요새 무라카미 하루키 작가의 글을 읽고 있다.
문득 위에 적은 내용을 하루키 씨가 적는다면 어떨지 궁금해 gemini에게 흉내내어 보도록 부탁하였다.

### Gemini

자율 활동 시간에 프로그래밍을 하는 것은 이등병 시절부터 시작된, 일종의 의식과도 같은 것이었다. 누군가는 그것을 바람직한 습관이라 말할지도 모른다. 하지만 때로 그것은 내 머리를 조이는 긴고아가 되어 의식을 옭아맨다. 하루에 한 문제. 그날의 과업을 완수하지 못하면, 무언가 중요한 것이 내 안에서 소멸해버리는 듯한 공허함이 찾아온다. 하루의 균형이 통째로 무너져 내리는 것이다.

객관적으로 보아 내가 늘 쉬운 문제들만 상대하는 것은 아니다. 그러니 가끔은 풀리지 않는 문제가 있다 해도, 어깨를 으쓱하고 내일로 넘겨버리는 편이 어쩌면 당연할 터였다. 하지만 내 안의 강박은 날카로운 가시가 되어 폐부를 찌른다. 결국 나는 어떻게든 비슷한 난이도의 다른 문제를 찾아내고야 만다. 그리고 기어코 초록색 ‘정답’ 사인을 보고 나서야 비로소 길고 불완전했던 하루의 마침표를 찍는다.

오늘 처음 마주한 문제는 이것이 아니었다. 10982번. 나는 그 문제와 거의 흡사한 것을 과거에 풀어본 기억이 있었다. 두 오븐의 시간 차에 집중해야 한다는 것, 냅색 알고리즘으로 접근해야 한다는 것까지 어렴풋이 떠올렸지만, 그 파편들을 하나의 온전한 해답으로 꿰어 맞추지는 못했다. 마치 익숙한 레코드판의 모든 트랙을 알고 있지만, 정작 바늘을 어디에 올려야 할지 알 수 없는 무력감과도 같았다.

그렇게 한 번의 실패를 맛본 뒤였다. 플래티넘 3 난이도의 DP 문제를 풀어야만 한다는 집념과 강박이, 결국 나를 이 문제 앞으로 이끌었다. 마치 고장 난 주크박스를 두들겨 기어코 원하는 노래를 듣고야 마는 사람처럼.



정말 무섭기 그지 없는 글솜씨이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)
#define IFOR(i, a, A) for (ll i = a; i >= A; --i)

cll N = 100, Dur = 15e6;
ll n, st, dur[N], dp[N][N][2];

ll solve() {
  cin >> n >> st;
  --st, dur[0] = 0;
  FOR(pos, 1, n) {
    cin >> dur[pos];
    dur[pos] += dur[pos - 1];
  }

  memset(dp, 0x3f3f3f3f, sizeof(dp));
  dp[st][st][0] = dp[st][st][1] = 0;
  IFOR(left, st, 0) FOR(right, st, n) {
    ll nleft = n - (right - left), &value0 = dp[left][right][0],
       &value1 = dp[left][right][1];
    if (left < right) {
      value0 = min(value0, dp[left + 1][right][0] +
                               (dur[left + 1] - dur[left]) * nleft);
      value0 = min(value0,
                   dp[left + 1][right][1] + (dur[right] - dur[left]) * nleft);

      value1 = min(value1,
                   dp[left][right - 1][0] + (dur[right] - dur[left]) * nleft);
      value1 = min(value1, dp[left][right - 1][1] +
                               (dur[right] - dur[right - 1]) * nleft);
    }
  }

  return min(dp[0][n - 1][0], dp[0][n - 1][1]);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    cout << solve() << "\n";
  }

  return 0;
}
```