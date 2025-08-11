---
title: '1637 BOJ'
description: '날카로운 눈'
pubDate: 'Aug 11 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Binary Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1637)

## 접근

이분 탐색으로 해결하였다.
홀수 개가 존재하는 정수를 기점으로 수의 개수가 짝수인 구간과 홀수인 구간으로 나뉘는 점을 이용하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)
typedef tuple<ll, ll, ll> info_t;

cll N = 2e4;
ll n;
info_t infos[N];

ll count(ll bound) {
  ll result = 0;
  FOR(i, 0, n) {
    ll a, b, c;
    tie(a, b, c) = infos[i];

    if (bound < a) {
      break;
    }

    result += (min(bound, b) - a) / c + 1;
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  FOR(i, 0, n) {
    ll a, b, c;
    cin >> a >> b >> c;
    infos[i] = {a, b, c};
  }
  sort(infos, infos + n);

  ll st = 1, en = INT_MAX, ans, cnt;
  while (st <= en) {
    ll mid = (st + en) / 2, sum = count(mid);
    if (sum % 2) {
      ans = mid, en = mid - 1;
    } else {
      st = mid + 1;
    }
  }

  cnt = count(ans) - count(ans - 1);
  if (!cnt) {
    cout << "NOTHING\n";
  } else {
    cout << ans << " " << cnt << "\n";
  }

  return 0;
}
```