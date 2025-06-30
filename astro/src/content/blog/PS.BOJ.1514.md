---
title: '1514 BOJ'
description: '자물쇠'
pubDate: 'Jun 30 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1514)

## 접근

다이내믹 프로그래밍으로 해결하였다.

DP배열의 구성은 어렵지 않게 떠올릴 수 있었지만,
해당 배열들을 어떻게 완성할지에 대하여 큰 어려움을 겪었다.
자물쇠를 끝까지 돌려 다시 처음 상태로 돌아올 경우를 어떻게 처리할지에 대하여 많이 헤메었다.
[이 글](https://kimcodingvv.github.io/BOJ-1514/)을 읽고 해결책을 얻게 되었다.
일단 그리디한 접근을 하기로 마음 먹었다면, 목표치를 넘어서는 회전을 할 필요가 없는 것이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 100, Inf = 1e9;
ll n, dp[N + 1][10][10][10] = {{{{}}}};
char cur[N + 3] = {}, goal[N + 3] = {};

ll check(ll idx, ll a, ll b, ll c) {
  if (idx == n) {
    return 0;
  }

  ll &value = dp[idx][a][b][c],
     togo[2] = {(goal[idx] - a + 10) % 10, (a - goal[idx] + 10) % 10};
  if (value != -1) {
    return value;
  }
  value = Inf;

  FOR(dir, 2)
  FOR(cb, togo[dir] + 1) FOR(cc, cb + 1) {
    ll click = (cc + 2) / 3 + (cb - cc + 2) / 3 + (togo[dir] - cb + 2) / 3,
       derv = !dir ? 1 : -1, nb = (b + derv * cb + 10) % 10,
       nc = (c + derv * cc + 10) % 10;

    value = min(value, click + check(idx + 1, nb, nc, cur[idx + 3]));
  }

  return value;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  cin.ignore();
  FOR(i, n) {
    cin >> cur[i];
    cur[i] -= '0';
  }
  cin.ignore();
  FOR(i, n) {
    cin >> goal[i];
    goal[i] -= '0';
  }
  memset(dp, -1, sizeof(dp));

  cout << check(0, cur[0], cur[1], cur[2]);

  return 0;
}
```