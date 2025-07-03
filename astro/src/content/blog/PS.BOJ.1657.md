---
title: '1657 BOJ'
description: '두부장수 장홍준'
pubDate: 'Jul 03 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bitmask", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1657)

## 접근

비트마스크를 활용한 다이내믹 프로그래밍으로 해결하였다.
좀 더 최적화가 필요하다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 14, M = 14, CLASS = 5;
cll values[CLASS][CLASS] = {{10, 8, 7, 5, 1},
                            {8, 6, 4, 3, 1},
                            {7, 4, 3, 2, 1},
                            {5, 3, 2, 2, 1},
                            {1, 1, 1, 1, 0}};
ll n, m, mat[N][M] = {{}}, dp[N][1 << M] = {{}};

ll check(ll, ll);

ll dfs(ll i, ll l, ll status, ll nstatus) {
  if (l >= m) {
    return check(i + 1, nstatus);
  } else if (status & (1 << l)) {
    return dfs(i, l + 1, status, nstatus);
  }

  ll result = dfs(i, l + 1, status, nstatus);
  if (l < m - 1 && !(status & (1 << (l + 1)))) {
    result = max(result, values[mat[i][l]][mat[i][l + 1]] +
                             dfs(i, l + 2, status, nstatus));
  }

  if (i < n - 1) {
    result = max(result, values[mat[i][l]][mat[i + 1][l]] +
                             dfs(i, l + 1, status, nstatus | (1 << l)));
  }

  return result;
}

ll check(ll idx, ll status) {
  if (idx == n) {
    return 0;
  } else if (dp[idx][status] != -1) {
    return dp[idx][status];
  }

  return dp[idx][status] = dfs(idx, 0, status, 0);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  FOR(i, n) {
    cin.ignore();
    FOR(l, m) {
      char c;
      cin >> c;
      mat[i][l] = min(4, c - 'A');
    }
  }

  memset(dp, -1, sizeof(dp));
  cout << check(0, 0) << "\n";

  return 0;
}
```