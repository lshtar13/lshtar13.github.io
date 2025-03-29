---
title: '8895 BOJ'
description: '막대 배치'
pubDate: 'Mar 29 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/8895)

## 접근

다이내믹 프로그래밍으로 해결하였다.

긴 막대기부터 배치한다는 발상이 중요하다.
긴 막대기부터 배치하면, 어떤 막대기를 배치할 때 이미 배치되어 있는 막대기들은 전부 해당 막대기보다 길기 때문에
맨 왼쪽 혹은 맨 오른쪽에 배치하는 경우를 제외하면 결과에 영향을 주지 못한다.
이를 통해 점화식을 세워 계산하면 된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll L = 20, R = 20, N = 20;
ll n, l, r, dp[L][R][N + 1] = {{{}}};

ll fillDP(ll left, ll right, ll num) {
  if (left < 0 || right < 0) {
    return 0;
  } else if (dp[left][right][num] != -1) {
    return dp[left][right][num];
  }
  ll &result = dp[left][right][num];
  result = 0;

  if (!num && (right || left)) {
    return result = 0;
  }

  result += fillDP(left - 1, right, num - 1);
  result += fillDP(left, right - 1, num - 1);
  result += fillDP(left, right, num - 1) * (n - num - 1);

  return result;
}

ll solve() {
  cin >> n >> l >> r;
  return fillDP(l - 1, r - 1, n - 1);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    memset(dp, -1, sizeof(dp));
    dp[0][0][0] = 1;
    cout << solve() << "\n";
  }

  return 0;
}
```