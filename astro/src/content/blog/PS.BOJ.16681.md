---
title: '16681 BOJ'
description: '등산'
pubDate: 'Jan 24 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dijkstra"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/16681)

## 접근

다익스트라 알고리즘을 이용해 해결하였다.

올라가는 것, 내려가는 것을 따로 구현하지 않고 올라가는 경우만 구현한 뒤 학교로 내려가는 경로를 거꾸로
올라가는 경로로 변경하여 구하는 방식으로 구현하였다.
다익스트라 알고리즘을 통해 각 지점 별로 도달 가능한 최소 거리를 저장한 뒤,
이를 통해 얻을 수 있는 최대 가치를 가진 지점을 찾아 내어 출력하였다.

## 코드

```c++
#include <algorithm>
#include <bits/stdc++.h>
#include <climits>
#include <functional>
#include <vector>

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

cll N = 1e5, M = 2e5, D = 100, E = 100, INF = 0x3f3f3f3f3f3f3f3f;
ll n, m, d, e, heights[N] = {}, dists[2][N] = {{}};
vpll edges[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> d >> e;
  for (ll i = 0; i < n; ++i) {
    cin >> heights[i];
  }
  for (ll a, b, d, i = 0; i < m; ++i) {
    cin >> a >> b >> d;
    --a, --b;
    if (a == b) {
      continue;
    }
    edges[a].emplace_back(make_pair(b, d));
    edges[b].emplace_back(make_pair(a, d));
  }

  memset(dists, 0x3f3f3f3f, sizeof(dists));
  priority_queue<pll, vector<pll>, greater<pll>> pq;
  for (ll idx = 0; idx < 2; ++idx) {
    if (idx == 0) {
      dists[0][0] = 0;
      pq.push({0, 0});
    } else {
      dists[1][n - 1] = 0;
      pq.push({0, n - 1});
    }
    while (!pq.empty()) {
      ll node = pq.top().second, dist = pq.top().first;
      pq.pop();

      if (dist != dists[idx][node]) {
        continue;
      }

      for (auto &p : edges[node]) {
        ll av = p.first, d = p.second;
        if (heights[node] >= heights[av]) {
          continue;
        } else if (d + dist >= dists[idx][av]) {
          continue;
        }

        pq.push({dists[idx][av] = d + dist, av});
      }
    }
  }

  ll result = LLONG_MIN;
  for (ll node = 0; node < n; ++node) {
    if (dists[0][node] >= INF || dists[1][node] >= INF) {
      continue;
    }
    ll achieve = heights[node], hp = dists[0][node] + dists[1][node];
    result = max(result, achieve * e - hp * d);
  }

  if (result != LLONG_MIN) {
    cout << result << "\n";
  } else {
    cout << "Impossible\n";
  }

  return 0;
}
```