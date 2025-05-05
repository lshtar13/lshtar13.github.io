---
title: '2191 BOJ'
description: '들쥐의 탈출'
pubDate: 'May 05 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bipartite Matching"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2191)

## 접근

이분 매칭을 이용해 해결하였다.

거리 정보를 바탕으로 쥐와 땅굴간의 간선 정보를 나타내는 그래프를 구성하였다.
시간내에 도착할 수 있는 땅굴과 그렇지 않은 땅굴을 구분하여 간선 존재 여부를 판단하였다.
이 그래프를 바탕으로 이분 매칭 알고리즘을 구현하여 최대로 땅굴에 들어갈 수 있는 쥐의 수를 파악했다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;

cll N = 100, M = 100, S = 100, V = 100;
ll n, m, s, v, matched[M] = {};
vll edges[N];
double rats[N][2] = {{}}, tunnels[M][2] = {{}};

inline double calcDist(double x0, double y0, double x1, double y1) {
  double dx = abs(x0 - x1), dy = abs(y0 - y1);
  return sqrt(dx * dx + dy * dy);
}

bool dfs(ll rat, bool visited[]) {
  for (auto &tunnel : edges[rat]) {
    if (visited[tunnel]) {
      continue;
    }

    visited[tunnel] = true;
    if (matched[tunnel] == -1 || dfs(matched[tunnel], visited)) {
      matched[tunnel] = rat;
      return true;
    }
  }

  return false;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> s >> v;
  for (ll i = 0; i < n; ++i) {
    cin >> rats[i][0] >> rats[i][1];
  }
  for (ll i = 0; i < m; ++i) {
    cin >> tunnels[i][0] >> tunnels[i][1];
  }

  for (ll rat = 0; rat < n; ++rat) {
    for (ll tunnel = 0; tunnel < m; ++tunnel) {
      double dist = calcDist(rats[rat][0], rats[rat][1], tunnels[tunnel][0],
                             tunnels[tunnel][1]);
      if (dist <= s * v) {
        edges[rat].emplace_back(tunnel);
      }
    }
  }

  ll nmatched = 0;
  memset(matched, -1, sizeof(matched));
  for (ll rat = 0; rat < n; ++rat) {
    bool visited[M] = {};
    nmatched += dfs(rat, visited);
  }

  cout << n - nmatched << "\n";

  return 0;
}
```