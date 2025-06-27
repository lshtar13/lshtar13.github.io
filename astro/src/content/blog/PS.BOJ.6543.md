---
title: '6543 BOJ'
description: '그래프의 싱크'
pubDate: 'Jun 27 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Strongly Connected Components", "Topological Sort"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/6543)

## 접근

SCC를 찾아 하나의 노드로 구성하고 해당 노드들 간의 진출 차수를 계산하는 방식으로 해결하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;
typedef vector<vll> vvll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 5e3, M = 1e5;
ll n, m, parents[N], groups[N], degree[N], gidx, pidx;
vll edges[N];
vvll scc;

ll seek(ll node) {
  static stack<ll> s;
  if (parents[node] != -1) {
    return parents[node];
  }

  s.push(node);
  ll parent = parents[node] = pidx++;
  for (auto &av : edges[node]) {
    if (groups[av] == -1) {
      parents[node] = min(parents[node], seek(av));
    }
  }

  vll newScc;
  while (parent == parents[node] && !s.empty()) {
    ll cur = s.top();
    s.pop();

    groups[cur] = gidx;
    newScc.emplace_back(cur);
    if (cur == node) {
      ++gidx;
      scc.emplace_back(newScc);
      break;
    }
  }

  return parents[node];
}

void solve() {
  cin >> m;
  FOR(i, n) {
    edges[i].clear();
    parents[i] = -1, groups[i] = -1;
  }
  FOR(i, m) {
    ll v, w;
    cin >> v >> w;
    --v, --w;
    edges[v].emplace_back(w);
  }

  scc.clear();
  gidx = pidx = 0;
  FOR(i, n) {
    if (groups[i] == -1) {
      seek(i);
    }
  }

  memset(degree, 0, sizeof(degree));
  FOR(node, n) {
    for (auto &av : edges[node]) {
      if (groups[av] != groups[node]) {
        ++degree[groups[node]];
      }
    }
  }

  vll bottoms;
  FOR(group, gidx) {
    if (degree[group]) {
      continue;
    }

    for (auto &mem : scc[group]) {
      bottoms.emplace_back(mem);
    }
  }

  sort(bottoms.begin(), bottoms.end());
  for (auto &mem : bottoms) {
    cout << mem + 1 << " ";
  }
  cout << "\n";
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  while (cin >> n && n) {
    solve();
  }

  return 0;
}
```