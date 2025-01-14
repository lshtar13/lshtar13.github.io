---
title: '2208 BOJ'
description: '보석 줍기'
pubDate: 'Jan 14 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "DP", "Dynamic Programming", "Prefix Sum"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2208)

## 접근

다이내믹 프로그래밍과 누적합을 이용해 해결하였다.

Idx의 보석까지 줍고 도망갈 경우, 가치 합의 최대값을 dp[idx]에 저장하여 해결하였다.
dp[idx]는 dp[idx-1]+values[idx] (M개보다 더 많이 줍는 경우)와 values[idx-m+1] + ... + values[idx]
(M개만 줍는 경우) 중 최대가 되는 경우를 선택하면 된다.
안 줍는 경우를 고려하지 못해 헤메었다.

## 코드

```c++
#include <bits/stdc++.h>
#include <climits>

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

cll N = 1e5, M = 1e5;
ll n, m, values[N + 1] = {}, preSum[N + 1] = {}, dp[N + 1] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll i = 1; i <= n; ++i) {
    cin >> values[i];
    preSum[i] = preSum[i - 1] + values[i];
  }

  dp[m] = preSum[m];
  ll result = 0;
  for (ll idx = m + 1; idx <= n; ++idx) {
    dp[idx] = dp[idx - 1] + values[idx];
    dp[idx] = max(dp[idx], preSum[idx] - preSum[idx - m]);
    result = max(dp[idx], result);
  }

  cout << result << "\n";

  return 0;
}
```