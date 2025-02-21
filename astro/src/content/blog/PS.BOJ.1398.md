---
title: '1398 BOJ'
description: '동전 문제'
pubDate: 'Dec 21 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1398)

## 접근

다이내믹 프로그래밍으로 해결하였다.

동전의 개수가 무제한인 점과, 1XXX원 혹은 25XXX원 으로 구성되어 있다는 점에서,
주어진 금액을 두 자릿수 단위로 쪼개 계산하면 된다는 점을 알 수 있었다.
123456원이 주어지면 12, 34, 56 으로 쪼개 계산하는 것이다.
두 자릿수의 경우 1원, 10원, 25원짜리 동전으로 표현할 수 있다.
두 자릿수를 넘어가는 세 자릿수 등의 경우에는 다시 두 자릿수로 환원해 계산하는 것이 최적의 경우이다.

따라서 두 자릿수로 쪼개 각각의 경우에 소비되는 1원, 10원, 25원짜리 동전의 개수를 구해 더하면 된다.
100 미만의 가격들에 대하여 1원, 10원, 25원짜리 동전들로 구성할 때 소비되는 최소의 동전 개수를
dp 배열에 저장하여 재활용하였다.

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
const ll INF = 100, coins[3] = {25, 10, 1};
vll dp(100, INF);

// 1, 10, 25;
ll find(ll price) {
  if (dp[price] != INF) {
    return dp[price];
  } else if (price == 0) {
    return dp[price] = 0;
  }

  for (auto coin : coins) {
    if (price >= coin) {
      dp[price] = min(dp[price], find(price - coin) + 1);
    }
  }

  return dp[price];
}

ll solve(ll price) {
  ll result = 0;
  while (price) {
    result += find(price % 100);
    price /= 100;
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    ll price;
    cin >> price;
    cout << solve(price) << "\n";
  }

  return 0;
}
```