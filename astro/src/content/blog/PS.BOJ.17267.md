---
title: '17267 BOJ'
description: '상남자'
pubDate: 'Jul 18 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS",]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/17267)

## 접근

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)

cll N = 1000, M = 1000, directions[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
ll n, m, nleft, nright, mat[N][M] = {{}};
bool blocked[N][M] = {{}};
pll st;

inline bool isValidCord(ll i, ll l) {
  return i >= 0 && i < n && l >= 0 && l < m && !blocked[i][l];
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> nleft >> nright;
  FOR(i, 0, n) {
    cin.ignore();
    FOR(l, 0, m) {
      char c;
      cin >> c;
      if (c == '2') {
        st = {i, l};
      } else {
        blocked[i][l] = c - '0';
      }
    }
  }

  ll result = 1;
  memset(mat, -1, sizeof(mat));
  qpll q({st});
  mat[st.first][st.second] = nleft * M + nright;
  while (!q.empty()) {
    ll i, l, cn, cm;
    tie(i, l) = q.front();
    q.pop();

    cn = mat[i][l] / M, cm = mat[i][l] % M;
    for (auto &d : directions) {
      FOR(offset, 1, n + 1) {
        ll ni = i + d[0] * offset, nl = l + d[1];
        ll nn = cn - bool(d[1] < 0), nm = cm - bool(d[1] > 0);
        if (!isValidCord(ni, nl)) {
          break;
        } else if (mat[ni][nl] != -1 || nn < 0 || nm < 0) {
          break;
        }

        mat[ni][nl] = nn * M + nm, ++result;
        q.push({ni, nl});
      }
    }
  }

  cout << result << "\n";

  return 0;
}
```