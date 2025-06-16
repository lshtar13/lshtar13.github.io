---
title: '1648 BOJ'
description: '격자판 채우기'
pubDate: 'Jun 16 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1648)

## 접근

다이내믹 프로그래밍으로 해결하였다.

비트필드 태그를 보고 해결책을 떠올렸다.
현재 n번째 열의 상태가 status와 같은 비트마스킹으로 나타내어질 때 가질 수 있는 경우의 수를 세는 dfs 함수를 이용하여 dp
배열을 채운다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 14, M = 14, Status = 1 << M, Mod = 9901;
ll n, m;
int dp[N][Status] = {{}};

int check(ll, ll);

int dfs(cll idx, ll i, cll status, ll nstatus) {
  if (i >= m) {
    return check(idx + 1, nstatus);
  } else if (status & (1 << i)) {
    return dfs(idx, i + 1, status, nstatus);
  }

  int result = 0;
  if (idx < n - 1) {
    result += dfs(idx, i + 1, status, nstatus | (1 << i)), result %= Mod;
  }

  if (i < m - 1 && !(status & (1 << (i + 1)))) {
    result += dfs(idx, i + 1, status | (1 << (i + 1)), nstatus), result %= Mod;
  }

  return result;
}

int check(ll idx, ll status) {
  if (idx == n) {
    return 1;
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
  memset(dp, -1, sizeof(dp));

  cout << check(0, 0) << "\n";

  return 0;
}
```