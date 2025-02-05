---
title: '15824 BOJ'
description: '너 봄에는 캡사이신이 맛있단다'
pubDate: 'Feb 05 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Prefix Sum"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/15824)

## 접근

누적합 방식으로 해결하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef unsigned long long ull;
typedef pair<ll, ll> pll;
typedef pair<ull, ull> pull;
typedef const ll cll;
typedef queue<ll> qll;
typedef queue<pll> qpll;
typedef priority_queue<ll> pqll;
typedef priority_queue<pll> pqpll;
typedef vector<ll> vll;
typedef vector<pll> vpll;
typedef vector<vll> vvll;
typedef vector<vpll> vvpll;
#define FOR1(a, A) for (ll a = 0; a < A; ++a)
#define FOR2(a, b, A, B)                                                       \
  for (ll a = 0; a < A; ++a)                                                   \
    for (ll b = 0; b < B; ++b)

cll N = 3e5, MOD = 1e9 + 7;
ll n, scoville[N] = {}, powers[N] = {}, prefixSum[N] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> scoville[i];
  }

  sort(scoville, scoville + n);

  powers[0] = 1, prefixSum[0] = scoville[0];
  for (ll i = 1; i < N; ++i) {
    powers[i] = (powers[i - 1] * 2) % MOD;
    prefixSum[i] = (prefixSum[i - 1] * 2 + scoville[i]) % MOD;
  }

  ll result = 0;
  for (ll idx = 1; idx < n; ++idx) {
    ll power = powers[idx] - 1;
    ll sum = (scoville[idx] * power - prefixSum[idx - 1]);
    result = (result + sum % MOD) % MOD;
  }
  cout << result << "\n";

  return 0;
}
```