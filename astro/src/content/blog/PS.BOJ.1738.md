---
title: '1735 BOJ'
description: '골목길'
pubDate: 'Mar 11 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bellman–Ford"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1738)

## 접근

벨만 포드 알고리즘을 이용해 해결하였다.

음 혹은 양의 사이클이 발생하기에 다익스트라 대신 벨만 포드 알고리즘을 이용하였다.
마지막에 사이클이 생기는지 여부를 확인하는 단계를 추가하여 -1을 출력할 경우를 골라내었다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef vector<pll> vpll;

cll N = 100, M = 2e4, W = 1e3, INF = (M)*W;
ll n, m;
vll dist(N, -INF - 1), prv(N, -1);
vpll edges[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll u, v, w, i = 0; i < m; ++i) {
    cin >> u >> v >> w;
    --u, --v;
    edges[u].emplace_back(make_pair(v, w));
  }

  dist[0] = 0;
  for (ll i = 0; i < n; ++i) {
    for (ll node = 0, dst, w; node < n; ++node) {
      if (dist[node] < -INF) {
        continue;
      }

      for (auto &p : edges[node]) {
        tie(dst, w) = p;
        if (w + dist[node] > dist[dst]) {
          dist[dst] = w + dist[node];
          prv[dst] = node;
          if (i == n - 1) {
            dist[dst] = INF;
          }
        }
      }
    }
  }

  if (abs(dist[n - 1]) >= INF) {
    cout << -1 << "\n";
  } else {
    stack<ll> s;
    for (ll node = n - 1; node >= 0; node = prv[node]) {
      s.push(node + 1);
    }

    while (!s.empty()) {
      cout << s.top() << " ";
      s.pop();
    }
    cout << "\n";
  }

END:

  return 0;
}
```