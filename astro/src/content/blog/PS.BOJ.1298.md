---
title: '1298 BOJ'
description: '노트북의 주인을 찾아서'
pubDate: 'Apr 07 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bipartite Matching", "Depth-First Search", "DFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1298)

## 접근

이분 매칭을 이용해 해결하였다.

아주 기초적인 이분 매칭 문제이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;

cll N = 100, M = 500;
ll n, m, owner[N + 1] = {};
vll edges[N + 1];

bool find(ll student, bool visited[]) {
  for (auto &dst : edges[student]) {
    if (visited[dst]) {
      continue;
    }
    visited[dst] = true;

    if (!owner[dst] || find(owner[dst], visited)) {
      owner[dst] = student;
      return true;
    }
  }

  return false;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll a, b, i = 0; i < m; ++i) {
    cin >> a >> b;
    edges[a].emplace_back(b);
  }

  ll result = 0;
  for (ll student = 1; student <= n; ++student) {
    bool visited[N + 1] = {};
    result += find(student, visited);
  }
  cout << result << "\n";

  return 0;
}
```