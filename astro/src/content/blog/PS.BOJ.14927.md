---
title: '14927 BOJ'
description: '전구 끄기'
pubDate: 'Jun 22 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Brute Force", "Greedy"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/14927)

## 접근

그리디하게 완전탐색하여 해결하였다.

첫줄의 상태가 주어지면 이하의 줄에서 어떤 전구를 끄고 킬지 정해진다.
이를 이용하여 가능한 모든 첫줄의 상태에 대하여 몇 번 스위치를 건드려야 하는지 계산할 수 있다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef unsigned long long ull;
typedef const ll cll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 18, Status = 1 << N;
ll n, status[N + 1] = {};

ull check(ll click) {
  ull prv = 0, cur = 0, next = 0, result = 0;
  cur = status[0], next = status[1];
  FOR(i, n) {
    if (click & (1 << (i + 1))) {
      cur ^= (1 << i), cur ^= (1 << (i + 1)), cur ^= (1 << (i + 2));
      next ^= (1 << (i + 1)), ++result;
    }
  }

  for (ll line = 1; line < n; ++line) {
    prv = cur, cur = next, next = status[line + 1];
    for (ll i = 0; i < n; ++i) {
      if (prv & (1 << (i + 1))) {
        cur ^= (1 << i), cur ^= (1 << (i + 1)), cur ^= (1 << (i + 2));
        next ^= (1 << (i + 1)), ++result;
      }
    }
  }

  cur >>= 1, cur &= (1 << n) - 1;
  if (cur) {
    return -1;
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  FOR(i, n) FOR(l, n) {
    bool clicked;
    cin >> clicked;
    status[i] |= (clicked << (l + 1));
  }

  ull result = -1;
  FOR(click, 1 << (n)) { result = min(result, check(click << 1)); }
  cout << (ll)result << "\n";

  return 0;
}
```