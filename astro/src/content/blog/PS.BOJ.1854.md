---
title: '1854 BOJ'
description: 'K번째 최단경로 찾기'
pubDate: 'Apr 20 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dijkstra", "Prirority Queue"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1854)

## 접근

다익스트라를 이용해 해결하였다.

다익스트라의 dists 배열에 단순히 최소 경로만 저장하는게 아니라, 가능한 k개 이하의 최소 경로를 모두 저장해야 한다.
발생 가능한 경로를 모두 탐색해야 하기 때문이다.
k개를 넘어가는 경로는 다른 경로의 결정에 영향을 주지 못하기 때문에 저장하지 않는다.

길이가 같은 경로를 배제하는 코드를 작성했다가 WA를 받고, 해당 부분을 수정하여 통과하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef priority_queue<ll> pqll;
typedef vector<pll> vpll;

cll N = 1000, M = 25e4, K = 100, MK = 3e6;
ll n, m, k;
vpll edges[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> k;
  for (ll a, b, c, i = 0; i < m; ++i) {
    cin >> a >> b >> c;
    --a, --b;
    edges[a].emplace_back(b, c);
  }

  pqll dists[N];
  multiset<ll> exists[N];
  priority_queue<pll, vector<pll>, greater<pll>> pq;
  dists[0].push(0);
  pq.push({0, 0});
  for (ll node, dist; !pq.empty();) {
    tie(dist, node) = pq.top();
    pq.pop();

    if (dist > dists[node].top()) {
      continue;
    }

    for (auto &p : edges[node]) {
      ll av, w, ndist;
      tie(av, w) = p;
      ndist = dist + w;

      if (dists[av].size() < k) {
        dists[av].push(ndist);
        pq.push({ndist, av});
      } else if (dists[av].top() > ndist) {
        dists[av].pop();
        dists[av].push(ndist);
        pq.push({ndist, av});
      }
    }
  }

  for (ll node = 0; node < n; ++node) {
    if (dists[node].size() == k) {
      cout << dists[node].top() << "\n";
    } else {
      cout << "-1\n";
    }
  }

  return 0;
}
```