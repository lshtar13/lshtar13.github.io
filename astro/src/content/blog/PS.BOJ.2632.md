---
title: '2632 BOJ'
description: '피자판매'
pubDate: 'Feb 10 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Prefix Sum"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2632)

## 접근

누적합?을 이용해 해결하였다.

사실 무어라 가져다 붙일 수 없는 이상한 풀이를 통해 해결하였다.
큰 틀에서는, 나올 수 있는 피자 조각의 합을 모두 조사하고 경우의 수를 구하는 방식으로 풀었다.
A의 합의 경우의 수와, B의 경우의 수를 모두 구한다.
이후 고객이 원하는 사이즈 S에 대하여 (0, S), (1, S-1), ... (S-1, 1), (S, 0) 등 A와 B에서 각각 a만큼, b만큼 가져올 수 있는 경우
(a, b)를 이룰 수 있는 모든 경우의 수를 더해 답을 도출한다. 

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll S = 2e6, M = 1e3, N = 1e3;
ll s, npieces[2], pieces[2][N] = {{}}, sorts[2][S] = {{}};
bool checked[2][N][N] = {};

void check(ll i, ll st, ll en, ll sum) {
  if (checked[i][st][en]) {
    return;
  }
  ++sorts[i][sum], checked[i][st][en] = true;
  if (st != en) {
    check(i, (st + 1) % npieces[i], en, sum - pieces[i][st]);
    check(i, st, (en - 1 + npieces[i]) % npieces[i], sum - pieces[i][en]);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> s >> npieces[0] >> npieces[1];
  for (ll i = 0; i < 2; ++i) {
    ll sum = 0;
    for (ll piece = 0; piece < npieces[i]; ++piece) {
      cin >> pieces[i][piece];
      sum += pieces[i][piece];
    }

    for (ll st = 0; st < npieces[i]; ++st) {
      ll en = (st - 1 + npieces[i]) % npieces[i];
      check(i, st, en, sum);
    }
    sorts[i][0] = 1, sorts[i][sum] = 1;
  }

  ll result = 0;
  for (ll left = 0; left <= s; ++left) {
    ll right = s - left;
    result += sorts[0][left] * sorts[1][right];
  }

  cout << result << '\n';

  return 0;
}
```