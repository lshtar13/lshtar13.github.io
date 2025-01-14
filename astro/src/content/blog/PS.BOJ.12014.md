---
title: '12014 BOJ'
description: '주식'
pubDate: 'Dec 24 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Longest Increasing Subsequence", "LIS", "Binary Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/12014)

## 접근

LIS 알고리즘을 이용해 해결하였다.

전형적인 LIS 알고리즘 문제로써, 이분탐색을 이용해 해결하였다.
`upper_bound`와 `vector`를 이용해 손쉽게 해결할 수 있었다.

## 코드

```c++
#include <algorithm>
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

bool solve(ll n, ll k) {
  vll prices(n);
  for (auto &price : prices) {
    cin >> price;
  }

  vll lis = {prices[0]};
  for (ll i = 1; i < n; ++i) {
    auto pos = lower_bound(lis.begin(), lis.end(), prices[i]);
    if (pos == lis.end()) {
      lis.emplace_back(prices[i]);
    } else {
      *pos = prices[i];
    }
  }

  return lis.size() >= k;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t, n, k;
  cin >> t;
  for (ll i = 1; i <= t; ++i) {
    cin >> n >> k;
    cout << "Case #" << i << "\n";
    cout << solve(n, k) << "\n";
  }
  return 0;
}

```