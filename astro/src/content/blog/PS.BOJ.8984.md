---
title: '8984 BOJ'
description: '막대기'
pubDate: 'May 13 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/8984)

## 접근

다이내믹 프로그래밍으로 해결하였다.

막대기들을 정렬한 후 각각의 막대기에 대하여 해당 막대기의 위 혹은 아래에서 시작하여 이전 막대기들만 사용하였을 때의 최대 거리를
dp 배열에 저장하는 방식으로 해결하였다.
주의해야 할 점은, 이전 막대기들 중 이어질 수 있는 막대기를 찾는 과정에서 시간 초과가 날 수 있다는 점이다.
매번 이전 막대기들을 전부 뒤적이면 O(n^2)의 시간 복잡도를 가지므로 좌표값을 바탕으로 해시맵을 구성해 해당 좌표값으로부터
시작하는 막대기로 이은 선 중 가장 긴 선의 길이를 저장하는 식으로 시간복잡도를 낮추어야 한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;

cll N = 1e5, TERM = 1e6;
ll n, term, dp[N][2] = {};
pll sticks[N];
map<ll, ll> remains[2];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> term;
  for (ll i = 0, t, d; i < n; ++i) {
    cin >> t >> d;
    sticks[i] = {t, d};
  }
  sort(sticks, sticks + n);

  ll result = 0;
  for (ll i = 0, t, d, len; i < n; ++i) {
    tie(t, d) = sticks[i];
    dp[i][0] = dp[i][1] = len = abs(t - d) + term;

    dp[i][1] = max(dp[i][1], remains[0][t] + len);
    dp[i][0] = max(dp[i][0], remains[1][d] + len);

    remains[0][t] = max(remains[0][t], dp[i][0]);
    remains[1][d] = max(remains[1][d], dp[i][1]);

    result = max(result, dp[i][0]);
    result = max(result, dp[i][1]);
  }

  cout << result << "\n";

  return 0;
}
```