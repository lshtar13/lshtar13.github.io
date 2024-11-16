---
title: '13459 BOJ'
description: '구슬 탈출'
pubDate: 'Nov 16 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Depth-First Search", "DFS", "Simulation"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/13459)

스타트링크에서 판매하는 어린이용 장난감 중에서 가장 인기가 많은 제품은 구슬 탈출이다. 구슬 탈출은 직사각형 보드에 빨간 구슬과 파란 구슬을 하나씩 넣은 다음, 빨간 구슬을 구멍을 통해 빼내는 게임이다.

보드의 세로 크기는 N, 가로 크기는 M이고, 편의상 1×1크기의 칸으로 나누어져 있다. 가장 바깥 행과 열은 모두 막혀져 있고, 보드에는 구멍이 하나 있다. 빨간 구슬과 파란 구슬의 크기는 보드에서 1×1크기의 칸을 가득 채우는 사이즈이고, 각각 하나씩 들어가 있다. 게임의 목표는 빨간 구슬을 구멍을 통해서 빼내는 것이다. 이때, 파란 구슬이 구멍에 들어가면 안 된다.

이때, 구슬을 손으로 건드릴 수는 없고, 중력을 이용해서 이리 저리 굴려야 한다. 왼쪽으로 기울이기, 오른쪽으로 기울이기, 위쪽으로 기울이기, 아래쪽으로 기울이기와 같은 네 가지 동작이 가능하다.

각각의 동작에서 공은 동시에 움직인다. 빨간 구슬이 구멍에 빠지면 성공이지만, 파란 구슬이 구멍에 빠지면 실패이다. 빨간 구슬과 파란 구슬이 동시에 구멍에 빠져도 실패이다. 빨간 구슬과 파란 구슬은 동시에 같은 칸에 있을 수 없다. 또, 빨간 구슬과 파란 구슬의 크기는 한 칸을 모두 차지한다. 기울이는 동작을 그만하는 것은 더 이상 구슬이 움직이지 않을 때 까지이다.

보드의 상태가 주어졌을 때, 10번 이하로 빨간 구슬을 구멍을 통해 빼낼 수 있는지 구하는 프로그램을 작성하시오.

# 접근

DFS를 이용해 해결하였다.

각 구슬의 위치 상태를 분기점으로 사용하여 DFS 알고리즘을 구현하였다. 
초기 상태를 큐에 넣고, 4가지 방향으로 각각 기울였을 때 어떻게 각 구슬이 변하는지 추적하였다.
두 구슬이 같은 열이나 행을 이동할 때, 서로 겹치지 않게 먼저 이동한 구슬의 종착 정보를 반영해 주었다.

경우의 수가 꽤 많아 구현하는 데에 어려움이 있었다. 
특히 swtich-case 문에서 방향에 따라 다르게 작성한 코드들은 함수로 묶어 코드 양을 줄일 수 있을 것 같다.
퇴고가 필요한 문제풀이이다.

# 입력

첫 번째 줄에는 보드의 세로, 가로 크기를 의미하는 두 정수 N, M (3 ≤ N, M ≤ 10)이 주어진다. 다음 N개의 줄에 보드의 모양을 나타내는 길이 M의 문자열이 주어진다. 이 문자열은 '.', '#', 'O', 'R', 'B' 로 이루어져 있다. '.'은 빈 칸을 의미하고, '#'은 공이 이동할 수 없는 장애물 또는 벽을 의미하며, 'O'는 구멍의 위치를 의미한다. 'R'은 빨간 구슬의 위치, 'B'는 파란 구슬의 위치이다.

입력되는 모든 보드의 가장자리에는 모두 '#'이 있다. 구멍의 개수는 한 개 이며, 빨간 구슬과 파란 구슬은 항상 1개가 주어진다.

# 출력

파란 구슬을 구멍에 넣지 않으면서 빨간 구슬을 10번 이하로 움직여서 빼낼 수 있으면 1을 없으면 0을 출력한다.

# 코드

