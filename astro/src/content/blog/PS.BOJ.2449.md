---
title: '2449 BOJ'
description: '전구'
pubDate: 'Mar 23 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2449)

## 접근

다이내믹 프로그래밍을 이용해 해결하였다.

상당히 나이브하게 해결하였다. 머릿속에 떠오른 것을 최적화없이 그대로 구현하여 시간이 오래 걸리는 코드가 되었다.
DP를 이용해 분할정복하는 문제들과 유사하게 해결하였다. 최종적으로 통일되는 색이 무엇인지 고려하지 않아도
되었는데 해당 요소를 고려하다 보니 시간이 오래걸리게 되었다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 200, K = 20;
ll n, k, cnt = -1, dp[K][N][N] = {{{}}};

ll search(ll color, ll st, ll en) {
  if (dp[color][st][en] != -1) {
    return dp[color][st][en];
  }
  ll result = N * K;

  for (ll mid = st; mid < en; ++mid) {
    result = min(result, search(color, st, mid) + search(color, mid + 1, en));
    for (ll c = 0; c < k; ++c) {
      result = min(result, search(c, st, mid) + search(c, mid + 1, en) + 1);
    }
  }

  return dp[color][st][en] = result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  memset(dp, -1, sizeof(dp));
  cin >> n >> k;
  for (ll prv = 0, cur, i = 0; i < n; ++i) {
    cin >> cur;
    if (cur != prv) {
      ++cnt;
      dp[cur - 1][cnt][cnt] = 0;
      prv = cur;
    }
  }

  for (ll i = 0; i < cnt; ++i) {
    for (ll c = 0; c < k; ++c) {
      dp[c][i][i] *= -1;
    }
  }

  ll result = N * K;
  for (ll c = 0; c < k; ++c) {
    result = min(result, search(c, 0, cnt));
  }

  cout << result << "\n";

  return 0;
}
```