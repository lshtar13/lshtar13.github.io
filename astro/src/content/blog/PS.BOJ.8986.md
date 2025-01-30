---
title: '8986 BOJ'
description: '전봇대'
pubDate: 'Jan 30 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Tenary Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/8986)

## 접근

삼분 탐색으로 해결하였다.

극솟값이 하나만 존재하는 상황이라는 점에서 삼분 탐색을 적용하였다.
처음에는 막연하게 매개변수를 통한 이분탐색을 떠올렸는데, 이분탐색은 최솟값을 찾기엔
부적절하다고 판단되어 삼분탐색을 진행하게 되었다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef unsigned long long ull;
typedef const ll cll;

cll N = 1e5, X = 1e9;
ll n, cords[N] = {};

ull calcDist(ll term) {
  ull dist = 0;
  for (ll i = 0; i < n; ++i) {
    dist += abs(i * term - cords[i]);
  }

  return dist;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> cords[i];
  }

  ll st = 1, en = X;
  while (en - st >= 3) {
    ll sse = (st * 2 + en) / 3, see = (st + en * 2) / 3;

    if (calcDist(sse) < calcDist(see)) {
      en = see;
    } else {
      st = sse;
    }
  }

  ull ans = LLONG_MAX;
  for (ll term = st; term <= en; ++term) {
    ans = min(ans, calcDist(term));
  }

  cout << ans << "\n";

  return 0;
}
```