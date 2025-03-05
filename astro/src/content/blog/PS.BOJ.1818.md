---
title: '1818 BOJ'
description: '책정리'
pubDate: 'Mar 06 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Longest Increasing Subsequence", "LIS", "Binary Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1818)

## 접근

LIS로 해결하였다.

책들을 순서대로 맞추는 것이고, 이미 오름차순으로 배열되어 있는 책들은 이동할 필요가 없다는 점에서 LIS를 활용하였다.
순서에 맞지 않는 책을 순서에 맞도록 옮기는 위해 한권의 책에 대하여 한번의 이동만 필요하므로,
LIS를 구하고 이를 전체 책의 권수에서 빼면 필요한 이동의 수가 나오게 된다.

LIS인 점을 파악하기만 하면 금방 해결할 수 있는 문제이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 2e5;
ll n, nums[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> nums[i];
  }

  deque<ll> lis;
  lis.emplace_back(nums[0]);
  for (ll i = 1; i < n; ++i) {
    auto pos = lower_bound(lis.begin(), lis.end(), nums[i]);
    if (pos != lis.end()) {
      *pos = nums[i];
    } else {
      lis.emplace_back(nums[i]);
    }
  }

  cout << n - lis.size() << "\n";

  return 0;
}
```