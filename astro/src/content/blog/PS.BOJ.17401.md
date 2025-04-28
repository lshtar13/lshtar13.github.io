---
title: '17401 BOJ'
description: '일하는 세포'
pubDate: 'Apr 28 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Divide and Conquer"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/17401)

## 접근

분할 정복을 통한 거듭 제곱을 활용해 해결하였다.

감을 못 잡고 BFS 같은 얼토당토 않는 아이디어를 떠올리다가,
문제 태그를 보고 너무 당연한 것을 생각 못했다는 것에 대한 회한에 휩싸였던 문제였다.
행렬을 통해 갈 수 있는 경로를 표시하는 것이 가장 중요한 아이디어 이다.
이렇게 표현된 행렬들을 곱함으로써 d분 후의 해당 위치에 위치할 수 있는 경우의 수를 구할 수 있다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;
typedef vector<vll> vvll;

cll T = 100, N = 20, D = 1e9, MOD = 1e9 + 7;
ll t, n, d;
vvll mat[T], nullMat, all;

vvll mult(const vvll &a, const vvll &b) {
  vvll result(n, vll(n, 0));
  for (ll i = 0; i < n; ++i) {
    for (ll l = 0; l < n; ++l) {
      for (ll j = 0; j < n; ++j) {
        result[i][l] += a[i][j] * b[j][l];
        result[i][l] %= MOD;
      }
    }
  }

  return result;
}

vvll square(ll num) {
  if (num == 0) {
    return nullMat;
  }

  vvll result = square(num / 2);
  result = mult(result, result);
  if (num % 2) {
    result = mult(result, all);
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> t >> n >> d;
  for (ll i = 0, m; i < t; ++i) {
    cin >> m;
    mat[i].resize(n, vll(n, 0));
    for (ll l = 0, a, b, c; l < m; ++l) {
      cin >> a >> b >> c;
      --a, --b;
      mat[i][a][b] = c;
    }
  }
  nullMat.resize(n, vll(n, 0));
  for (ll i = 0; i < n; ++i) {
    nullMat[i][i] = 1;
  }

  all = nullMat;
  for (ll i = 0; i < t; ++i) {
    all = mult(all, mat[i]);
  }

  vvll result = mult(square(d / t), nullMat);
  for (ll i = 0; i < d % t; ++i) {
    result = mult(result, mat[i]);
  }

  for (ll i = 0; i < n; ++i) {
    for (ll l = 0; l < n; ++l) {
      cout << result[i][l] << " ";
    }
    cout << "\n";
  }

  return 0;
}
```