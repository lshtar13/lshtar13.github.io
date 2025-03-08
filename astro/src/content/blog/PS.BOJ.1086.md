---
title: '1086 BOJ'
description: '박성원'
pubDate: 'Mar 08 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP", "Bitfield", "Modular"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1086)

## 접근

비트필드를 이용한 다이내믹 프로그래밍과 모듈러 연산을 통해 해결하였다.

비트필드를 이용하여 순열을 만들기 위해 선택된 수들을 나타내고
해당 비트필드 상태로 만들 수 있는 경우의 수, 그러니까 나머지가 0, 1, ... k-1인 수가 몇개인지 기록하는 방식으로 해결하였다.
어떤 상태에 대하여 경우의 수를 파악할 때는, 선택된 수 중 하나를 뺀 상태의 경우에 제외된 수가 맨 앞에 위치시킬 때 어떻게 되는지
조사함으로 경우의 수를 파악하였다.
모듈러 연산을 통해 정수(long long) 범위 내에서 연산할 수 있도록 하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 15, LEN = 50 * 15 + 1, K = 100, STATUS = (1 << 15);
ll n, k, nums[N] = {}, cases[STATUS][K] = {{}}, length[STATUS] = {}, power[LEN],
         fact[N + 1] = {};
string numstr[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> numstr[i];
  }
  cin >> k;

  power[0] = 1;
  for (ll p = 1; p < LEN; ++p) {
    power[p] = (power[p - 1] * 10) % k;
  }

  fact[0] = 1;
  for (ll i = 1; i <= N; ++i) {
    fact[i] = fact[i - 1] * i;
  }

  for (ll i = 0; i < n; ++i) {
    for (auto c : numstr[i]) {
      nums[i] = (nums[i] * 10 + c - '0') % k;
    }
  }

  for (ll status = 0; status < (1 << n); ++status) {
    for (ll i = 0; i < n; ++i) {
      if (status & (1 << i)) {
        length[status] += numstr[i].size();
      }
    }
  }

  cases[0][0] = 1;
  for (ll status = 1; status < (1 << n); ++status) {
    for (ll nstatus, i = 0; i < n; ++i) {
      if (!(status & (1 << i))) {
        continue;
      }

      nstatus = status & (~(1 << i));
      for (ll r = 0, nr; r < k; ++r) {
        nr = (r + ll(power[length[nstatus]]) * nums[i]) % k;
        cases[status][nr] += cases[nstatus][r];
      }
    }
  }

  ll result = cases[(1 << n) - 1][0], div = gcd(fact[n], result);
  cout << cases[(1 << n) - 1][0] / div << "/" << fact[n] / div << "\n";

  return 0;
}
```