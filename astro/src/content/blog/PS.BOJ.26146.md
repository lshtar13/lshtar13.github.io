---
title: '26416 BOJ'
description: '즉흥 여행 (Easy)'
pubDate: 'May 28 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Strongly Connected Compnents", "SCC"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/26416)

## 접근

강한 연결 요소를 이용해 해결한 문제이다.

강한 연결 요소가 한 개인지 판별하는 문제이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;

cll N = 2e5, M = 5e5;
ll n, m, num = 0, idx = 0, parents[N + 1] = {}, cycles[N + 1] = {};
vll edges[N + 1];

ll findCycle(ll node) {
  static stack<ll> s;
  if (parents[node]) {
    return parents[node];
  }

  s.push(node);
  ll cidx = parents[node] = ++idx;
  for (auto &av : edges[node]) {
    if (!cycles[av]) {
      parents[node] = min(parents[node], findCycle(av));
    }
  }

  while (parents[node] == cidx && !s.empty()) {
    ll mem = s.top();
    s.pop();
    cycles[mem] = node;

    if (node == mem) {
      ++num;
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
  for (ll i = 0, v, w; i < m; ++i) {
    cin >> v >> w;
    edges[v].emplace_back(w);
  }

  for (ll node = 1; node <= n; ++node) {
    findCycle(node);
    if (num > 1) {
      cout << "No\n";
      goto END;
    }
  }
  cout << "Yes\n";
END:

  return 0;
}
```