---
title: '1146 BOJ'
description: '지그재그 서기'
pubDate: 'Apr 26 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1146)

## 접근

다이내믹 프로그래밍으로 해결하였다.

남아있는 정확한 수들이 무엇인지 중요하지 않은 점에서 아이디어를 얻었다.
1,2,3,4와 1,3,4,6의 경우의  수가 같다는 점이다.
수의 대소 관계만 따져보면 된다.
따라서, 이러한 경우를 dp에 메모이제이션하면서 계산하면된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 100, MOD = 1e6;
ll n, dp[N + 1][N + 1][2] = {{}};
// dp[a][b] cur 보다 작은 수 a개, 큰 수 b개로 만들 수 있는 것.

ll find0(ll a, ll b, ll c) {
  if (dp[a][b][c] != -1) {
    return dp[a][b][c];
  }

  ll &result = dp[a][b][c] = 0;
  if (c) {
    for (ll na = 0; na < a; ++na) {
      result = (result + find0(na, a + b - 1 - na, !c)) % MOD;
    }
  } else {
    for (ll nb = 0; nb < b; ++nb) {
      result = (result + find0(a + b - 1 - nb, nb, !c)) % MOD;
    }
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;

  memset(dp, -1, sizeof(dp));
  dp[0][0][0] = dp[0][0][1] = 1;
  if (n == 1) {
    cout << 1 << "\n";
  } else {
    cout << (find0(0, n, 0) + find0(n, 0, 1)) % MOD << "\n";
  }

  return 0;
}

```