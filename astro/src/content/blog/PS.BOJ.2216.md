---
title: '2216 BOJ'
description: '문자열과 점수'
pubDate: 'Jan 22 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2216)

## 접근

다이내믹 프로그래밍을 이용해 해결하였다.

2차원 DP배열에 대하여, DP[i][j]를 첫번째 문자열의 i번째 문자와 두번째 문자열의 j번째 문자부터
고려할 때 가질 수 있는 최대 점수로 설정하고 해결하였다.
첫번째 문자열의 i번째 문자와 두번째 문자열의 j번째 문자부터 고려할 때,
첫번째 혹은 두번째 문자열을 고려하지 않고 공백을 넣어 건너 뛰거나
서로 비교하여 이어서 i+1, j+1번째 문자들을 탐색하는 세가지의 선택지가 주어진다.
이 중 최대 점수를 얻을 수 있는 선택지를 골라 진행하면 된다.

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

cll N = 3000;
ll a, b, c, len[2], dp[N + 1][N + 1] = {{}};
char str[2][N + 1];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> a >> b >> c;
  cin >> str[0] >> str[1];
  len[0] = strlen(str[0]), len[1] = strlen(str[1]);

  dp[len[0]][len[1]] = 0;
  for (ll idx = len[0] - 1; idx >= 0; --idx) {
    dp[idx][len[1]] = b * (len[0] - idx);
  }
  for (ll idx = len[1] - 1; idx >= 0; --idx) {
    dp[len[0]][idx] = b * (len[1] - idx);
  }

  for (ll i = len[0] - 1; i >= 0; --i) {
    for (ll l = len[1] - 1; l >= 0; --l) {
      dp[i][l] = max(dp[i + 1][l] + b, dp[i][l + 1] + b);
      if (str[0][i] == str[1][l]) {
        dp[i][l] = max(dp[i][l], dp[i + 1][l + 1] + a);
      } else {
        dp[i][l] = max(dp[i][l], dp[i + 1][l + 1] + c);
      }
    }
  }

  cout << dp[0][0] << "\n";

  return 0;
}
```