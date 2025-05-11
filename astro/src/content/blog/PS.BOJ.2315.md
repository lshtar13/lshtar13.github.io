---
title: '2315 BOJ'
description: '가로등 끄기'
pubDate: 'May 11 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2315)

## 접근

다이내믹 프로그래밍으로 해결하였다.

로봇이 지나간 자리는 모두 불을 끌 수 있으므로, 로봇이 지나간 자리의 범위를 기준으로 탐색한다.
범위를 한칸씩 늘려가며 불을 끌 때에 낭비되는 전력의 최솟값을 구한다.
i~l에서 한칸 늘릴 경우, 이동하면서 낭비되는 전력소비량은 전체 전력소비량에서 i~l의 전력소비량의 합을 뺀 값만큼이다.
이를 쉽게 구하기 위해서 누적합을 사용할 수 있다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ull, ull> pull;
typedef const ll cll;

cll N = 1000, D = 1000, W = 1e8, INF = 1e9 + 1;
ll n, m, d, st, positions[N + 1] = {}, sum, sums[N + 1] = {},
                              dp[N + 1][N + 1][2] = {{{}}};

ll find0(ll left, ll right, bool isRight) {
  if (left < 1 || right > n) {
    return INF;
  } else if (dp[left][right][isRight] != -1) {
    return dp[left][right][isRight];
  } else if (left == 1 && right == n) {
    return dp[left][right][isRight] = 0;
  }

  ll &result = dp[left][right][isRight] = INF, dist,
     waste = sum - (sums[right] - sums[left - 1]);
  if (!isRight) {
    // left->right;
    if (right < n) {
      dist = positions[right + 1] - positions[left];
      result = min(result, find0(left, right + 1, true) + waste * dist);
    }

    // left->left;
    if (left > 1) {
      dist = positions[left] - positions[left - 1];
      result = min(result, find0(left - 1, right, false) + waste * dist);
    }
  } else {
    // right->left;
    if (left > 1) {
      dist = positions[right] - positions[left - 1];
      result = min(result, find0(left - 1, right, false) + waste * dist);
    }

    // right->right;
    if (right < n) {
      dist = positions[right + 1] - positions[right];
      result = min(result, find0(left, right + 1, true) + waste * dist);
    }
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  sum = 0;
  for (ll i = 1, d, w; i <= n; ++i) {
    cin >> d >> w;
    positions[i] = d;
    sums[i] = sums[i - 1] + w, sum += w;
  }

  memset(dp, -1, sizeof(dp));
  cout << min(find0(m, m, 0), find0(m, m, 1)) << "\n";

  return 0;
}
```