---
title: '11405 BOJ'
description: '책 구매하기'
pubDate: 'Jun 09 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Minimum Cost Maximum Flow", "MCMF"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/11405)

## 접근

MCMF알고리즘을 이용해 해결하였다.

MCMF 문제를 처음 풀어보았는데, 일반적인 벨만포드로 구현하니 시간초과를 수도없이 받았다.
SPFA 알고리즘을 사용한 것과 사용하지 않은 것의 차이가 큰 것 같다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<ll> qll;
typedef vector<pll> vpll;

cll Book = 100, N = 100, M = 100, Node = N + M + 2, Src = 0, Snk = 1, INF = 1e9;
ll n, m, flows[Node][Node] = {{}}, caps[Node][Node] = {{}};
vpll edges[Node];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll cust = 2; cust < n + 2; ++cust) {
    cin >> caps[cust][Snk];
    edges[Snk].emplace_back(cust, 0);
    edges[cust].emplace_back(Snk, 0);
  }
  for (ll store = n + 2; store < n + m + 2; ++store) {
    cin >> caps[Src][store];
    edges[store].emplace_back(Src, 0);
    edges[Src].emplace_back(store, 0);
  }
  for (ll store = n + 2; store < n + m + 2; ++store) {
    for (ll cost, cust = 2; cust < n + 2; ++cust) {
      cin >> cost;
      caps[store][cust] = Book;

      edges[cust].emplace_back(store, -cost);
      edges[store].emplace_back(cust, cost);
    }
  }

  ll result = 0;
  while (true) {
    ll dists[Node] = {}, prvs[Node] = {};
    bool inQueue[Node] = {};
    memset(dists, 0x3f3f3f3f, sizeof(dists));
    memset(prvs, -1, sizeof(prvs));

    qll q;
    q.push(Src);
    dists[Src] = 0, prvs[Src] = 0, inQueue[Src] = true;
    while (!q.empty()) {
      ll node = q.front();
      q.pop();
      inQueue[node] = false;

      for (auto &p : edges[node]) {
        ll av = p.first, cost = p.second;

        if (caps[node][av] - flows[node][av] > 0 &&
            dists[av] > dists[node] + cost) {
          dists[av] = dists[node] + cost;
          prvs[av] = node;

          if (!inQueue[av]) {
            q.push(av);
            inQueue[av] = true;
          }
        }
      }
    }

    if (prvs[Snk] == -1) {
      break;
    }

    ll flow = INF;
    for (ll node = Snk, prv = prvs[node]; node != Src;) {
      flow = min(flow, caps[prv][node] - flows[prv][node]);
      node = prv, prv = prvs[node];
    }

    for (ll node = Snk, prv = prvs[node]; node != Src;) {
      flows[prv][node] += flow, flows[node][prv] -= flow;
      node = prv, prv = prvs[node];
    }

    result += dists[Snk] * flow;
  }

  cout << result << "\n";

  return 0;
}
```