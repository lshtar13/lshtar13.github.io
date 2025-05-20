---
title: '10258 BOJ'
description: '스위치 배열'
pubDate: 'May 20 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Adhoc", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/10258)

## 접근

애드훅 문제이다.

먼저, dp[i]를 100...0 (0이 i-1개)에 대하여 00...0으로 만들기 위한 횟수로 정의하여 채워넣는다.
100...0은 110...0을 구성한 이후 010...0으로 이루어지는 과정을 반복해 00...0으로 변하기 때문에
dp[i]는 dp[i-1] + 1 + dp[i-2] + 1 ... dp[0] + 1와 같다.
이 dp 배열을 활용하여 find0 함수를 구성하여 해결하면 된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 31;
ll n, dp[N] = {};
bool status[N] = {};

ll find0(ll idx, bool tgt) {
  if (idx == n - 1) {
    return status[idx] != tgt;
  }

  if (status[idx] == tgt) {
    return find0(idx + 1, 0);
  } else {
    return find0(idx + 1, 1) + 1 + dp[n - 1 - idx];
  }
}

ll solve() {
  string str;
  cin >> str;
  n = str.size();
  for (ll i = 0; i < n; ++i) {
    status[i] = str[i] == '1';
  }

  ll result = 0;

  return find0(0, 0);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  dp[0] = 0;
  dp[1] = 1;
  for (ll i = 2; i < N; ++i) {
    dp[i] = 0;
    for (ll l = 0; l < i; ++l) {
      dp[i] += dp[l] + 1;
    }
  }

  ll t;
  cin >> t;
  while (t--) {
    cout << solve() << "\n";
  }

  return 0;
}
```