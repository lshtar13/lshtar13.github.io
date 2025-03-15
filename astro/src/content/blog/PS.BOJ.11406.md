---
title: '11406 BOJ'
description: '책 구매하기 2'
pubDate: 'Mar 15 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Network Flow"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/11406)

## 접근

최대 유량 알고리즘으로 해결하였다.

최대 유량 유형이라는 것은 빠르게 파악 가능했다.
해당 유형 문제를 많이 풀어보지 못하여서, 에드몬드-카프 알고리즘을 알지 못한 상태에서
이분매칭 문제 해결하듯 풀었으나 WA를 받았다.
에드몬드-카프 알고리즘을 학습한 후 구현하여 해결하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef queue<ll> qll;

cll N = 100, M = 100;
ll n, m, src, sink, cap[N + M + 2][N + M + 2] = {{}},
                                           flow[N + M + 2][N + M + 2] = {{}},
                                           parents[N + M + 2] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  src = 0, sink = n + m + 1;
  for (ll cust = 1; cust <= n; ++cust) {
    cin >> cap[src][cust];
  }
  for (ll store = n + 1; store <= n + m; ++store) {
    cin >> cap[store][sink];
  }

  for (ll store = n + 1; store <= n + m; ++store) {
    for (ll cust = 1; cust <= n; ++cust) {
      cin >> cap[cust][store];
    }
  }

  ll result = 0;
  while (true) {
    memset(parents, -1, sizeof(parents));

    qll q;
    q.push(src);
    parents[src] = src;

    while (!q.empty()) {
      ll dpt = q.front();
      q.pop();

      for (ll dst = 0; dst <= sink; ++dst) {
        if (parents[dst] != -1) {
          continue;
        } else if (cap[dpt][dst] - flow[dpt][dst] > 0) {
          q.push(dst);
          parents[dst] = dpt;
        }
      }
    }

    if (parents[sink] == -1) {
      break;
    }

    ll amnt = LLONG_MAX;
    for (ll p = sink; p != src; p = parents[p]) {
      amnt = min(amnt, cap[parents[p]][p] - flow[parents[p]][p]);
    }

    for (ll p = sink; p != src; p = parents[p]) {
      flow[parents[p]][p] += amnt;
      flow[p][parents[p]] -= amnt;
    }

    result += amnt;
  }

  cout << result << "\n";

  return 0;
}
```