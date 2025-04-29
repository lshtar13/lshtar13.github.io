---
title: '1328 BOJ'
description: '고층 빌딩'
pubDate: 'Apr 29 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1328)

## 접근

다이내믹 프로그래밍을 활용해 해결하였다.

가장 높은 빌딩에서 가장 낮은 빌딩 순으로 배열하며 조합 수를 구하였다.
어떤 빌딩을 배열할 차례에 이미 놓여져 있는 빌딩들은 모두 해당 빌딩보다 높은 빌딩들이다.
따라서, 맨 왼쪽 혹은 오른쪽에 배치하는 경우를 제외한 다른 배치는 왼쪽에서 바라보았을 때
혹은 오른쪽에서 바라보았을 때의 결과를 바꾸지 못한다.
이를 이용해 점화식을 세우고 상향식으로 정답을 구하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 100, L = N, R = N, MOD = 1e9 + 7;
ll n, l, r, dp[N + 1][L + 1][R + 1] = {{{}}};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll n, l, r;
  cin >> n >> l >> r;

  dp[0][1][1] = 1;
  for (ll num = 1; num <= n; ++num) {
    for (ll left = 1; left <= n; ++left) {
      for (ll right = 1; right <= n; ++right) {
        dp[num][left][right] += dp[num - 1][left][right] * (num - 1);
        dp[num][left][right] %= MOD;
        dp[num][left][right] += dp[num - 1][left - 1][right];
        dp[num][left][right] %= MOD;
        dp[num][left][right] += dp[num - 1][left][right - 1];
        dp[num][left][right] %= MOD;
      }
    }
  }
  cout << dp[n - 1][l][r] << "\n";
  return 0;
}
```