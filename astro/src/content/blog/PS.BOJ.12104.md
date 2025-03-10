---
title: '12104 BOJ'
description: '순환 수열'
pubDate: 'Mar 09 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "KMP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/12104)

## 접근



## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e5;
ll n, pi[N] = {};
string strA, strB;

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> strA >> strB;
  n = strA.size();

  for (ll i = 1, prv = pi[0]; i < n; ++i) {
    while (prv && strA[i] != strA[prv]) {
      prv = pi[prv - 1];
    }

    prv = pi[i] = (strA[i] == strA[prv] ? prv + 1 : 0);
  }

  strB = strB + strB;
  ll result = 0, a = 0, b = 0;
  while (b < 2 * n - 1) {
    if (strA[a] == strB[b]) {
      ++a, ++b;
    } else if (a) {
      a = pi[a - 1];
    } else {
      ++b;
    }

    if (a == n) {
      ++result, a = pi[n - 1];
    }
  }

  cout << result << "\n";

  return 0;
}
```