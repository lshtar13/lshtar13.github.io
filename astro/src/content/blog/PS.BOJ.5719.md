---
title: '5719 BOJ'
description: '거의 최단 경로'
pubDate: 'Jul 02 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Djikstra", "Traceback"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/5719)

## 접근

다익스트라와 역추적을 이용해 해결하였다.
다익스트라 알고리즘을 통해 탐색하며 최단 거리를 이루는 이전 노드들을 기록하는 것과 해당 정보를 바탕으로 제외할 간선들을 찾는 것이
중요한 부분이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<ll> qll;
typedef priority_queue<pll> pqpll;
typedef vector<ll> vll;
typedef vector<pll> vpll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 500, M = 1e4, P = 1e3;
ll n, m, s, d, dists[N];
vll prvs[N];
bool checked[N], isBanned[N][N];
vpll edges[N];

void djikstra() {
  memset(dists, 0x3f3f3f3f, sizeof(dists));
  FOR(i, n) { prvs[i].clear(); }

  pqpll pq;
  pq.push({dists[s] = 0, s});
  while (!pq.empty()) {
    ll cost = -pq.top().first, node = pq.top().second;
    pq.pop();

    for (auto &p : edges[node]) {
      ll av = p.first, ncost = cost + p.second;
      if (isBanned[node][av]) {
        continue;
      } else if (dists[av] > ncost) {
        dists[av] = ncost;
		prvs[av] = {node};
        pq.push({-ncost, av});
      } else if (dists[av] == ncost) {
        prvs[av].emplace_back(node);
      }
    }
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  while (true) {
    cin >> n >> m;
    if (!n && !m) {
      break;
    } else {
      FOR(i, n) { edges[i].clear(); }
      memset(checked, false, sizeof(checked));
      memset(isBanned, false, sizeof(isBanned));
    }

    cin >> s >> d;
    FOR(i, m) {
      ll u, v, p;
      cin >> u >> v >> p;
      edges[u].emplace_back(v, p);
    }

    djikstra();
    if (dists[d] > P * M) {
      cout << "-1\n";
      continue;
    }

    qll q({d});
    checked[d] = true;
    while (!q.empty()) {
      ll node = q.front();
      q.pop();

      for (auto &prv : prvs[node]) {
        isBanned[prv][node] = true;
        if (!checked[prv]) {
          checked[prv] = true;
          q.push(prv);
        }
      }
    }

    djikstra();
    if (dists[d] > P * M) {
      cout << "-1\n";
    } else {
      cout << dists[d] << "\n";
    }
  }

  return 0;
}
```