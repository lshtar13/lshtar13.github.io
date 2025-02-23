---
title: '1162 BOJ'
description: '도로포장'
pubDate: 'Feb 28 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dijkstra"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1162)

## 접근

다익스트라 알고리즘을 이용해 해결하였다.

다익스트라 알고리즘의 노드들을 N개가 아니라 N*K로 확장해서 사고하였다.
dists[n][k]는 k개의 도로를 포장했을 때 n번째 노드까지의 최단 거리이다.
따라서 다익스트라 알고리즘의 탐색을 진행하면서 이웃노드로의 최단 거리를 갱신할 때,
일반적인 edge를 통해 뻗는 경우 외에도 도로를 포장함으로써 길이가 0이된 edge도 생각해야 한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef tuple<ll, ll, ll> info_t;

cll N = 1e4, M = 5e4, K = 20;
ll n, m, k, dists[N][K + 1] = {{}};
vpll edges[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> k;
  for (ll a, b, w, i = 0; i < m; ++i) {
    cin >> a >> b >> w;
    --a, --b;
    edges[a].push_back({b, w});
    edges[b].push_back({a, w});
  }

  memset(dists, 0x3f3f3f3f, sizeof(dists));
  priority_queue<info_t, vector<info_t>, greater<info_t>> pq;
  for (ll i = 0; i <= k; ++i) {
    dists[0][i] = 0;
  }

  pq.push({0, 0, 0});

  ll dist, pave, node, ndist, npave, av;
  while (!pq.empty()) {
    tie(dist, pave, node) = pq.top();
    pq.pop();

    if (dists[node][pave] < dist) {
      continue;
    }

    for (auto &p : edges[node]) {
      av = p.first, ndist = dist + p.second, npave = pave + 1;
      if (npave <= k && dist < dists[av][npave]) {
        pq.push({dists[av][npave] = dist, npave, av});
      }

      if (ndist < dists[av][pave]) {
        pq.push({dists[av][pave] = ndist, pave, av});
      }
    }
  }

  ll result = dists[n - 1][0];
  for (ll i = 1; i <= k; ++i) {
    result = min(result, dists[n - 1][i]);
  }

  cout << result << "\n";

  return 0;
}
```