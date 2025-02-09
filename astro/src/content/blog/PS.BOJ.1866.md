---
title: '1866 BOJ'
description: '택배'
pubDate: 'Feb 09 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP", "Prefix Sum"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1866)

## 접근

다이나믹 프로그래밍으로 해결하였다.

우선, 택배들을 도착지의 오름차순으로 정렬한다.
DP[i]에 i번째 택배부터 마지막 택배까지 배달할 때 필요한 최적의 비용을 기록한다.
헬리콥터를 이용할 때, 어느 택배까지 묶어 헬리콥터로 운송할 것인지 정해 DP[i]에 반영한다.
헬리콥터로 운송된 택배들을 배분하는 비용을 계산하기 위해 누적합을 이용한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 3e3, COST = 1e3, NSPOT = 1e4;
ll n, dests[N + 1] = {}, truck, heli, dp[N + 2] = {}, prefixSum[N + 1] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 1; i <= n; ++i) {
    cin >> dests[i];
  }
  cin >> truck >> heli;

  sort(dests + 1, dests + n + 1);

  for (ll i = 1; i <= n; ++i) {
    prefixSum[i] = prefixSum[i - 1] + dests[i];
  }

  for (ll i = n; i > 0; --i) {
    dp[i] = min(heli, truck * dests[i]) + dp[i + 1];
    for (ll l = i + 1, cost, mid, sum; l <= n; ++l) {
      mid = (i + l) / 2, cost = heli;
      cost += (dests[mid] * (mid - i + 1) - prefixSum[mid] + prefixSum[i - 1]) *
              truck;
      cost += (prefixSum[l] - prefixSum[mid] - dests[mid] * (l - mid)) * truck;
      dp[i] = min(dp[i], cost + dp[l + 1]);
    }
  }

  cout << dp[1] << '\n';

  return 0;
}
```