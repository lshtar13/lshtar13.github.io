---
title: '2352 BOJ'
description: '반도체 설계'
pubDate: 'Jan 16 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Binary Search", "Logest Increasing Subsequence"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2352)

## 접근

이분탐색을 통한 LIS로 해결한 문제이다.

DP로 풀 수 있을 것 같은 순서(sequence)문제는 LIS인지 고민해 보는 것이 좋을 듯 하다.
이번 문제도 dp가 머릿속을 스치고 지나갔지만, LIS임을 알아차리기까지 오래 걸리지 않았다.
유사 문제로 [1365번 문제](https://www.acmicpc.net/problem/1365)도 해결해 보았다.

## 코드

```c++
#include <algorithm>
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

cll N = 4e4;
ll n, nums[N] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> nums[i];
  }

  vll lis;
  lis.emplace_back(nums[0]);
  for (ll i = 1; i < n; ++i) {
    auto it = lower_bound(lis.begin(), lis.end(), nums[i]);
    if (it == lis.end()) {
      lis.emplace_back(nums[i]);
    } else {
      *it = nums[i];
    }
  }

  cout << lis.size() << "\n";

  return 0;
}
```