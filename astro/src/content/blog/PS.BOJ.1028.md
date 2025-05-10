---
title: '1028 BOJ'
description: '다이아몬드 광산'
pubDate: 'May 10 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1028)

## 접근

다이내믹 프로그래밍으로 해결하였다.

한 지점에서, 네개 방향의 대각선으로 뻗어나갈 수 있는 최대 길이를 구해 
이를 반대편에 있을 지점과 비교하여 최대의 크기를 찾는 방식으로 해결하였다.
예를 들어, 오른쪽 위 대각선과 오른쪽 아래 대각선으로 각각 4와 3만큼 뻗을 수 있다면 오른쪽으로 3만큼 뻗을 수 있는 것이다.
3만큼 뻗었을 때 반대편의 대각선의 교점에서 뻗을 수 있는 길이가 3이상이면 크기가 3인 다이아몬드를 구성할 수 있다.
뻗을 수 있는 최대 길이는 각 방향으로 한번 이동했을 때의 지점에서의 최대 길이에 1을 더하면 된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll R = 750, C = 750, directions[4][2] = {{-1, 1}, {1, 1}, {1, -1}, {-1, -1}};
ll r, c, diags[R][C][4];
bool mat[R][C] = {{}};
// 0, 1, 2, 3 clockwise

inline bool validCord(ll i, ll l) { return i >= 0 && i < r && l >= 0 && l < c; }

ll findDiag(ll i, ll l, ll d) {
  if (!validCord(i, l)) {
    return 0;
  } else if (diags[i][l][d] != -1) {
    return diags[i][l][d];
  }

  ll &result = diags[i][l][d], ni = i + directions[d][0],
     nl = l + directions[d][1];
  if (!mat[i][l]) {
    return result = 0;
  }

  result = 1;
  if (mat[ni][nl]) {
    result = max(result, findDiag(ni, nl, d) + 1);
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> r >> c;
  for (ll i = 0; i < r; ++i) {
    cin.ignore();
    for (ll l = 0; l < c; ++l) {
      char c;
      cin >> c;
      mat[i][l] = c - '0';
    }
  }
  memset(diags, -1, sizeof(diags));

  ll result = 0;
  for (ll i = 0; i < r; ++i) {
    for (ll l = 0; l < c; ++l) {
      if (!mat[i][l]) {
        continue;
      }

      ll size = min(findDiag(i, l, 0), findDiag(i, l, 1));
      while (size > 0) {
        ll ni = i, nl = l + 2 * size - 2,
           nsize = min(findDiag(ni, nl, 2), findDiag(ni, nl, 3));

        if (size > nsize) {
          --size;
        } else {
          result = max(result, size);
          break;
        }
      }
    }
  }

  cout << result << "\n";

  return 0;
}
```