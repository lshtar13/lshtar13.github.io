---
title: '9527 BOJ'
description: '1의 개수 세기'
pubDate: 'Feb 03 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Binary Search", "Bitmask"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/9527)

## 접근

이분 탐색과 비트마스킹을 이용해 해결하였다.

각 자리별로, 해당 자리가 1인 수의 개수를 세어 전부 더하는 방식으로 해결하였다.
0번째 자리의 경우 0001, 0011, 0101 등 0번째 자리의 비트가 1인 수의 개수를 센다.
이를 위해서 n번째 자리가 1인 최댓값과 최솟값을 구하고, 해당 값들에서 n번째 자리를 배제한 후 서로 빼는 식으로 개수를 센다.

대부분의 사람들은 최댓값과 최솟값을 따로 구하지 않고, 누적합을 이용해서 해결하는 것 같다.
누적합을 이용하는 방식이 더 깔끔하게 나오긴 한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef unsigned long long ull;
typedef const ll cll;

cll NBIT = 55, DV = 1e16, ONE = 1;
ll a, b;

ll find(ll bit) {
  ll ground = (ONE << bit);
  if (ground > b) {
    return 0;
  }

  ll st = 0, en = DV, minV, maxV;
  while (st <= en) {
    ll mid = (st + en) / 2;
    if ((ground | mid) >= a) {
      minV = ground | mid, en = mid - 1;
    } else {
      st = mid + 1;
    }
  }

  st = 0, en = DV;
  while (st <= en) {
    ll mid = (st + en) / 2;
    if ((ground | mid) <= b) {
      maxV = ground | mid, st = mid + 1;
    } else {
      en = mid - 1;
    }
  }

  ll lwMsk = (ONE << (bit + 1)) - 1, upMsk = ~lwMsk, result = 1;

  result += (lwMsk & maxV) - (lwMsk & minV);
  result += ((upMsk & maxV) >> 1) - ((upMsk & minV) >> 1);

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> a >> b;

  ll result = 0;
  for (ll bit = 0; bit < NBIT; ++bit) {
    result += find(bit);
  }

  cout << result << "\n";

  return 0;
}

```