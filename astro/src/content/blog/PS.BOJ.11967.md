---
title: '11967 BOJ'
description: '불켜기'
pubDate: 'Apr 16 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS","Breadth-First Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/11967)

## 접근

너비우선탐색으로 해결하였다.

이미 방문한 방의 옆방의 불이 켜질 경우 해당 방을 큐에 넣어주는 것 말고는
기존 너비우선탐색 문제와 크게 다르지 않다.(solved.ac 의견 중)

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<pll> qpll;
typedef vector<pll> vpll;

cll N = 100, M = 20000, directions[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
ll n, m;
bool visited[N][N] = {{}}, isLighted[N][N] = {{}};
vpll mat[N][N];

inline bool isValidCord(ll i, ll l) {
  return i >= 0 && i < n && l >= 0 && l < n;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll x, y, a, b, i = 0; i < m; ++i) {
    cin >> x >> y >> a >> b;
    --x, --y, --a, --b;
    mat[x][y].emplace_back(a, b);
  }

  ll result = 1;
  qpll q;
  q.push({0, 0});
  visited[0][0] = true, isLighted[0][0] = true;
  for (ll i, l; !q.empty();) {
    tie(i, l) = q.front();
    q.pop();

    for (auto &d : directions) {
      ll ni = i + d[0], nl = l + d[1];
      if (!isValidCord(ni, nl)) {
        continue;
      }

      if (!visited[ni][nl]) {
        visited[ni][nl] = true;
        if (isLighted[ni][nl]) {
          q.push({ni, nl});
        }
      }
    }

    for (auto &p : mat[i][l]) {
      if (isLighted[p.first][p.second]) {
        continue;
      }

      ++result;
      isLighted[p.first][p.second] = true;
      if (visited[p.first][p.second]) {
        q.push({p.first, p.second});
      }
    }
  }

  cout << result << "\n";

  return 0;
}
```