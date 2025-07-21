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