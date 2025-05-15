---
title: '4196 BOJ'
description: '도미노'
pubDate: 'May 15 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS","Strongly Connected Compnent", "SCC", "Topological Sort"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/4196)

## 접근

강한 연결 요소 개념과 위상 정렬의 진입 차수 개념을 활용해 해결하였다.

그래프를 탐색해 강한 연결 요소들을 찾고, 해당 사이클들의 관계를 분석하여 진입차수가 0인 사이클의 개수를 찾는다.
진입차수가 0인 사이클을 찾는 과정에서 한번 조사한 사이클들 간의 관계를 다시 조사하지 않기 위해 set을 도입하였는데,
두번 이상 조사해도 상관없다는 사실을 다른 사람들 풀이를 보고 알게되었다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;
typedef vector<vll> vvll;

cll N = 1e5, M = 1e5;
ll n, m, parents[N], groups[N] = {}, gidx, pidx;
stack<ll> prvs;

ll dfs(ll node, vvll &edges) {
  if (parents[node] != -1) {
    return parents[node];
  }

  ll parent = parents[node] = pidx++;
  prvs.push(node);
  for (auto &av : edges[node]) {
    if (groups[av] != -1) {
      continue;
    }

    parents[node] = min(parents[node], dfs(av, edges));
  }

  for (ll prv; parents[node] == parent && !prvs.empty();) {
    prv = prvs.top();
    prvs.pop();

    groups[prv] = gidx;

    if (prv == node) {
      ++gidx;
      break;
    }
  }

  return parents[node];
}

ll solve() {
  cin >> n >> m;
  vvll edges(n);
  for (ll i = 0, x, y; i < m; ++i) {
    cin >> x >> y;
    edges[--x].emplace_back(--y);
  }

  gidx = 0, pidx = 0;
  memset(parents, -1, sizeof(parents));
  memset(groups, -1, sizeof(groups));
  for (ll i = 0; i < n; ++i) {
    if (groups[i] != -1) {
      continue;
    }

    dfs(i, edges);
  }

  set<pll> checked;
  vll degrees(gidx, 0);
  for (ll node = 0; node < n; ++node) {
    for (auto &av : edges[node]) {
      ll a = groups[node], b = groups[av];

      if (a == b) {
        continue;
      }

      if (checked.find({a, b}) == checked.end()) {
        checked.insert({a, b});
        ++degrees[b];
      }
    }
  }

  ll result = 0;
  for (ll i = 0; i < gidx; ++i) {
    if (!degrees[i]) {
      ++result;
    }
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    cout << solve() << "\n";
  }

  return 0;
}
```