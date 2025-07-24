---
title: '1006 BOJ'
description: '습격자 초라기'
pubDate: 'Jul 24 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP", "Case Work"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1006)

## 접근

평범한 DP에 수만가지의 경우의 수를 구해야 하는 작업이 혼합된 문제이다.

점화식 자체는 세우기 쉬우나 경우의 시작지점에서의 경우의 수를 구현하는 것이 상당히 까다로운 문제였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)
#define IFOR(i, a, A) for (ll i = a; i >= A; --i)

cll N = 1e4, W = 1e4, Inf = N * 2;
ll n, w, enemies[N][2] = {}, dp[N][4][4] = {{{}}};

ll check(ll idx, ll status, ll tail) {
  if (idx >= n) {
    return 0;
  }

  ll &value = dp[idx][status][tail];
  if (value != -1) {
    return value;
  }

  value = Inf;
  switch (status) {
  case 0:
    value = min(value, check(idx + 1, 0, tail) + 2);
    if (enemies[idx][0] + enemies[idx][1] <= w) {
      value = min(value, check(idx + 1, 0, tail) + 1);
    }

    if (enemies[idx][0] + enemies[idx + 1][0] <= w) {
      if (idx + 1 != n - 1 || !(tail & (1 << 0))) {
        value = min(value, check(idx + 1, 1, tail) + 2);
      }
    }

    if (enemies[idx][1] + enemies[idx + 1][1] <= w) {
      if (idx + 1 != n - 1 || !(tail & (1 << 1))) {
        value = min(value, check(idx + 1, 2, tail) + 2);
      }
    }

    if (enemies[idx][0] + enemies[idx + 1][0] <= w &&
        enemies[idx][1] + enemies[idx + 1][1] <= w) {
      if (idx + 1 != n - 1 || tail == 0) {
        value = min(value, check(idx + 2, 0, tail) + 2);
      }
    }
    break;

  case 1:
    value = min(value, check(idx + 1, 0, tail) + 1);
    if (enemies[idx][1] + enemies[idx + 1][1] <= w) {
      if (idx + 1 != n - 1 || !(tail & (1 << 1))) {
        value = min(value, check(idx + 1, 2, tail) + 1);
      }
    }
    break;

  case 2:
    value = min(value, check(idx + 1, 0, tail) + 1);
    if (enemies[idx][0] + enemies[idx + 1][0] <= w) {
      if (idx + 1 != n - 1 || !(tail & (1 << 0))) {
        value = min(value, check(idx + 1, 1, tail) + 1);
      }
    }
    break;

  case 3:
    value = check(idx + 2, 0, tail);
    break;
  }

  return value;
}

ll solve() {
  ll result = Inf;
  cin >> n >> w;
  FOR(i, 0, 2) FOR(l, 0, n) { cin >> enemies[l][i]; }
  memset(dp, -1, sizeof(dp));
  FOR(status, 0, 4) FOR(tail, 0, 4) {
    ll &value = dp[n - 1][status][tail];
    switch (status ^ tail) {
    case 0:
      if (enemies[n - 1][0] + enemies[n - 1][1] <= w) {
        value = 1;
      } else {
        value = 2;
      }
      break;
    case 1:
    case 2:
      value = 1;
      break;
    case 3:
      value = 0;
      break;
    }
  }

  result = min(result, check(0, 0, 0));
  if (n >= 2 && enemies[0][1] + enemies[n - 1][1] <= w) {
    result = min(result, check(1, 0, 2) + 2);
    if (enemies[0][0] + enemies[n - 1][0] <= w) {
      result = min(result, check(1, 0, 3) + 2);
    }
  }
  if (n >= 2 && enemies[0][0] + enemies[n - 1][0] <= w) {
    result = min(result, check(1, 0, 1) + 2);
  }

  if (n >= 2 && enemies[0][0] + enemies[1][0] <= w &&
      enemies[0][1] + enemies[n - 1][1] <= w) {
    result = min(result, check(1, 1, 2) + 2);
  }

  if (n >= 2 && enemies[0][1] + enemies[1][1] <= w &&
      enemies[0][0] + enemies[n - 1][0] <= w) {
    result = min(result, check(1, 2, 1) + 2);
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    cout << solve() << "\n";
  }

  return 0;
}
```