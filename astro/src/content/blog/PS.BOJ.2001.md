---
title: '2001 BOJ'
description: '보석 줍기'
pubDate: 'May 04 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Breadth-First Search", "BFS", "Bitmask"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2001)

## 접근

너비 우선 탐색으로 해결하였다.

보석의 보유 현황을 반영한 노드들을 만들어 해당 노드들간에 이동이 가능한지 조사하여 탐색하였다.
비트마스크를 이용해 현황을 반영하였는데, 시간 내에 통과하긴 했지만 많은 시간이 걸렸다.
다른 사람들의 풀이를 보니, 전체 경로 상에서 최대로 가지고 다닐 수 있는 보석의 수별로 탐색하여 시간을 많이 아꼈다.
해당 풀이가 훨씬 효율적이고 좋은 풀이로 보인다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<pll> qpll;
typedef vector<pll> vpll;

cll N = 100, M = 1000, K = 14, STATUS = 1 << K;
ll n, m, k, jems[N] = {};
bool checked[N][STATUS] = {};
vpll edges[N];

inline bool included(ll status, ll idx) { return (status & (1 << idx)); }
ll count(ll status) {
  ll result = 0;
  for (ll i = 0; i < K; ++i) {
    result += bool(status & (1 << i));
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  memset(jems, -1, sizeof(jems));

  cin >> n >> m >> k;
  for (ll i = 0, island; i < k; ++i) {
    cin >> island;
    jems[--island] = i;
  }
  for (ll i = 0, a, b, c; i < m; ++i) {
    cin >> a >> b >> c;
    --a, --b;
    edges[a].emplace_back(b, c);
    edges[b].emplace_back(a, c);
  }

  // bfs
  qpll q;
  checked[0][0] = true;
  q.push({0, 0});
  for (ll idx, status, jdx; !q.empty();) {
    tie(idx, status) = q.front();
    q.pop();

    jdx = jems[idx];
    if (jdx != -1 && !included(status, jdx)) {
      ll nstatus = status | (1 << jdx), njem = count(status) + 1;
      checked[idx][nstatus] = true;
      q.push({idx, nstatus});
    }

    ll nstatus = status, njem = count(status);
    for (auto &p : edges[idx]) {
      ll nidx = p.first, limit = p.second;
      if (njem > limit || checked[nidx][nstatus]) {
        continue;
      }

      checked[nidx][nstatus] = true;
      q.push({nidx, nstatus});
    }
  }

  ll result = 0;
  for (ll status = 0; status < (1 << k); ++status) {
    if (checked[0][status]) {
      result = max(result, count(status));
    }
  }

  cout << result << "\n";

  return 0;
}
```