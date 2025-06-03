---
title: '11046 BOJ'
description: '팰린드롬??'
pubDate: 'Jun 03 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Manacher"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/11046)

## 접근

매내처 알고리즘을 이용해 해결하였다.

매내처 알고리즘을 공부하는데 의의를 둔 문제 풀이이다.
매내처 알고리즘을 구현하는데 집중하였고 이후 쿼리에 대해서는,
주어진 구간의 mid를 구하고 해당 mid의 반지름안에 구간이 들어오는지 파악하는 방식으로 처리하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e6, M = 1e6;
ll n, m, nums[2 * N] = {}, p[2 * N] = {}, r = 0, c = 0;

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> nums[2 * i];
  }

  for (ll i = 1; i < 2 * n; ++i) {
    if (r < i) {
      p[i] = 0;
    } else {
      p[i] = min(p[2 * c - i], r - i);
    }

    while (i - p[i] - 1 >= 0 && i + p[i] + 1 < 2 * n) {
      if (nums[i - p[i] - 1] == nums[i + p[i] + 1]) {
        ++p[i];
      } else {
        break;
      }
    }

    if (r < i + p[i]) {
      c = i, r = i + p[i];
    }
  }

  cin >> m;
  for (ll i = 0, s, e, mid; i < m; ++i) {
    cin >> s >> e;
    s = (s - 1) * 2, e = (e - 1) * 2, mid = (s + e) / 2;
    if (mid - p[mid] <= s) {
      cout << "1\n";
    } else {
      cout << "0\n";
    }
  }

  return 0;
}
```