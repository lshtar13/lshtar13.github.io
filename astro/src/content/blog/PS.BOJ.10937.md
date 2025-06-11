---
title: '10937 BOJ'
description: '두부 모판 자르기'
pubDate: 'Jun 11 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/10937)

## 접근

다이내믹 프로그래밍으로 해결하였다.

dp[i][status]는 i번째 줄의 상태가 status와 같을 때,
i번째 줄부터 n번째 줄까지 처리할 때 얻을 수 있는 최대값이다.
status에는 해당 줄의 l번째 두부가 어떤 다른 포장 단위에 포함되었는지 여부를 나타내는 것이다.
해당 status를 바탕으로 브루트하게 최대값을 탐색한다.
이 값들을 dp 배열에 저장하여 재활용함으로 시간을 줄인다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll Class = 4, N = 11,
    prices[Class][Class] = {
        {100, 70, 40, 0}, {70, 50, 30, 0}, {40, 30, 20, 0}, {0, 0, 0, 0}};
ll n, mat[N][N] = {{}}, dp[N + 1][1 << N] = {{}};
bool checked[N][N] = {{}};

inline bool isValidCord(ll i, ll l) {
  return i >= 0 && i < n && l >= 0 && l < n;
}

ll check(ll, ll);

ll dfs(ll i, ll l, ll status, ll nstatus) {
  if (l >= n) {
    return check(i + 1, nstatus);
  } else if (status & (1 << l)) {
    return dfs(i, l + 1, status, nstatus);
  }

  ll result = 0;
  // skip
  result = max(result, dfs(i, l + 1, status, nstatus));

  // right
  if (l < n - 1 && !(status & (1 << (l + 1)))) {
    result = max(result, dfs(i, l + 2, status | (1 << (l + 1)), nstatus) +
                             prices[mat[i][l]][mat[i][l + 1]]);
  }
  // under
  if (i < n - 1 && !(nstatus & (1 << l))) {
    result = max(result, dfs(i, l + 1, status, nstatus | (1 << l)) +
                             prices[mat[i][l]][mat[i + 1][l]]);
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

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin.ignore();
    for (ll l = 0; l < n; ++l) {
      char c;
      cin >> c;
      if (c < 'F') {
        mat[i][l] = c - 'A';
      } else {
        mat[i][l] = 3;
      }
    }
  }

  memset(dp, -1, sizeof(dp));
  cout << check(0, 0) << "\n";

  return 0;
}
```