---
title: '3860 BOJ'
description: '할로윈 묘지'
pubDate: 'May 19 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bellman-Ford"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3860)

## 접근

벨만 포드로 접근하였다.

동서남북으로 이동할 수 있는 간선 정보와 귀신 구멍을 이용한 간선 정보를 edges 배열에 담아 노드의 개수만큼 반복하면서 간선들을
탐색한다. 이후 사이클이 생기는지 판단하고, 출구까지 도달 가능한지 판단한다.
실수할 부분이 많은 문제였다. 대부분의 실수는 지문의 몰이해로부터 비롯된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

typedef tuple<ll, ll, ll> info_t;

cll W = 30, H = 30, INF = 987654321,
    directions[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
ll w, h, g, e, minDist[W * H] = {}, dst;
bool graves[W][H] = {{}}, holes[W][H] = {{}};

inline bool isValidCord(ll i, ll l) {
  return i >= 0 && i < w && l >= 0 && l < h && !graves[i][l];
}

string solve() {
  vector<info_t> edges;
  memset(graves, 0, sizeof(graves));
  memset(holes, 0, sizeof(holes));

  cin >> g;
  for (ll i = 0, x, y; i < g; ++i) {
    cin >> x >> y;
    graves[x][y] = true;
  }

  cin >> e;
  for (ll i = 0, x1, y1, x2, y2, t; i < e; ++i) {
    cin >> x1 >> y1 >> x2 >> y2 >> t;
    holes[x1][y1] = true;
    edges.emplace_back(x1 * h + y1, x2 * h + y2, t);
  }

  dst = h * w - 1;
  for (ll i = 0; i < w; ++i) {
    for (ll l = 0; l < h; ++l) {
      if (holes[i][l] || graves[i][l]) {
        continue;
      } else if (i * h + l == dst) {
        continue;
      }

      for (auto &d : directions) {
        ll ni = i + d[0], nl = l + d[1];
        if (!isValidCord(ni, nl)) {
          continue;
        }

        edges.emplace_back(i * h + l, ni * h + nl, 1);
      }
    }
  }

  fill(minDist, minDist + H * W, INF);
  minDist[0] = 0;
  for (ll node = 0; node < h * w; ++node) {
    for (auto &edge : edges) {
      ll from, to, t, prv;
      tie(from, to, t) = edge;

      if (minDist[from] == INF) {
        continue;
      }

      prv = minDist[to];
      minDist[to] = min(minDist[to], minDist[from] + t);

      if (node == dst && prv > minDist[to]) {
        return "Never";
      }
    }
  }

  if (minDist[dst] == INF) {
    return "Impossible";
  } else {
    return to_string(minDist[dst]);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  for (; cin >> w >> h && w && h;) {
    cout << solve() << "\n";
  }

  return 0;
}
```