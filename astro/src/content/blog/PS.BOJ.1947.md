---
title: '1947 BOJ'
description: '선물 전달'
pubDate: 'Jan 31 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP", "Mathematics", "Combinatorics"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1947)

## 접근

다이내믹 프로그래밍을 이용해 해결하였다.

어렵다. 배경지식 없이는.
[교란수열](https://namu.wiki/w/%EC%99%84%EC%A0%84%20%EC%88%9C%EC%97%B4)을 구하는 문제이다.
처음에는 수능 확률과 통계 과목 문제 해결하듯이 풀려고 하였는데,
쉽게 해답이 떠오르지 않았다.
알고리즘 문제라는 것을 직시하고, 다이내믹 프로그래밍을 시도하였다.
처음부터 정해를 바로 찾아낸 것은 아니고, 예제를 분석해서 규칙을 찾아내 풀었다.
규칙을 찾아내고 찾아낸 규칙을 정당화하면서 증명했다.

점화식은 다음과 같다.
$dp[i] = (i-1)\times (dp[i-1] + dp[i-2])$이다.

처음에 곱하는 $i-1$은 처음으로 매칭하는 노드(A)가 고를 수 있는 선택지의 개수이다.
자기 자신을 고를 수 없으니 1을 빼서 $i-1$이 되는 것이다.

선택된 다른 노드(B)는 선택지가 2개이다.
1. A를 고르는 경우
2. 다른 노드 (C)를 고르는 경우

1번의 경우, A와 B를 제외한 나머지 $i-2$개의 노드들에 대하여 계산하는 것과 동일하다.
2번의 경우, C의 입장에선 A와 C를 제외한 나머지 노드들 중 선택하게 되는 것이므로 $i-1$개의 노드들 에 대하여 계산하는 것과 동일하다.
따라서 위와 같은 점화식이 완성되는 것이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR1(a, A) for (ll a = 0; a < A; ++a)
#define FOR2(a, b, A, B)                                                       \
  for (ll a = 0; a < A; ++a)                                                   \
    for (ll b = 0; b < B; ++b)

cll N = 1e6, MOD = 1e9;
ll n, dp[N + 1] = {
          0,
          0,
          1,
          2,
};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 4; i <= n; ++i) {
    dp[i] = ((i - 1) * (dp[i - 1] + dp[i - 2])) % MOD;
  }
  cout << dp[n] << "\n";

  return 0;
}
```