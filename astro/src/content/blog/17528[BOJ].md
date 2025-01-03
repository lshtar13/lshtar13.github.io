---
title: '17528 BOJ'
description: 'Two Machines'
pubDate: 'Jan 03 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/17528)

## 접근

다이내믹 프로그래밍으로 해결하였다. 배낭 문제의 접근법을 차용하였다.

처음에 문제를 보고나서 어렴풋이 DP와 냅색을 떠올렸지만 어떻게 구체화할지 감이 잡히지 않았다.
여러가지 시행착오 끝에 점화식을 완성해서 해결하게 되었다.

dp[i][t]는 a에 대하여 i번째까지 고려하였을 때, a와 b가 가장 차이가 덜 나는 최선의 b의 실행 시간 합이다.
dp[i][t]는 dp[i-1][t]나 dp[i-1][t-a[i]] - b[i] 중 하나를 선택한다.

처음에 틀렸다는 결과를 받고는 다른 사람들의 풀이를 찾아 봤는데 비슷한 접근을 하고 있길래 조금 다듬어
정답을 얻게 되었다.
허나 시간이 조금 오래 걸리는 코드로써 완벽한 풀이는 아니었다.

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
cll N = 250, TIME = 250 * N + 1;
ll n, times[N + 1][2], dp[N + 1][TIME] = {{}};
// a가 time일때, 가장 차이 안나는 b의 시간

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  memset(dp, 0x3f3f3f3f, sizeof(dp));
  dp[0][0] = 0;

  cin >> n;
  for (ll i = 1; i <= n; ++i) {
    cin >> times[i][0] >> times[i][1];
    dp[0][0] += times[i][1];
  }

  for (ll a, b, i = 1; i <= n; ++i) {
    a = times[i][0], b = times[i][1];
    for (ll t = 0; t < TIME; ++t) {
      if (t >= a) {
        if (max(t, dp[i - 1][t]) > max(t, dp[i - 1][t - a] - b)) {
          dp[i][t] = dp[i - 1][t - a] - b;
        } else {
          dp[i][t] = dp[i - 1][t];
        }
      } else {
        dp[i][t] = dp[i - 1][t];
      }
    }
  }

  ll result = TIME;
  for (ll i = 0; i <= n; ++i) {
    for (ll t = 0; t < TIME; ++t) {
      result = min(result, max(t, dp[i][t]));
    }
  }

  cout << result << "\n";

  return 0;
}
```