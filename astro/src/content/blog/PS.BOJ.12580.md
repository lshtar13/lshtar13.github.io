---
title: '12850 BOJ'
description: '본대 산책2'
pubDate: 'Jun 14 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Divide and Conquer"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/12850)

## 접근

분할 정복을 통해 해결하였다.

인접행렬로 각 부분들에서 이동할 수 있는 경우의 수를 나타내면,
d분동안 멈추지 않고 이동하였을 때 각 노드들에 대하여 접근할 수 있는 경우의 수를 행렬곱을 통해 구할 수 있다.
행렬곱을 빠르게 구하기 위해 분할 정복을 이용하면 빠르게 구할 수 있다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;
typedef vector<vll> vvll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll D = 1e9, Mod = 1e9 + 7;
vvll mat = {{0, 1, 1, 0, 0, 0, 0, 0}, {1, 0, 1, 1, 0, 0, 0, 0},
            {1, 1, 0, 1, 0, 1, 0, 0}, {0, 1, 1, 0, 1, 1, 0, 0},
            {0, 0, 0, 1, 0, 1, 1, 0}, {0, 0, 1, 1, 1, 0, 0, 1},
            {0, 0, 0, 0, 1, 0, 0, 1}, {0, 0, 0, 0, 0, 1, 1, 0}},
     identity = {{1, 0, 0, 0, 0, 0, 0, 0}, {0, 1, 0, 0, 0, 0, 0, 0},
                 {0, 0, 1, 0, 0, 0, 0, 0}, {0, 0, 0, 1, 0, 0, 0, 0},
                 {0, 0, 0, 0, 1, 0, 0, 0}, {0, 0, 0, 0, 0, 1, 0, 0},
                 {0, 0, 0, 0, 0, 0, 1, 0}, {0, 0, 0, 0, 0, 0, 0, 1}};
ll d;

vvll mult0(vvll &a, vvll &b) {
  vvll result(8, vll(8, 0));
  FOR(i, 8) FOR(l, 8) {
    FOR(j, 8) { result[i][l] += a[i][j] * b[j][l], result[i][l] %= Mod; }
  }

  return result;
}

vvll mult(ll d) {
  if (d == 0) {
    return identity;
  }

  vvll result = mult(d / 2);
  result = mult0(result, result);
  if (d % 2) {
    result = mult0(result, mat);
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> d;
  vvll result = mult(d);
  cout << result[0][0] << "\n";

  return 0;
}
```