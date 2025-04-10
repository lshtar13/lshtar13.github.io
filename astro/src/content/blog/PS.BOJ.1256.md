---
title: '1256 BOJ'
description: '사전'
pubDate: 'Apr 10 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Mathmatics", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1256)

## 접근

DP로 해결하였다.

dp[i][j]에 i개의 a와 j개의 z를 이용해 만들 수 있는 단어의 개수를 기록하였다.
dp[i][j]는 맨앞에 a가 오게 되는 경우의 수인 dp[i-1][j]와 z가 오게 되는 dp[i][j-1]의 합이다.
이를 이용하여 k가 dp[n-1][m]보다 크면 앞에 z가 오는 것을 알 수 있다.
이를 재귀적으로 탐색하면 해당하는 단어를 구할 수 있다.
dp의 값이 오버플로우가 날 수 있는데, 이렇게 큰 값은 적당한 큰 값으로 바꿔 계산하면 된다.
크게 고민할 필요없는 예외상황을 고민하느라 애먹었다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 100, M = 100, K = 1e9;
ll nstr[N + 1][M + 1] = {{}};

void solve(ll n, ll m, ll k) {
  if (n > 0 && nstr[n - 1][m] >= k) {
    cout << "a";
    solve(n - 1, m, k);
  } else if (m > 0) {
    cout << "z";
    solve(n, m - 1, k - nstr[n - 1][m]);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  for (ll a = 0; a <= N; ++a) {
    nstr[a][0] = 1;
  }
  for (ll b = 0; b <= N; ++b) {
    nstr[0][b] = 1;
  }

  for (ll a = 1; a <= N; ++a) {
    for (ll b = 1; b <= M; ++b) {
      nstr[a][b] = nstr[a - 1][b] + nstr[a][b - 1];
      if (nstr[a][b] > K) {
        nstr[a][b] = K + 1;
      }
    }
  }

  ll n, m, k;
  cin >> n >> m >> k;
  if (nstr[n][m] < k) {
    cout << "-1";
  } else {
    solve(n, m, k);
  }

  return 0;
}
```