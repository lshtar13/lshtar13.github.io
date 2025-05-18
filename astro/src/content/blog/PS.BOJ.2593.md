---
title: '2593 BOJ'
description: '엘리베이터'
pubDate: 'May 18 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Breadth-First Search", "BFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2593)

## 접근

너비우선탐색으로 해결하였다.

엘리베이터 정보를 vertex삼아 bfs를 진행하면 된다.
시작 층에서 탈 수 있는 엘리베이터들을 bfs의 시작점들로 설정한다.
도착 층에서 탈 수 있는 엘리베이터들에 대하여 역추적하여 가장 짧은 경로를 찾아낸다.
엘리베이터들 간의 관계에 대하여 이 풀이에서는 굉장히 나이브하게, 모든 가능한 값을 대입하여 정수 조건의 부정방정식을 해결하였다.
이러한 정수조건의 부정방정식은 유클리드 호제법을 활용해 빠르게 구할 수 있다고 한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<ll> qll;

cll N = 1e5, M = 100;
ll n, m, a, b, prvs[M] = {}, checked[M] = {};
bool adjs[M][M] = {{}};
pll elevs[M];
vll dsts;
qll q;

bool isAdj(ll i, ll l) {
  ll x, y, nx, ny;
  tie(x, y) = elevs[i];
  tie(nx, ny) = elevs[l];

  for (ll v = y; v <= n; v += x) {
    ll nv = v - ny;
    if (nv >= 0 && nv % nx == 0) {
      return true;
    }
  }

  return false;
}

bool reachable(ll num, ll idx) {
  ll x, y;
  tie(x, y) = elevs[idx];
  ll v = num - y;
  return v >= 0 && v % x == 0;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll i = 0, x, y; i < m; ++i) {
    cin >> x >> y;
    elevs[i] = {y, x};

    for (ll l = 0, na, nb; l < i; ++l) {
      adjs[i][l] = adjs[l][i] = isAdj(i, l);
    }
  }

  memset(prvs, -1, sizeof(prvs));
  cin >> a >> b;
  for (ll i = 0; i < m; ++i) {
    if (reachable(a, i)) {
      q.push(i);
      prvs[i] = i;
    }
  }

  if (q.empty()) {
    cout << -1 << "\n";
    return 0;
  }

  for (ll i = 0; i < m; ++i) {
    if (reachable(b, i)) {
      dsts.emplace_back(i);
    }
  }

  while (!q.empty()) {
    ll node = q.front();
    q.pop();

    for (ll av = 0; av < m; ++av) {
      if (!adjs[node][av] || prvs[av] != -1) {
        continue;
      }

      prvs[av] = node, checked[av] = checked[node] + 1;
      q.push(av);
    }
  }

  ll node = -1, cnt = M + 1;
  for (auto &dst : dsts) {
    if (cnt > checked[dst]) {
      node = dst, cnt = checked[dst];
    }
  }

  if (node == -1) {
    cout << -1 << "\n";
  } else {
    stack<ll> s;
    s.push(node);
    while (prvs[node] != node) {
      node = prvs[node];
      s.push(node);
    }

    cout << s.size() << "\n";
    while (!s.empty()) {
      cout << s.top() + 1 << "\n";
      s.pop();
    }
  }

  return 0;
}
```