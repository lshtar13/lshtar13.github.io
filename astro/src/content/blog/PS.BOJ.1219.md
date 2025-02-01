---
title: '1219 BOJ'
description: '오민식의 고민'
pubDate: 'Feb 01 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bellman-Ford"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1219)

## 접근

벨만 포드 알고리즘을 이용해 해결하였다.

음수 가중치가 있는 최단 경로를 구해야 하기 때문에 벨만 포드 알고리즘을 이용하였다.
간선의 비용에 노드에서 상쇄시킬 수 있는 비용을 고려해서 새로운 가중치를 만들어 사용하였다.
St에서 en로 가는 cost의 비용을 가지는 간선에 대하여 cost - profit[en]으로 수정해 하였다.
벨만 포드를 이용애 최소 비요을 구한 후, 사이클 존재 여부를 조사해 해당 사이클로 인해 도착 도시에 대하여 비용이 감소한다면
Gee를 출력하게끔 하였다.

아이디어 자체는 빨리 떠올렸고, 구현도 빠르게 하였으나 자그마한 실수들이 누적되어 시간을 꽤 많이 소비하게 되었다.

## 코드

```c++
#include <bits/stdc++.h>
#include <climits>
#include <tuple>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;
typedef tuple<ll, ll, ll> info_t;

cll N = 100, M = 50, PRICE = 1e6, INF = -PRICE * N;
ll n, m, st, en, profits[N] = {}, deposit[N] = {};
bool avail[N] = {};
vector<info_t> edges;
vll mat[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  memset(deposit, 0x5f5f5f5f, sizeof(deposit));

  cin >> n >> st >> en >> m;
  for (ll src, dst, price, i = 0; i < m; ++i) {
    cin >> src >> dst >> price;
    edges.emplace_back(make_tuple(src, dst, price));
    mat[src].emplace_back(dst);
  }
  for (ll i = 0; i < n; ++i) {
    cin >> profits[i];
  }

  deposit[st] = -profits[st];
  avail[st] = true;
  for (ll src, dst, price, newDeposit, v = 0; v < n - 1; ++v) {
    for (auto &edge : edges) {
      tie(src, dst, price) = edge;
      newDeposit = deposit[src] + price - profits[dst];
      if (avail[src] && deposit[dst] > newDeposit) {
        avail[dst] = avail[src];
        deposit[dst] = newDeposit;
      }
    }
  }

  if (!avail[en]) {
    cout << "gg\n";
    goto END;
  }

  for (ll src, dst, price, newDeposit, v = 0; v < n; ++v) {
    for (auto &edge : edges) {
      tie(src, dst, price) = edge;

      newDeposit = deposit[src] + price - profits[dst];
      if (avail[src] && deposit[dst] > newDeposit) {
        deposit[dst] = INF;
        if (dst == en) {
          cout << "Gee\n";
          goto END;
        }
      }
    }
  }

  cout << -deposit[en] << "\n";

END:

  return 0;
}
```