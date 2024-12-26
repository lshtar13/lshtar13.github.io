---
title: '1029 BOJ'
description: '그림 교환'
pubDate: 'Dec 25 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "DP", "Dynamic Programming"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1029)

## 접근

다이내믹 프로그래밍으로 해결하였다. Top-down방식으로 해결하였는데, 좀 더 괜찮은 bottom-top 방식도 존재하는 것 같다.

N이 15로 작기 때문에 비트마스크를 통해 지금까지 그림을 산 사람들을 int 범위내에서 기록할 수 있었다.
따라서, solve(bitmsk, last_owner, last_price) 함수를 세워 탐색을 하였다.
bitmsk에 기록된 이전 주인들을 피하고, last_price보다 크거나 같은 거래만 진행하였다.
가능한 거래 중, 종국에 가장 많은 주인들을 거치게 하는 거래를 찾아 향후 거칠 수 있는
 최대 주인 수를 dp[bitmsk][last_owner][last_price]에 기록해 재활용하였다.

좀 더 효율적인 풀이를 찾다보니, dp[bitmsk][last_owner] = last_mininum_price 의 dp배열을 활용하는 풀이를 발견하였다.
이 배열을 통해 bottom-top으로 채워나가면 좀 더 빠르고, 메모리 효율적인 풀이가 될 것 같다.

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

cll N = 15, PRICE = 10;
ll n, mat[N][N] = {{}}, dp[1 << 15][N][10];

ll solve(ll status, ll owner, ll cur) {
  if (dp[status][owner][cur] != -1) {
    return dp[status][owner][cur];
  }

  ll result = 0;
  for (ll buyer = 0; buyer < n; ++buyer) {
    if (status & (1 << buyer)) {
      continue;
    } else if (mat[owner][buyer] < cur) {
      continue;
    }

    result =
        max(result, solve(status | (1 << buyer), buyer, mat[owner][buyer]) + 1);
  }

  return dp[status][owner][cur] = result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  memset(dp, -1, sizeof(dp));

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin.ignore();
    char c;
    for (ll l = 0; l < n; ++l) {
      cin >> c;
      mat[i][l] = c - '0';
    }
  }

  cout << solve(1, 0, 0) + 1 << "\n";

  return 0;
}
```