```cpp
#include <bits/stdc++.h>
#include <queue>
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

cll N = 10, M = 10, directions[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
ll n, m, mat[N][M] = {{}}, goal[2];

typedef tuple<ll, ll, ll, ll, ll> status_t;
typedef tuple<ll, ll> cord_t;

inline bool isGoal(ll c0, ll c1) { return c0 == goal[0] && c1 == goal[1]; }

inline bool isValid(ll c0, ll c1) {
  return c0 >= 0 && c0 < n && c1 >= 0 && c1 < m && !mat[c0][c1];
}

cord_t move(ll c0, ll c1, ll d0, ll d1) {
  while (isValid(c0 + d0, c1 + d1)) {
    c0 += d0, c1 += d1;
    if (c0 == goal[0] && c1 == goal[1]) {
      break;
    }
  }
  return make_tuple(c0, c1);
}

status_t check(ll d, status_t &prev) {
  ll r0, r1, b0, b1, w, R0, R1, B0, B1, W;
  tie(r0, r1, b0, b1, w) = prev;
  switch (d) {
  case 0:
    if (r1 == b1 && r0 > b0) {
      tie(R0, R1) = move(r0, r1, directions[0][0], directions[0][1]);
      mat[R0][R1] = !isGoal(R0, R1) ? -2 : 0;
      tie(B0, B1) = move(b0, b1, directions[0][0], directions[0][1]);
      mat[R0][R1] = 0;
    } else {
      tie(B0, B1) = move(b0, b1, directions[0][0], directions[0][1]);
      mat[B0][B1] = !isGoal(B0, B1) ? -2 : 0;
      tie(R0, R1) = move(r0, r1, directions[0][0], directions[0][1]);
      mat[B0][B1] = 0;
    }
    break;
  case 1:
    if (r1 == b1 && r0 < b0) {
      tie(R0, R1) = move(r0, r1, directions[1][0], directions[1][1]);
      mat[R0][R1] = !isGoal(R0, R1) ? -2 : 0;
      tie(B0, B1) = move(b0, b1, directions[1][0], directions[1][1]);
      mat[R0][R1] = 0;
    } else {
      tie(B0, B1) = move(b0, b1, directions[1][0], directions[1][1]);
      mat[B0][B1] = !isGoal(B0, B1) ? -2 : 0;
      tie(R0, R1) = move(r0, r1, directions[1][0], directions[1][1]);
      mat[B0][B1] = 0;
    }
    break;
  case 2:
    if (r0 == b0 && r1 > b1) {
      tie(R0, R1) = move(r0, r1, directions[2][0], directions[2][1]);
      mat[R0][R1] = !isGoal(R0, R1) ? -2 : 0;
      tie(B0, B1) = move(b0, b1, directions[2][0], directions[2][1]);
      mat[R0][R1] = 0;
    } else {
      tie(B0, B1) = move(b0, b1, directions[2][0], directions[2][1]);
      mat[B0][B1] = !isGoal(B0, B1) ? -2 : 0;
      tie(R0, R1) = move(r0, r1, directions[2][0], directions[2][1]);
      mat[B0][B1] = 0;
    }
    break;
  case 3:
    if (r0 == b0 && r1 < b1) {
      tie(R0, R1) = move(r0, r1, directions[3][0], directions[3][1]);
      mat[R0][R1] = !isGoal(R0, R1) ? -2 : 0;
      tie(B0, B1) = move(b0, b1, directions[3][0], directions[3][1]);
      mat[R0][R1] = 0;
    } else {
      tie(B0, B1) = move(b0, b1, directions[3][0], directions[3][1]);
      mat[B0][B1] = !isGoal(B0, B1) ? -2 : 0;
      tie(R0, R1) = move(r0, r1, directions[3][0], directions[3][1]);
      mat[B0][B1] = 0;
    }
    break;
  }

  if (isGoal(B0, B1)) {
    W = -1;
  } else if (isGoal(R0, R1)) {
    W = -2;
  } else if (r0 == R0 && r1 == R1 && b0 == B0 && b1 == B1) {
    W = -1;
  } else {
    W = w + 1;
  }
//   cout << r0 << "/" << r1 << " " << b0 << "/" << b1 << " ";
//   cout << R0 << "/" << R1 << " " << B0 << "/" << B1 << " ";
//   cout << W << "\n";
  return make_tuple(R0, R1, B0, B1, W);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  status_t init;
  cin >> n >> m;
  for (ll i = 0; i < n; ++i) {
    for (ll l = 0; l < m; ++l) {
      char c;
      cin >> c;
      switch (c) {
      case '#':
        mat[i][l] = -1;
        break;
      case '.':
        mat[i][l] = 0;
        break;
      case 'O':
        goal[0] = i, goal[1] = l;
        break;
      case 'R':
        get<0>(init) = i, get<1>(init) = l;
        break;
      case 'B':
        get<2>(init) = i, get<3>(init) = l;
        break;
      }
    }
  }
  get<4>(init) = 0;

  queue<status_t> q;
  q.push(init);
  while (!q.empty()) {
    status_t status = q.front();
    q.pop();

    if (get<4>(status) >= 10) {
      continue;
    }

    for (auto d : {0, 1, 2, 3}) {
      status_t result = check(d, status);
      switch (get<4>(result)) {
      case -1:
        break;
      case -2:
        cout << 1 << "\n";
        goto END;
        break;
      default:
        q.push(result);
      }
    }
  }
  cout << 0 << "\n";
END:

  return 0;
}
```
