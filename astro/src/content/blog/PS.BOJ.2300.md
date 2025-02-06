---
title: '2300 BOJ'
description: '기지국'
pubDate: 'Feb 06 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2300)

## 접근

다이나믹 프로그래밍으로 해결하였다.

x좌표 순으로 정렬한 후, dp[i]에 i번째까지 포함했을 때의 최저 비용을 적어넣었다.
x좌표 뿐아니라 y좌표 또한 신경써야 하기 때문에, 역순으로 탐색해가며 y좌표의 최댓값을 기록하였다.

## 코드

```c++
#include <bits/stdc++.h>
#include <climits>
#include <deque>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;

cll N = 1e4;
ll n, dp[N + 1] = {};
pll cords[N + 1];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 1; i <= n; ++i) {
    cin >> cords[i].first >> cords[i].second;
    cords[i].second = abs(cords[i].second);
  }
  sort(cords + 1, cords + n + 1);

  dp[0] = 0;
  for (ll i = 1; i <= n; ++i) {
    dp[i] = LLONG_MAX;
    for (ll maxHeight = 0, l = i - 1; l >= 0; --l) {
      maxHeight = max(maxHeight, cords[l + 1].second);
      dp[i] = min(dp[i], dp[l] + max(maxHeight * 2,
                                     cords[i].first - cords[l + 1].first));
    }
  }

  cout << dp[n] << "\n";

  return 0;
}
```