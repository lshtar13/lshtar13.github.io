---
title: '1016 BOJ'
description: '제곱 ㄴㄴ 수'
pubDate: 'Mar 21 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Sieve of Eratosthenes", "Sieve"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1016)

## 접근

에라토스테네스의 체(Sieve)를 이용해 해결하였다.

Sieve 아이디어를 사용해야 하는 지점은 두 부분이다.
조사해 봐야 할 소수를 탐색하기 위해 사용하는 경우
그리고 해당 소수를 제곱했을 때의 수의 배수가 범위안에 존재하는지 조사하는 경우이다.
모든 제곱수는 소수의 제곱의 배수이기 때문에, 소수에 대해서만 판별하면 된다.
범위안에 존재하는 제곱수를 빠르게 지우기 위해 소수를 탐색할 때 처럼 탐색하는 소수의 제곱에 대하여 중복해 더해가며 탐색한다.


## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll MIN = 1e12, MAX = MIN + 1e6, SQ = 1e6;
ll minN, maxN;
bool isNotPrime[SQ + 1] = {}, isNotOK[MAX - MIN + 1] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> minN >> maxN;

  for (ll a, b, sq = 2; sq * sq <= maxN; ++sq) {
    if (isNotPrime[sq]) {
      continue;
    }

    for (ll num = 2 * sq; num <= SQ; num += sq) {
      isNotPrime[num] = true;
    }
    for (ll div = sq * sq, num = ((minN - 1) / div + 1) * div; num <= maxN;
         num += div) {
      isNotOK[num - minN] = true;
    }
  }

  ll result = 0;
  for (ll num = minN; num <= maxN; ++num) {
    result += !isNotOK[num - minN];
  }

  cout << result << "\n";

  return 0;
}
```