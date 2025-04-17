---
title: '1506 BOJ'
description: '경찰서'
pubDate: 'Apr 18 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Strongly Connected Components", "SCC"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1506)

## 접근

SCC를 찾는 타잔 알고리즘을 이용해 해결하였다.

타잔 알고리즘을 이용한 첫 문제 해결이다.
사이클을 찾고, 해당 사이클 내에서 가장 설치 비용이 적은 도시의 비용을 전체 비용에 더하면 된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 100, INF = 1e6 + 1;
ll n, costs[N] = {}, totalCost = 0;
bool mat[N][N] = {{}}, visited[N] = {};

stack<ll> s;
ll idx = 0, idxs[N] = {};

ll dfs(ll node) {
  if (idxs[node]) {
    return idxs[node];
  }

  ll genesis = idxs[node] = ++idx;
  s.push(node);
  for (ll av = 0; av < n; ++av) {
    if (!mat[node][av] || visited[av]) {
      continue;
    }

    idxs[node] = min(dfs(av), idxs[node]);
  }

  if (idxs[node] == genesis) {
    ll minCost = INF;
    while (!s.empty()) {
      ll tnode = s.top();
      s.pop();

      visited[tnode] = true, minCost = min(minCost, costs[tnode]);
      if (tnode == node) {
        break;
      }
    }

    totalCost += minCost;
  }

  return idxs[node];
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;

  for (ll i = 0; i < n; ++i) {
    cin >> costs[i];
  }

  for (ll i = 0; i < n; ++i) {
    cin.ignore();
    for (ll l = 0; l < n; ++l) {
      char c;
      cin >> c;
      mat[i][l] = c - '0';
    }
  }

  for (ll node = 0; node < n; ++node) {
    if (!visited[node]) {
      dfs(node);
    }
  }
  cout << totalCost << "\n";

  return 0;
}
```