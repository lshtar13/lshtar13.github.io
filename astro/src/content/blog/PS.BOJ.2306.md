---
title: '2306 BOJ'
description: '유전자'
pubDate: 'Jan 21 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2306)

## 접근

다이내믹 프로그래밍으로 해결하였다.

괄호 문제와 비슷한 풀이방법으로 해결하면 된다.
탐색해야 할 구간이 주어졌을 때, 해당 구간을 둘로 나눠서 각각의 구간 값의 합을 구한다.
만약 구간의 양끝이 'a-t', 'g-c'쌍을 이루고 있을 경우,
각각의 원소들을 제하고 나머지 구간의 값에 2를 더한 값을 이전에 두 개 구간으로 나눠 구한 값과 비교하여
큰 값을 탐색 하는 구간의 값으로 한다.
구간의 길이가 작은 것부터 차례로 bottom-up 방식으로 구하면 최적의 시간 복잡도로 답을 구할 수 있다.

처음에는 발상을 간단히 하지 못해 많은 시행 착오를 하였다.
'a-t', 'g-c' 쌍을 지우고 구간을 탐색하는 과정을 잘못 생각하여 오류를 많이 일으켰다.
또한 top-down 방식으로 설계하여 실행시간이 길었다.
점화식을 단순화하며 bottom-up 방식으로 바꾸고 string 대신 char배열을 썼더니 시간을 많이 아낄 수 있었다.

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

cll N = 500;
ll n, dp[N][N] = {{}};
char dna[N+1] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> dna;
  n = strlen(dna);
  for (ll idx = 0; idx < n; ++idx) {
    dp[idx][idx] = 0;
  }

  for (ll len = 2; len <= n; ++len) {
    for (ll st = 0; st + len - 1 < n; ++st) {
      ll en = st + len - 1;
      for (ll mid = st; mid < en; ++mid) {
        dp[st][en] = max(dp[st][en], dp[st][mid] + dp[mid + 1][en]);
      }

      if (dna[st] == 'a' && dna[en] == 't') {
        dp[st][en] = max(dp[st][en], dp[st + 1][en - 1] + 2);
      }
      if (dna[st] == 'g' && dna[en] == 'c') {
        dp[st][en] = max(dp[st][en], dp[st + 1][en - 1] + 2);
      }
    }
  }

  cout << dp[0][n - 1] << "\n";

  return 0;
}
```