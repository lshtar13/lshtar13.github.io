---
title: '17136 BOJ'
description: '색종이 붙이기'
pubDate: 'Dec 01 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS","Brute Force", "Backtracking"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/17136)

## 접근

브루트포스와 백트리킹 알고리즘으로 해결하였다.

10X10 평면을 왼쪽 위부터 훑으며 탐색하였다.
만약, 색종이로 덮어야 하는 지점이 나오면, 크기가 1에서 5까지의 색종이를 덧붙인 후 해당 부분을 0으로 바꾼다.
0으로 바꾼 부분은 나머지 부분 탐색이 종료되면 다시 1로 바꾼다.
이후, 계속 탐색을 진행하여 평면의 끝에 도달하였을 때 결과를 반환하도록 한다.

생각보다 간단히 풀리는 백트래킹 문제였다. 조금 나이브하게 풀이한 면이 있지만 크게 문제될 부분은 아니라고 생각한다.

# 코드

```c++
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

cll INF = 100;
ll mat[10][10] = {{}}, kind[6] = {0, 5, 5, 5, 5, 5};

inline bool isValid(ll i, ll l) { return i >= 0 && i < 10 && l >= 0 && l < 10; }

ll find(ll idx) {
  ll result = INF, i = idx / 10, l = idx % 10;
  if (idx >= 100) {
    return 0;
  } else if (!mat[i][l]) {
    return find(idx + 1);
  }

  for (ll d = 1; d <= 5;) {
    if (!kind[d]) {
      goto skip;
    }

    FOR2(di, dl, d, d) {
      if (!isValid(i + di, l + dl) || !mat[i + di][l + dl]) {
        goto skip;
      }
    }
    --kind[d];
    FOR2(di, dl, d, d) { mat[i + di][l + dl] = 0; }
    result = min(result, find(idx + d) + 1);
    FOR2(di, dl, d, d) { mat[i + di][l + dl] = 1; }
    ++kind[d];

  skip:
    ++d;
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  FOR2(i, l, 10, 10) { cin >> mat[i][l]; }

  ll result = find(0);
  cout << (result >= INF ? -1 : result) << "\n";

  return 0;
}
```