---
title: '15783 BOJ'
description: '세진 바이러스'
pubDate: 'May 30 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Strongly Connected Components", "SCC", "Topological Sort"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/15783)

## 접근

강한 연결 요소와 진입 차수 개념을 활용해 해결하였다.

강한 연결 요소들을 파악한 이후, 이들을 묶어 새로운 그래프를 만든다.
모든 간선들을 조사하며 각 강한 연결 요소들의 진입 차수를 파악한다.
진입 차수가 0인 강한 연결 요소들의 개수를 파악해 출력한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;

cll N = 1e5, M = 1e5;
ll n, m, groups[N] = {}, parents[N] = {}, pidx = 0, gidx = 0;
vll edges[N];
bool degrees[N] = {};

ll dfs(ll node) {
  if (parents[node] != -1) {
    return parents[node];
  }

  static stack<ll> s;
  s.push(node);
  ll parent = parents[node] = pidx++;
  for (auto &av : edges[node]) {
    if (groups[av] == -1) {
      parents[node] = min(parents[node], dfs(av));
    }
  }

  while (parent == parents[node] && !s.empty()) {
    ll mem = s.top();
    s.pop();

    groups[mem] = gidx;
    if (mem == node) {
      ++gidx;
      break;
    }
  }

  return parents[node];
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll i = 0, a, b; i < m; ++i) {
    cin >> a >> b;
    edges[a].emplace_back(b);
  }
  memset(groups, -1, sizeof(groups));
  memset(parents, -1, sizeof(parents));

  for (ll node = 0; node < n; ++node) {
    dfs(node);
  }

  ll result = gidx;
  for (ll node = 0; node < n; ++node) {
    for (auto &av : edges[node]) {
      if (groups[node] == groups[av]) {
        continue;
      }

      if (!degrees[groups[av]]) {
        --result, degrees[groups[av]] = true;
      }
    }
  }

  cout << result << "\n";

  return 0;
}
```