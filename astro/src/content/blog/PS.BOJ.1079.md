---
title: '1079 BOJ'
description: '마피아'
pubDate: 'Mar 07 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Brute Force", "Implementaion", "Backtracking"]
series: "PS"
---

# [문제](https://solved.ac/contribute/1079)

## 접근

완전탐색과 역추적을 이용해 해결하였다.

다른 사람들의 코드들에 비하면 조금 오래 걸린 편이지만,
방법 자체는 틀리지 않았다.
구현할 점이 다소 많다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 16, G = 800, R = 26;
ll n, guilty[N], r[N][N] = {{}}, mafia;

ll find(ll remains, ll visited) {
  if (remains < 2) {
    return 0;
  }

  if (remains % 2) {
    ll toKill = -1, maxG = 0;
    for (ll c = 0; c < n; ++c) {
      if (visited & (1 << c)) {
        continue;
      } else if (maxG < guilty[c]) {
        maxG = guilty[c], toKill = c;
      }
    }

    if (toKill == mafia) {
      return 0;
    }

    visited |= (1 << toKill);

    return find(remains - 1, visited);
  } else {
    ll toKill = -1, maxNight = 0;
    for (ll c = 0; c < n; ++c) {
      if (visited & (1 << c)) {
        continue;
      } else if (c == mafia) {
        continue;
      } else {
        for (ll i = 0; i < n; ++i) {
          guilty[i] += r[c][i];
        }

        ll nnight = find(remains - 1, visited | (1 << c));

        for (ll i = 0; i < n; ++i) {
          guilty[i] -= r[c][i];
        }

        if (maxNight < nnight) {
          maxNight = nnight, toKill = c;
        }
      }
    }

    return maxNight + 1;
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> guilty[i];
  }

  for (ll i = 0; i < n; ++i) {
    for (ll l = 0; l < n; ++l) {
      cin >> r[i][l];
    }
  }

  cin >> mafia;

  cout << find(n, 0) << "\n";

  return 0;
}
```