---
title: '14939 BOJ'
description: '불 끄기'
pubDate: 'Apr 22 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Greedy", "Bitmask"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/14939)

## 접근

비트마스크를 이용한, 그리디 알고리즘을 활용해 해결하였다.

위에서 아래로 훑으며 비가역적으로 불을 끈다면,
다시 말해 현재 탐색하고 있는 위치의 위에 있는 스위치를 조작할 수 없다 가정하면
바로 위의 전구가 켜져 있는 자리만 불을 끌 수 있다.
만약, 바로 위의 전구가 꺼져있음에도 불구하고 스위치를 조작한다면
바로 위의 전구가 켜지게 되고 해당 전구를 끌 길은 요원하다.
따라서, 직전 줄의 전구 점등 상태가 현재 줄 스위치 조작을 결정한다.
이와 같은 논리 아래에서는, 맨 윗줄의 전구 점등 상태가 모든 것을 결정한다고 받아들여도 된다.
맨 윗줄의 스위치 중 무엇을 누를지 결정하면 나머지 아래 줄들은 그 결과를 따라가면 되기 때문이다.
따라서, 맨 윗줄 스위치들의 조작 유무를 담은 비트마스크 0 ~ 1023만 조사하면 된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 10, INF = N * N + 1;
ll bulbs[N + 1] = {};

ll find(ll idx, ll cur, ll prv) {
  ll next = bulbs[idx + 1], nchanged = 0;
  for (ll i = 0; i < N; ++i) {
    if (prv & (1 << i)) {
      ++nchanged, cur ^= (1 << i), next ^= (1 << i);
      if (i > 0) {
        cur ^= (1 << (i - 1));
      }
      if (i < N - 1) {
        cur ^= (1 << (i + 1));
      }
    }
  }

  if (idx == N - 1) {
    if (cur == 0) {
      return nchanged;
    } else {
      return INF;
    }
  } else {
    return nchanged + find(idx + 1, next, cur);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  for (ll i = 0; i < N; ++i) {
    for (ll l = 0; l < N; ++l) {
      char c;
      cin >> c;
      if (c == 'O') {
        bulbs[i] |= (1 << l);
      }
    }
    cin.ignore();
  }

  ll result = INF;
  for (ll choice = 0, cur, next, nchanged; choice < (1 << N); ++choice) {
    cur = bulbs[0], next = bulbs[1], nchanged = 0;
    for (ll i = 0; i < N; ++i) {
      if (choice & (1 << i)) {
        ++nchanged, next ^= (1 << i);
        cur ^= (1 << i);
        if (i > 0) {
          cur ^= (1 << (i - 1));
        }
        if (i < N - 1) {
          cur ^= (1 << (i + 1));
        }
      }
    }

    result = min(result, nchanged + find(1, next, cur));
  }

  cout << (result == INF ? -1 : result) << "\n";

  return 0;
}
```