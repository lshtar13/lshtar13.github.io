---
title: '16957 BOJ'
description: '체스판 위의 공'
pubDate: 'Jan 15 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS",\
        "Dynamic Programming", "DP", "Depth-First Search", "DFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/16957)

## 접근

다이내믹 프로그래밍과 깊이 우선 탐색을 이용해 해결하였다.

한 지점에서 가게 되는 목적지가 정해져 있다는 것에 집중하였다.
따라서 메모이제이션을 통해 다른 지점의 목적지를 저장해 놓는다면,
깊이 우선 탐색 중 경유하게 되는 지점의 목적지가 곧 현재 탐색 중인 지점의 목적지가 된다.
이를 통해 dp 배열에 목적지를 저장해 놓는 방식으로 해결하였다.

다른 사람들의 풀이를 보니, 내 풀이가 일반적이진 않고 많은 사람들이 분리집합으로 해결하는 것을 알 수 있었다.
분리집합을 통해서 해당 집합의 목적지를 기록하고 갱신하는 방식으로 해결할 수 있을 것이다.
실행 시간 차이는 크게 나지 않는 것을 보니, 취향껏 먼저 떠올린 방식으로 해결하는 것이 정답이겠다.

## 코드

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

cll R = 500, C = 500, INF = 3e5,
    directions[8][2] = {{0, 1}, {0, -1}, {1, 0},  {-1, 0},
                        {1, 1}, {1, -1}, {-1, 1}, {-1, -1}};
ll r, c, board[R][C] = {{}}, toward[R][C] = {{}}, results[R][C] = {{}};

inline bool isValid(ll i, ll l) { return i >= 0 && i < r && l >= 0 && l < c; }

pll find(ll i, ll l) {
  if (toward[i][l] != -1) {
    return {toward[i][l] / c, toward[i][l] % c};
  }

  pll result = {i, l};
  ll next = board[i][l];
  for (auto &d : directions) {
    ll _i = i + d[0], _l = l + d[1];
    if (!isValid(_i, _l)) {
      continue;
    }

    if (next > board[_i][_l]) {
      result = find(_i, _l);
      next = board[_i][_l];
    }
  }

  toward[i][l] = result.first * c + result.second;
  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> r >> c;
  FOR2(i, l, r, c) { cin >> board[i][l]; }
  memset(toward, -1, sizeof(toward));

  FOR2(i, l, R, C) {
    pll dest = find(i, l);
    ++results[dest.first][dest.second];
  }

  for (ll i = 0; i < r; ++i) {
    for (ll l = 0; l < c; ++l) {
      cout << results[i][l] << " ";
    }
    cout << "\n";
  }

  return 0;
}
```