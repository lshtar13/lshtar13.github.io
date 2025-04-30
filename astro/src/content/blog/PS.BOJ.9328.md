---
title: '9328 BOJ'
description: '열쇠'
pubDate: 'Apr 30 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Breadth-First Search", "BFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/9328)

## 접근

너비우선탐색으로 해결하였다.
구현할 점이 많은 까다로운 문제였다.
난점은 크게 아래와 같이 두개였다.

1. 시작점이 여러 곳이 될 수 있다.
2. 임의의 알파벳 A와 a에 대하여 A를 방문한 후 a를 방문한 경우에 이전에 방문한 A에 대하여 다시 탐색해야 한다.

1번에 대하여는, 테두리를 감싸는 빈칸들을 한겹 만들어줌으로써 해결하였다.
(0,0)에서 모든 가능한 시작점에 도달가능하기 때문에 시작 시 queue에 (0,0)만 넣으면 된다.
괜히 배열을 뒤지며 가능한 시작점을 솎아내지 않아도 된다.

2번에 대하여는, 이전에 방문했던 통과 불가했던 관문들을 저장해놓는 별도의 자료구조를 도입함으로써 해결하였다.
각 관문들(A~Z)에 대하여 방문했었지만, 방문한 시점에는 통과하지 못했던 좌표들을 저장해놓는다.
이후 해당 관문들의 키(a~z)를 얻게 되었을 때,
저장해놓았던 관문들을 방문 표시하고 queue에 넣어 해당 관문을 기점으로 이어서 탐색하도록 한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<pll> qpll;
typedef vector<pll> vpll;

cll H = 100, W = 100, directions[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
ll h, w, mat[H + 2][W + 2] = {{}};
bool status[26] = {}, isGoal[H + 2][W + 2] = {{}};

inline bool isValidCord(ll i, ll l) {
  return i >= 0 && i < h + 2 && l >= 0 && l < w + 2 && mat[i][l] != -2;
}

ll dfs() {
  qpll q;
  bool checked[H + 2][W + 2] = {{}};
  q.push({0, 0});
  checked[0][0] = true;

  ll result = 0;
  vpll reachable[26];
  for (ll i, l; !q.empty();) {
    tie(i, l) = q.front();
    q.pop();
    for (auto &d : directions) {
      ll ni = i + d[0], nl = l + d[1];
      if (!isValidCord(ni, nl)) {
        continue;
      } else if (mat[ni][nl] >= 26 && !status[mat[ni][nl] - 26]) {
        reachable[mat[ni][nl] - 26].emplace_back(ni, nl);
        continue;
      } else if (checked[ni][nl]) {
        continue;
      }

      if (mat[ni][nl] != -1 && mat[ni][nl] < 26) {
        if (!status[mat[ni][nl]]) {
          for (auto &p : reachable[mat[ni][nl]]) {
            if (checked[p.first][p.second]) {
              continue;
            }
            mat[p.first][p.second] = -1;
            checked[p.first][p.second] = true;
            q.push(p);
          }
          status[mat[ni][nl]] = true;
        }
      }

      if (isGoal[ni][nl]) {
        isGoal[ni][nl] = false, ++result;
      }
      checked[ni][nl] = true;
      q.push({ni, nl});
    }
  }

  return result;
}

ll solve() {
  cin >> h >> w;
  memset(status, 0, sizeof(status));
  memset(mat, -1, sizeof(mat));
  memset(isGoal, 0, sizeof(isGoal));
  for (ll i = 1; i <= h; ++i) {
    string str;
    cin >> str;
    for (ll l = 1; l <= w; ++l) {
      char c = str[l - 1];
      switch (c) {
      case '*':
        mat[i][l] = -2;
        break;
      case '.':
        break;
      case '$':
        isGoal[i][l] = true;
        break;
      default:
        if (c >= 'A' && c <= 'Z') {
          mat[i][l] = c - 'A' + 26;
        } else if (c >= 'a' && c <= 'z') {
          mat[i][l] = c - 'a';
        }
      }
    }
  }

  string str;
  cin >> str;
  if (str[0] != '0') {
    for (auto &c : str) {
      status[c - 'a'] = true;
    }
  }

  return dfs();
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    cout << solve() << "\n";
  }

  return 0;
}
```