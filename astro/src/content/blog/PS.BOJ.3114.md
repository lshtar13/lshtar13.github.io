---
title: '3114 BOJ'
description: '사과와 바나나'
pubDate: 'Feb 04 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "DP", "Dynamic Programming", "Prefix Sum"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3114)

## 접근

다이내믹 프로그래밍과 누적합을 이용해 해결하였다.

dp[i][l]에 현재위치(i,l)에서 더 얻을 수 있는 최대의 값을 저장하는 방식으로 해결하였다.
오른쪽(대각선) 혹은 아래쪽으로만 이동할 수 있기 때문에, 오른쪽부터 그리고 아래부터 채우는 식으로 점화식을 계산하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR2(a, b, A, B)                                                       \
  for (ll a = 0; a < A; ++a)                                                   \
    for (ll b = 0; b < B; ++b)

cll R = 1500, C = 1500;
ll r, c, apples[R][C] = {{}}, bananas[R][C] = {{}}, sums[2][R][C] = {{{}}},
         dp[R][C] = {{}};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> r >> c;
  FOR2(i, l, r, c) {
    string tree;
    cin >> tree;

    ll size = stoi(tree.substr(1));
    if (tree[0] == 'B') {
      bananas[i][l] = size;
    } else {
      apples[i][l] = size;
    }
  }

  for (ll _c = 0; _c < c; ++_c) {
    sums[0][r - 1][_c] = 0;
    for (ll _r = r - 2; _r >= 0; --_r) {
      sums[0][_r][_c] = sums[0][_r + 1][_c] + apples[_r + 1][_c];
    }

    sums[1][0][_c] = 0;
    for (ll _r = 1; _r < r; ++_r) {
      sums[1][_r][_c] = sums[1][_r - 1][_c] + bananas[_r - 1][_c];
    }
  }

  for (ll l = c - 1; l >= 0; --l) {
    for (ll i = r - 1; i >= 0; --i) {
      if (i + 1 < r) {
        dp[i][l] = max(dp[i][l], dp[i + 1][l]);
      }

      if (l + 1 < c) {
        dp[i][l] =
            max(dp[i][l], dp[i][l + 1] + sums[0][i][l] + sums[1][i][l + 1]);
        if (i + 1 < r) {
          dp[i][l] = max(dp[i][l], dp[i + 1][l + 1] + sums[0][i][l] +
                                       sums[1][i + 1][l + 1]);
        }
      }
    }
  }
  cout << dp[0][0] << "\n";

  return 0;
}
```