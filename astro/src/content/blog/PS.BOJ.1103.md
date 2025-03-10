---
title: '1103 BOJ'
description: '게임'
pubDate: 'Mar 10 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "DFS", "Depth-First Search", "DP", "Dynamic Programming"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1103)

## 접근

DFS와 메모이제이션으로 해결하였다.

DFS로 탐색을 할 때, 이미 방문했던 곳을 또 방문하려고 한다면 무한 반복이 생성되므로 -1을 출력한다.
같은 곳을 여러 번 조사할 경우를 대비하여 dp 배열에 조사한 결과를 저장한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef unsigned long long ull;
typedef const ll cll;

cll N = 50, M = 50, INF = N * M + 1,
    directions[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
ll n, m, dp[N][M] = {{}};
bool visited[N][M] = {{}};
char mat[N][M] = {{}};

inline bool isValidCord(ll i, ll l) {
  return i >= 0 && i < n && l >= 0 && l < m;
}

ll findMax(ll i, ll l) {
  if (visited[i][l]) {
    return INF;
  } else if (dp[i][l] != -1) {
    return dp[i][l];
  }

  ll result = 0, next;
  visited[i][l] = true;
  for (auto &d : directions) {
    bool isOk = true;
    ll ni = i, nl = l;
    for (ll step = 0; step < mat[i][l]; ++step) {
      ni += d[0], nl += d[1];
      if (!isValidCord(ni, nl)) {
        isOk = false;
        break;
      }
    }

    if (!isOk || !mat[ni][nl]) {
      continue;
    }

    next = findMax(ni, nl);
    result = max(result, next + 1);
  }

  visited[i][l] = false;

  return dp[i][l] = result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll i = 0; i < n; ++i) {
    cin.ignore();
    for (ll l = 0; l < m; ++l) {
      cin >> mat[i][l];
      if (mat[i][l] == 'H') {
        mat[i][l] = 0;
      } else {
        mat[i][l] -= '0';
      }
    }
  }

  memset(dp, -1, sizeof(dp));

  ll result = findMax(0, 0);
  result = result >= INF ? -1 : result + 1;
  cout << result << '\n';

  return 0;
}
```