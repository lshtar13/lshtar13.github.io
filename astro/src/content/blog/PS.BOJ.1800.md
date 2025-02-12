---
title: '1800 BOJ'
description: '인터넷 설치'
pubDate: 'Feb 12 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dijkstra", "Binary Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1800)

## 접근

다익스트라 알고리즘과 이분 탐색으로 해결하였다.

최소로 지불할 금액을 찾기 위해 이분 탐색을 진행하였다.
고른 금액이 개연성이 있는 금액인지 확인하기 위해 다익스트라 알고리즘을 활용하였다.
다익스트라 알고리즘의 dist 배열에는 지나친 간선의 가중치 합이 아니라,
고른 금액 이상의 간선 개수를 저장하였다.
해당 개수가 k개 이하인 경우에 가능한 금액으로 판단하였다.

다익스트라 알고리즘을 활용할 생각까지는 쉽게 하였으나,
k개 조건을 어떻게 구현해야 하는지 상당한 고민을 하였다.
문제의 알고리즘 분류에 '이분 탐색'을 보자마자 '이거구나' 싶었다.
재밌는 문제였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef priority_queue<pll> pqpll;
typedef vector<pll> vpll;

cll N = 1e3, P = 1e4, K = N, PRICE = 1e6;
ll n, p, k;
vpll edges[N];

bool avail(ll limit) {
  ll costs[N] = {}, cost, node;
  memset(costs, 0x3f3f3f3f, sizeof(costs));

  priority_queue<pll, vector<pll>, greater<pll>> pq;
  pq.push({0, 0});
  while (!pq.empty()) {
    tie(cost, node) = pq.top();
    pq.pop();

    if (costs[node] < cost) {
      continue;
    }

    ll av, price, newCost;
    for (auto &p : edges[node]) {
      tie(av, price) = p;
      newCost = cost + (price > limit);
      if (newCost < costs[av]) {
        pq.push({costs[av] = newCost, av});
      }
    }
  }

  return costs[n - 1] <= k;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> p >> k;
  for (ll a, b, price, i = 0; i < p; ++i) {
    cin >> a >> b >> price;
    --a, --b;
    edges[a].emplace_back(make_pair(b, price));
    edges[b].emplace_back(make_pair(a, price));
  }

  ll st = 0, en = PRICE, result = -1;
  while (st <= en) {
    ll mid = (st + en) / 2;

    if (avail(mid)) {
      result = mid, en = mid - 1;
    } else {
      st = mid + 1;
    }
  }

  cout << result << '\n';

  return 0;
}
```