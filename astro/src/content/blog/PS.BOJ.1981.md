---
title: '1981 BOJ'
description: '배열에서 이동'
pubDate: 'Jun 10 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Breadth-First Search", "BFS", "Parametic Search", "Binary Search", "Two Pointer"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1981)

## 접근

매개변수 탐색으로 해결하였다.

접근 가능한 최대값 최소값의 범위를 설정하고 해당 범위가 유효한지 검사하는 bfs 함수를 세운 후,
이 함수를 기준으로 매개변수 탐색을 진행하였다.
가능한 low에 대하여 최적의 high값을 찾아 최소의 범위를 구했다.
투포인터로도 풀 수 있다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<pll> qpll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 100, Num = 200, directions[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
ll n, mat[N][N] = {{}};

inline bool isValidCord(ll i, ll l) {
  return i >= 0 && i < n && l >= 0 && l < n;
}

bool avail(ll low, ll high) {
  bool visited[N][N] = {{}};
  if (mat[0][0] < low || mat[0][0] > high) {
    return false;
  }

  qpll q;
  q.push({0, 0});
  visited[0][0] = true;
  while (!q.empty()) {
    ll i = q.front().first, l = q.front().second;
    q.pop();

    for (auto &d : directions) {
      ll ni = i + d[0], nl = l + d[1];
      if (!isValidCord(ni, nl) || visited[ni][nl] || mat[ni][nl] < low ||
          mat[ni][nl] > high) {
        continue;
      }

      visited[ni][nl] = true;
      q.push({ni, nl});
    }
  }

  return visited[n - 1][n - 1];
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  FOR(i, n) FOR(l, n) { cin >> mat[i][l]; }

  //  ll result = Num;
  //  for (ll low = 0, high; low <= min(mat[0][0], mat[n - 1][n - 1]); ++low) {
  //    ll st = low, en = Num, ans = -1;
  //    while (st <= en) {
  //      ll mid = (st + en) / 2;
  //      if (avail(low, mid)) {
  //        en = mid - 1, ans = mid;
  //      } else {
  //        st = mid + 1;
  //      }
  //    }
  //    if (ans != -1) {
  //      result = min(result, ans - low);
  //    }
  //  }

  ll result = Num, st = 0, en = 0;
  while (en <= Num) {
    if (avail(st, en)) {
      result = min(result, en - st);
      ++st;
    } else {
      ++en;
    }

    while (en < st) {
      ++en;
    }
  }

  cout << result << "\n";

  return 0;
}
```