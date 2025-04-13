---
title: '1194 BOJ'
description: '달이 차오른다, 가자'
pubDate: 'Apr 14 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Breadth-First Search", "BFS", "Bitmask"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1194)

## 접근

BFS를 이용해 해결하였다.

열쇠를 가지고 있는지 여부를 비트마스크로 표현한다고 했을때,
위치와 더불어 비트마스크까지 포함하여 3차원의 좌표간의 이동으로 BFS를 수행하면 된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef vector<pll> vpll;
typedef tuple<ll, ll, ll> info_t;

cll N = 50, M = 50, STATUS = 1 << 6, INVALID = -(1 << 7),
    directions[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
ll n, m, mat[N][M] = {{}}, minTime[N][M][STATUS] = {{{}}};
pll src;
vpll dst;

inline bool isValidCord(ll i, ll l) {
  return i >= 0 && i < n && l >= 0 && l < m && mat[i][l] != INVALID;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll i = 0; i < n; ++i) {
    cin.ignore();
    for (ll l = 0; l < m; ++l) {
      char c;
      cin >> c;
      if (c == '.') {
        mat[i][l] = 0;
      } else if (c == '#') {
        mat[i][l] = INVALID;
      } else if (c == '0') {
        src = {i, l};
      } else if (c == '1') {
        dst.emplace_back(i, l);
      } else if (c < 'a') {
        mat[i][l] = -(1 << (c - 'a'));
      } else {
        mat[i][l] = (1 << (c - 'A'));
      }
    }
  }

  memset(minTime, -1, sizeof(minTime));

  queue<info_t> q;
  q.push({src.first, src.second, 0});
  minTime[src.first][src.second][0] = 0;

  for (ll i, l, status; !q.empty();) {
    tie(i, l, status) = q.front();
    q.pop();
    for (auto &d : directions) {
      ll ni = i + d[0], nl = l + d[1], nstatus = status;
      if (!isValidCord(ni, nl)) {
        continue;
      } else if (mat[ni][nl] < 0 && !((-mat[ni][nl]) & status)) {
        continue;
      }

      if (mat[ni][nl] > 0) {
        nstatus |= mat[ni][nl];
      }

      if (minTime[ni][nl][nstatus] != -1) {
        continue;
      }

      minTime[ni][nl][nstatus] = minTime[i][l][status] + 1;
      q.push({ni, nl, nstatus});
    }
  }

  ll result = 1e9;
  for (auto &p : dst) {
    for (ll status = 0; status < STATUS; ++status) {
      if (minTime[p.first][p.second][status] != -1) {
        result = min(result, minTime[p.first][p.second][status]);
      }
    }
  }

  if (result == 1e9) {
    cout << "-1\n";
  } else {
    cout << result << "\n";
  }

  return 0;
}
```