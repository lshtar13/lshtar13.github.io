---
title: '17071 BOJ'
description: '숨바꼭질 5'
pubDate: 'May 22 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Breadth-First Search", "BFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/17071)

## 접근

너비 우선 탐색으로 해결하였다.

수빈이가 짝수 시간에 도착할 수 있는 경우와 홀수 시간에 도착할 수 있는 경우를 분리하여 생각해야 한다.
만약, t초에 어떤 지점에 도착할 수 있다면 t+2, t+4, t+(2의 배수)의 시간에 해당 지점에 머무를 수 있다.
다른 지점으로 갔다가 돌아오면 되기 때문인데, 이러한 행위는 2의 배수 시간 만큼 소요되기 때문이다.
따라서, 홀수 시간에 도착하는 경우의 최소시간과 짝수 시간에 도착하는 경우의 최소시간을 각각 너비 우선 탐색을 통해 구해 기록한다.
이후, 동생의 움직임을 추적하면서 수빈이가 해당 지점에 머무를 수 있는 최소 시간을 비교해 답을 도출하면 된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<pll> qpll;

cll N = 5e5, K = 5e5, directions[3][2] = {{1, 1}, {1, -1}, {2, 0}};
ll n, k, mat[N + 1][2] = {};

inline bool isValidCord(ll idx) { return idx >= 0 && idx <= N; }

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> k;

  memset(mat, -1, sizeof(mat));
  qpll q;
  q.push({n, 0});
  mat[n][0] = 0;
  while (!q.empty()) {
    ll pos = q.front().first, isOdd = q.front().second;
    q.pop();

    for (auto &d : directions) {
      ll npos = pos * d[0] + d[1], nisOdd = !isOdd;
      if (isValidCord(npos) && mat[npos][nisOdd] == -1) {
        mat[npos][nisOdd] = mat[pos][isOdd] + 1;
        q.push({npos, nisOdd});
      }
    }
  }

  for (ll t = 0, pos = k + t; pos <= N; pos += ++t) {
    ll isOdd = t % 2;
    if (mat[pos][isOdd] == -1) {
      continue;
    }

    if (mat[pos][isOdd] <= t) {
      cout << t << "\n";
      goto END;
    }
  }

  cout << "-1\n";

END:

  return 0;
}
```