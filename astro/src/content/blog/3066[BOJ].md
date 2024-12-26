---
title: '3066 BOJ'
description: '브리징 시그널'
pubDate: 'Dec 27 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Binary Search", 
    "Longest Increasing Subsequence"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3066)

## 접근

LIS 문제이다. 
처음에는 DP로 풀었는데, 시간초과를 달성해버려 이분탐색을 통한 LIS로 변경해 해결하였다.
특별히 추가되지 않은 LIS여서 크게 어렵진 않았다.
upper_bound와 vector의 성질을 잘 이용하면 깔끔한 풀이가 가능하다.

## 코드

```c++
#include <algorithm>
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;

cll N = 40000;
ll ports[N], dp[N];

ll solve(ll n) {
  vll lis;
  for (ll p, i = 0; i < n; ++i) {
    cin >> p;
    auto it = upper_bound(lis.begin(), lis.end(), p);
    if (it == lis.end()) {
      lis.emplace_back(p);
    } else {
      *it = p;
    }
  }

  return lis.size();
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t, n;
  cin >> t;
  while (t--) {
    cin >> n;
    cout << solve(n) << "\n";
  }

  return 0;
}
```