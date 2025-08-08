---
title: '19581 BOJ'
description: '두 번째 트리의 지름'
pubDate: 'Aug 08 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Diameter of Tree", "Depth First Search", "DFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/19581)

## 접근

트리의 지름을 구성하는 양 끝 노드들에서 상대 노드를 제외하고 다시 트리의 지름을 구하는 식을 해결하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef vector<pll> vpll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)

cll N = 1e5;
ll n;
vpll edges[N];
bool visited[N];

pll dfs(ll node) {
  pll result(0, node);
  visited[node] = true;
  for (auto &p : edges[node]) {
    ll av = p.first, w = p.second;
    if (visited[av]) {
      continue;
    }

    pll nresult = dfs(av);
    nresult.first += w;
    result = max(result, nresult);
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  FOR(e, 0, n - 1) {
    ll a, b, w;
    cin >> a >> b >> w;
    --a, --b;
    edges[a].emplace_back(b, w);
    edges[b].emplace_back(a, w);
  }

  ll end0, end1, end, diameter, result = 0;
  memset(visited, 0, sizeof(visited));
  tie(diameter, end0) = dfs(0);
  memset(visited, 0, sizeof(visited));
  tie(diameter, end1) = dfs(end0);

  memset(visited, 0, sizeof(visited));
  visited[end1] = true;
  tie(diameter, end) = dfs(end0);
  result = max(result, diameter);

  memset(visited, 0, sizeof(visited));
  visited[end0] = true;
  tie(diameter, end) = dfs(end1);
  result = max(result, diameter);

  cout << result << "\n";

  return 0;
}
```