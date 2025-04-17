---
title: '3056 BOJ'
description: '007'
pubDate: 'Apr 17 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bitmask", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3056)

## 접근

다이내믹 프로그래밍으로 해결하였다.

미션은 순서대로 처리한다고 가정한다.
따라서, 미션이 부여된 지미 본드들의 상태를 나타낸 비트마스크 status의 1의 개수가 곧 미션의 인덱스가 된다.
dp[status]는 status에 맞는 미션까지 수행하는 경우의 최대 확률을 기록한다.
status에 포함되어 있는 지미 본드들에 대하여 해당 지미 본드를 제외하였을 경우의 확률과
해당 지미 본드의 해당 미션에 대한 성공 확률을 곱한 값 중 최댓값이다.
dp[0]은 아무런 미션에 해당하지도 않기 때문에 성공 확률은 1이다.

status를 조사하면 미션 인덱스를 알 수 있다는 것을 놓치는 바람에 MLE를 몇번 받았다.
성급하게 제출하느라 메모리를 확인하지 못하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 20, STATUS = 1 << N;
ll n;
double probs[N][N] = {{}}, dp[STATUS] = {{}};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    for (ll l = 0; l < n; ++l) {
      cin >> probs[i][l];
      probs[i][l] /= 100;
    }
  }

  dp[0] = 1;
  for (ll status = 1, mission; status < (1 << n); ++status) {
    mission = -1;
    for (ll bond = 0; bond < n; ++bond) {
      if (status & (1 << bond)) {
        ++mission;
      }
    }

    for (ll bond = 0, cur, prv; bond < n; ++bond) {
      cur = (1 << bond), prv = status ^ cur;
      if (!(status & cur)) {
        continue;
      }

      dp[status] = max(dp[status], probs[bond][mission] * dp[prv]);
    }
  }

  cout << fixed;
  cout.precision(6);
  cout << dp[(1 << n) - 1] * 100 << "\n";

  return 0;
}
```