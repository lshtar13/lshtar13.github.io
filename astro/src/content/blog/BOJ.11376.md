---
title: '11376 BOJ'
description: '열혈 강호2'
pubDate: 'Dec 11 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bipartite Matching"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/11376)

## 접근

이분 매칭을 이용해 해결하였다.

이분 매칭은 처음이라서 다른 분들의 풀이를 많이 참고하여 해결하였다.

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

cll N = 1000, M = 1000;
ll n, m, emplys[M + 1] = {};
vll jobs[N + 1];

bool avail(ll emply, vector<bool> &check) {
  if (check[emply]) {
    return false;
  }
  check[emply] = true;

  for (auto &job : jobs[emply]) {
    if (!emplys[job] || avail(emplys[job], check)) {
      emplys[job] = emply;
      return true;
    }
  }
  return false;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll njob, e = 1; e <= n; ++e) {
    cin >> njob;
    jobs[e].resize(njob);
    for (ll i = 0; i < njob; ++i) {
      cin >> jobs[e][i];
    }
  }

  ll result = 0;
  for (ll e = 1; e <= n; ++e) {
    for (ll i = 0; i < 2; ++i) {
      vector<bool> check(n + 1, false);
      result += avail(e, check);
    }
  }

  cout << result << "\n";

  return 0;
}
```