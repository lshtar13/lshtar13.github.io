---
title: '9007 BOJ'
description: '카누 선수'
pubDate: 'Jan 04 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Meet in the Middle", "MITM"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/9007)

## 접근

투포인터(Meet in the Middle)로 해결하였다.

1,2번째 반과 3,4번째 반을 묶어, 서로 다른 반인 두 학생 몸무게의 합 배열 두개를 만들었다.
각각 n*n개의 값을 가지는 배열 두개를 정렬하고, 하나는 오름차순으로 또다른 하나는 내림차순으로 
탐색하였다.
두 배열의 값이 기준치보다 작으면 오름차순으로 탐색하는 배열의 포인터를 올리고,
기준치보다 크면 내림차순으로 탐색하는 배열의 포인터를 내린다.
기준치와의 크기 차가 가장 작은 합을 구한다.


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

cll N = 1000;
ll k, n, weights[4][N] = {{}}, sums[2][N * N] = {{}};

ll solve() {
  cin >> k >> n;
  FOR2(cls, stdnt, 4, n) { cin >> weights[cls][stdnt]; }

  for (ll i = 0, l; i < 2; ++i) {
    l = 0;
    FOR2(a, b, n, n) {
      sums[i][l++] = weights[i * 2][a] + weights[i * 2 + 1][b];
    }
  }

  sort(sums[0], sums[0] + n * n);
  sort(sums[1], sums[1] + n * n);

  ll idx0 = 0, idx1 = n * n - 1, sum, result = 1e9;
  while (idx0 < n * n && idx1 >= 0) {
    sum = sums[0][idx0] + sums[1][idx1];
    if (abs(k - result) > abs(k - sum)) {
      result = sum;
    } else if (abs(k - result) == abs(k - sum) && result > sum) {
      result = sum;
    }

    if (sum < k) {
      ++idx0;
    } else if (sum > k) {
      --idx1;
    } else {
      return sum;
    }
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    cout << solve() << "\n";
  }

  return 0;
}
```