---
title: '11440 BOJ'
description: '피보나치 수의 제곱의 합'
pubDate: 'Apr 23 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Fibonacci", "Divide and Conquer"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/11440)

## 접근

점화식과 분할정복을 이용해 해결하였다.

피보나치 수의 제곱의 합을 피보나치 수에 대한 점화식으로 표현하는 것이 까다로웠다.
계속 헤메다가, 수열의 특성을 정리해놓은 블로그를 보고 방법을 찾았다.
계속 f(n+2) = f(n+1) + f(n)의 형식으로만 고민하고 있었는데,
피보나치의 변형 성질을 알기 위해선 대부분 f(n) = f(n+1) - (fn-1)을 활용하는 것이었다.
위와 같이 두고, 양변에 f(n)을 각각 곱하니 점화식이 보였다.
오랜만에 수학1 문제 푸는 기분이 났고 그동안 많이 논리적 사고력이 퇴화하였다는 것을 실감하였다.
피보나치 수를 구하는 것에 관하여서는, 분할정복을 이용한 행렬의 거듭제곱으로 시간 복잡도를 낮추었다.


## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

typedef tuple<ll, ll, ll, ll> mat_t;

cll N = 1e18, MOD = 1e9 + 7;
ll n;

mat_t mult(mat_t a, mat_t b) {
  ll a0, a1, a2, a3, b0, b1, b2, b3;
  tie(a0, a1, a2, a3) = a, tie(b0, b1, b2, b3) = b;
  return {(a0 * b0 + a1 * b2) % MOD, (a0 * b1 + a1 * b3) % MOD,
          (a2 * b0 + a3 * b2) % MOD, (a2 * b1 + a3 * b3) % MOD};
}

mat_t fibo(ll num) {
  if (num == 0) {
    return {1, 0, 0, 1};
  } else if (num == 1) {
    return {1, 1, 1, 0};
  }

  mat_t a = fibo(num / 2), b = fibo(num % 2);
  return mult(mult(a, a), b);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  mat_t result = fibo(n);
  cout << (get<0>(result) * get<2>(result)) % MOD << "\n";

  return 0;
}
```