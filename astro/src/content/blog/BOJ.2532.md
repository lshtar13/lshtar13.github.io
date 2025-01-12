---
title: '2532 BOJ'
description: '먹이사슬'
pubDate: 'Jan 12 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Binary Search", "LIS", "Longest Increasing Subsequence"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2532)

## 접근

처음에 dp로 해결하려 했다가, 시간초과를 받고 이분 탐색을 이용한 LIS 풀이로 바꾸었다.

## 코드

```c++
#include <algorithm>
#include <bits/stdc++.h>
#include <utility>

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

cll N = 5e5, L = 1e9, R = 1e9;
ll n;
vpll animals;

bool isPrey(pll &predator, pll &prey) {
  ll l = predator.first, r = predator.second, _l = prey.first, _r = prey.second;
  if (l == _l && _l == _r) {
    return false;
  } else if (l <= _l && _r <= r) {
    return true;
  } else {
    return false;
  }
}

bool comp0(pll a, pll b) {
  if (a.first != b.first) {
    return a.first < b.first;
  } else {
    return a.second > b.second;
  }
}

bool comp1(pll a, pll b) { return isPrey(a, b); }

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll l, r, idx, i = 0; i < n; ++i) {
    cin >> idx >> l >> r;
    animals.emplace_back(make_pair(l, r));
  }
  sort(animals.begin(), animals.end());
  animals.erase(unique(animals.begin(), animals.end()), animals.end());
  sort(animals.begin(), animals.end(), comp0);

  ll result = 0;
  vpll lis = {animals[0]};
  for (ll i = 1; i < n; ++i) {
    auto it = lower_bound(lis.begin(), lis.end(), animals[i], comp1);
    if (it == lis.end()) {
      lis.emplace_back(animals[i]);
    } else {
      *it = animals[i];
    }
  }

  cout << lis.size() << "\n";

  return 0;
}
```