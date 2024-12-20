---
title: '17143 BOJ'
description: '낚시왕'
pubDate: 'Dec 20 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Implementation"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/17143)

## 접근

순전한 구현 문제이다. 상어 움직임을 최적화하는 것만 조금 신경쓰면 된다.
불필요한 움직임을 모듈러 연산을 통해서 없애고, 방향 전환하는 것만 계산해서 구하면 된다.

## 코드

```c++
#include <bits/stdc++.h>
#include <tuple>

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

typedef tuple<ll, ll, ll> info; // a, b, s, d, z

cll R = 100, C = 100, M = 10000, S = 1000,
    directions[4][2] = {{-1, 0}, {1, 0}, {0, 1}, {0, -1}},
    convert[4] = {1, 0, 3, 2};
const info NULLINFO(0, 0, 0);
ll r, c, m, _r = -1, _c = -1, matIdx = 0;
info mat[2][R][C] = {{{}}};

bool isValid(ll a, ll b) { return a >= 0 && a < r && b >= 0 && b < c; }

info move(ll a, ll b, ll s, ll d) {
  while (true) {
    if (a + s * directions[d][0] < 0) {
      d = convert[d];
      s = s - a;
      a = 0;
    } else if (a + s * directions[d][0] >= r) {
      d = convert[d];
      s = s - (r - 1 - a);
      a = r - 1;
    } else if (b + s * directions[d][1] < 0) {
      d = convert[d];
      s = s - b;
      b = 0;
    } else if (b + s * directions[d][1] >= c) {
      d = convert[d];
      s = s - (c - 1 - b);
      b = c - 1;
    } else {
      break;
    }
  }

  a += s * directions[d][0], b += s * directions[d][1];

  return make_tuple(a, b, d);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> r >> c >> m;
  for (ll a, b, s, d, z, i = 0; i < m; ++i) {
    cin >> a >> b >> s >> d >> z;
    --a, --b, --d, s %= (2 * S - 2);
    mat[matIdx][a][b] = make_tuple(s, d, z);
  }

  info tgt;
  ll sum = 0, _i, _l, s, d, z, _z;
  for (ll fisher = 0; fisher < c; ++fisher) {
    // for (ll i = 0; i < r; ++i) {
    //   for (ll l = 0; l < c; ++l) {
    //     cout << get<2>(mat[matIdx][i][l]) << " ";
    //   }
    //   cout << "\n";
    // }
    // cout << "*******************\n";
    for (ll row = 0; row < r; ++row) {
      tie(s, d, z) = mat[matIdx][row][fisher];
      if (z) {
        sum += z;
        mat[matIdx][row][fisher] = NULLINFO;
        break;
      }
    }

    FOR2(i, l, r, c) {
      tie(s, d, z) = mat[matIdx][i][l];
      mat[matIdx][i][l] = NULLINFO;
      tie(_i, _l, d) = move(i, l, s, d);
      if (get<2>(mat[1 - matIdx][_i][_l]) < z) {
        mat[1 - matIdx][_i][_l] = make_tuple(s, d, z);
      }
    }

    matIdx = 1 - matIdx;

    // for (ll i = 0; i < r; ++i) {
    //   for (ll l = 0; l < c; ++l) {
    //     cout << get<2>(mat[matIdx][i][l]) << " ";
    //   }
    //   cout << "\n";
    // }
    // cout << "----------------\n";
  }

  cout << sum << "\n";

  return 0;
}
```