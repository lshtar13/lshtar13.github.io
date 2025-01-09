---
title: '2662 BOJ'
description: '기업 투자'
pubDate: 'Jan 10 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2662)

## 접근

냅색문제이다. 백트래킹을 추가로 수행해야 하는.

DP 배열에 i번째 회사까지 고려했을 때, l만큼의 투자금을 투자하면 얻을 수 있는 최대의
이익을 저장하였다.
i번째 회사에 p만큼의 금액을 투자하여 총 t만큼의 투자액을 사용할 때는,
dp[i-1][t - p]를 참고해 dp[i][t]를 채우면 된다.
이전에 어떤 선택을 했는지 저장하는 배열을 따로 만들어 백트래킹에 사용한다.

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

cll N = 300, M = 20;
ll n, m, benefits[M][N + 1] = {{}}, dp[2][N + 1] = {{}},
                         equities[M][N + 1] = {{}}, prvs[M][N + 1] = {{}};
// i까지 고려했을 때, N만큼의 금액을 쓰는 경우 ...

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll invest, i = 0; i < n; ++i) {
    cin >> invest;
    for (ll company = 0; company < m; ++company) {
      cin >> benefits[company][invest];
    }
  }

  for (ll cur, prv, c = 0; c < m; ++c) {
    cur = c % 2, prv = (c + 1) % 2;
    for (ll total = 0; total <= n; ++total) {
      dp[cur][total] = dp[prv][total], equities[c][total] = 0,
      prvs[c][total] = total;
      for (ll invst = 0; invst <= total; ++invst) {
        if (dp[cur][total] < dp[prv][total - invst] + benefits[c][invst]) {
          dp[cur][total] = dp[prv][total - invst] + benefits[c][invst];
          equities[c][total] = invst;
          prvs[c][total] = total - invst;
        }
      }
    }
  }

  cout << dp[(m - 1) % 2][n] << "\n";

  deque<ll> v;
  for (ll total = n, c = m - 1; c >= 0; --c) {
    v.emplace_front(equities[c][total]);
    total = prvs[c][total];
  }

  for (auto &_v : v) {
    cout << _v << " ";
  }
  cout << "\n";

  return 0;
}
```