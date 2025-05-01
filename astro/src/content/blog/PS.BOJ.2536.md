---
title: '2536 BOJ'
description: '버스 갈아타기'
pubDate: 'May 01 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Breadth-First Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2536)

## 접근

BFS를 통해 해결하였다.

버스노선들을 노드로 보고, 각 노선 간의 교차점들을 간선으로 삼아 그래프를 구성하였다.
이후, 시작점을 지나가는 노선들을 전부 bfs의 시작점으로 삼고
끝점을 지나가는 노선들을 전부 bfs의 끝점으로 삼아 bfs를 진행하였다.
노선간의 교차를 확인하는 것을 구현하는 것이 복잡하였다.
노선의 개수가 크지 않아 O(K^2)의 시간복잡도로 구할 수 있었다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef queue<ll> qll;

cll M = 1e5, N = 1e5, K = 5000, FROM = 0, TO = 1;
int m, n, k, checked[K] = {};
pair<int, int> lines[K][2], src, dst;
vector<int> edges[K];

inline bool isVertical(pair<int, int> &from, pair<int, int> &to) {
  return from.first == to.first;
}

bool isCross(ll a, ll b) {
  bool verticalA = isVertical(lines[a][FROM], lines[a][TO]),
       verticalB = isVertical(lines[b][FROM], lines[b][TO]);

  if (verticalA == verticalB) {
    if (verticalA && lines[a][TO].first == lines[b][TO].first) {
      ll sum = lines[a][TO].second - lines[a][FROM].second +
               lines[b][TO].second - lines[b][FROM].second,
         total = max(lines[a][TO].second, lines[b][TO].second) -
                 min(lines[a][FROM].second, lines[b][FROM].second);
      return total <= sum;
    } else if (!verticalA && lines[a][TO].second == lines[b][TO].second) {
      ll sum = lines[a][TO].first - lines[a][FROM].first + lines[b][TO].first -
               lines[b][FROM].first,
         total = max(lines[a][TO].first, lines[b][TO].first) -
                 min(lines[a][FROM].first, lines[b][FROM].first);
      return total <= sum;
    } else {
      return false;
    }
  } else {
    if (verticalA) {
      return lines[b][TO].second <= lines[a][TO].second &&
             lines[b][TO].second >= lines[a][FROM].second &&
             lines[a][TO].first <= lines[b][TO].first &&
             lines[a][TO].first >= lines[b][FROM].first;
    } else {
      return lines[a][TO].second <= lines[b][TO].second &&
             lines[a][TO].second >= lines[b][FROM].second &&
             lines[b][TO].first <= lines[a][TO].first &&
             lines[b][TO].first >= lines[a][FROM].first;
    }
  }
}

bool isIn(pair<int, int> &from, pair<int, int> &to, pair<int, int> pt) {
  bool vertical = isVertical(from, to);
  if (vertical && from.first == pt.first) {
    return from.second <= pt.second && to.second >= pt.second;
  } else if (!vertical && from.second == pt.second) {
    return from.first <= pt.first && to.first >= pt.first;
  } else {
    return false;
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> m >> n >> k;
  for (ll i = 0, b, x1, y1, x2, y2; i < k; ++i) {
    cin >> b >> x1 >> y1 >> x2 >> y2;
    lines[i][FROM] = {x1, y1}, lines[i][TO] = {x2, y2};
    sort(lines[i], lines[i] + 2);

    for (ll l = 0; l < i; ++l) {
      if (isCross(i, l)) {
        edges[i].emplace_back(l);
        edges[l].emplace_back(i);
      }
    }
  }
  cin >> src.first >> src.second >> dst.first >> dst.second;

  qll q;
  for (ll i = 0; i < k; ++i) {
    if (isIn(lines[i][FROM], lines[i][TO], src)) {
      checked[i] = 1;
      q.push(i);
    }
  }

  for (ll bus; !q.empty();) {
    bus = q.front();
    q.pop();

    for (auto &av : edges[bus]) {
      if (checked[av]) {
        continue;
      }

      checked[av] = checked[bus] + 1;
      q.push(av);
    }
  }

  int result = K + 1;
  for (ll i = 0; i < k; ++i) {
    if (checked[i] && isIn(lines[i][FROM], lines[i][TO], dst)) {
      result = min(result, checked[i]);
    }
  }

  cout << result << '\n';

  return 0;
}
```