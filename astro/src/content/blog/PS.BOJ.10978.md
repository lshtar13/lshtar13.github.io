---
title: '10978 BOJ'
description: '기숙사 재배정'
pubDate: 'Dec 17 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/10978)

## 접근

다이내믹 프로그래밍을 이용해 해결하였다.

최대 20개의 기숙사 방에 대해, 봄학기에는 i번 학생이 i번 방에 배정되었다고 가정한다.
문제에서 다른 조건을 주지 않았기 때문에 이러한 가정에는 무리가 없다.
0번 학생부터 n-1번학생까지 차례로 방을 배정하는데, 방번호가 자신의 번호와 겹치지 않게 배정한다.
같은 질문에 대한 탐색을 여러번 하지 않게 비트마스크를 이용해 방배정 상황을 나타내고,
그러한 상황에 대한 경우의 수를 dp 배열에 저장하여 재활용한다.

dp배열에 현재 탐색중인 인덱스값도 넣으려다가 시간초과, 메모리 초과를 받았다.
사실 방을 번호 순대로 탐색하기 때문에, 비트마스크로 나타낸 상황을 미루어보아 현재 배정중인 번호를
알 수 있어 인덱스값은 포함하지 않아도 되었다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef unsigned long long ull;
typedef pair<ll, ll> pll;
typedef pair<ull, ull> pull;
typedef const ll cll;
typedef queue<ll> qll;
typedef queue<pll> qpll;
typedef priority_queue<ll> pqll;
typedef priority_queue<pll> pqpll;
typedef vector<ll> vll;
typedef vector<pll> vpll;
typedef vector<vll> vvll;
typedef vector<vpll> vvpll;
#define FOR1(a, A) for (ll a = 0; a < A; ++a)
#define FOR2(a, b, A, B)                                                       \
  for (ll a = 0; a < A; ++a)                                                   \
    for (ll b = 0; b < B; ++b)

cll N = 20, STATUS = 1 << 20;
ll t, n;

ll cases(ll status, ll idx, vll &dp) {
  if (idx >= n) {
    return 2;
  } else if (dp[status]) {
    return dp[status];
  }

  dp[status] = 1;
  for (ll dorm = 0, msk; dorm < n; ++dorm) {
    msk = (1 << dorm);
    if ((status & msk) || (idx == dorm)) {
      continue;
    }

    dp[status] += cases(status | msk, idx + 1, dp) - 1;
  }

  return dp[status];
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> t;
  while (t--) {
    cin >> n;
    vll dp(1 << n);
    cout << cases(0, 0, dp) - 1 << "\n";
  }

  return 0;
}
```