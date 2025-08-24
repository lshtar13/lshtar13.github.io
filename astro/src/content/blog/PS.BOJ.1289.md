---
title: '1289 BOJ'
description: '트리의 가중치'
pubDate: 'Aug 24 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Tree", "Depth First Search", "DFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1249)

## 접근

트리에서의 DFS를 통해 해결하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef vector<pll> vpll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)

cll N = 1e5, Mod = 1e9 + 7;
ll n, sum = 0;
vpll edges[N];

ll dfs(ll node, ll prv) {
  ll child, w, value = 0, cvalue;
  for (auto &p : edges[node]) {
    tie(child, w) = p;
    if (child == prv) {
      continue;
    }

    cvalue = dfs(child, node);
    sum += ((w * cvalue + w) % Mod) * value + cvalue, sum %= Mod;
    value += w * cvalue + w, value %= Mod;
  }

  return value;
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

  sum += dfs(0, 0);
  cout << sum % Mod << "\n";

  return 0;
}
```