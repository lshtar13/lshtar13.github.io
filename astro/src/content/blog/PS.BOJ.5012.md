---
title: '5012 BOJ'
description: '불만 정렬'
pubDate: 'Jun 01 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/5012)

## 접근

세그먼트 트리를 이용해 해결하였다.

세그먼트 트리를 이용한 inversion 찾기를 두번 수행하면 된다.
세 원소가 중 가운데 원소를 기준으로 왼쪽의 inversion과 오른쪽의 inversion을 찾으면 된다.
이후 해당 inversion들의 곱을 전부 더해주면 된다.

## 코드

```c++
#include <algorithm>
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e5;
ll n, inputs[N] = {}, segs[N * 10] = {}, invs[2][N] = {{}};

ll insert(ll node, ll idx0, ll idx1, cll num) {
  if (num < idx0 || num > idx1) {
    return segs[node];
  } else if (idx0 == idx1) {
    return ++segs[node];
  }

  ll mid = (idx0 + idx1) / 2;
  return segs[node] = insert(node * 2, idx0, mid, num) +
                      insert(node * 2 + 1, mid + 1, idx1, num);
}

ll search0(ll node, ll idx0, ll idx1, cll num, bool isGreat) {
  if (isGreat) {
    if (idx1 <= num) {
      return 0;
    } else if (idx0 > num) {
      return segs[node];
    }
  } else {
    if (idx0 >= num) {
      return 0;
    } else if (idx1 < num) {
      return segs[node];
    }
  }

  ll mid = (idx0 + idx1) / 2;
  return search0(node * 2, idx0, mid, num, isGreat) +
         search0(node * 2 + 1, mid + 1, idx1, num, isGreat);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> inputs[i];
    invs[0][i] = search0(1, 1, n, inputs[i], true);
    insert(1, 1, n, inputs[i]);
  }
  memset(segs, 0, sizeof(segs));
  for (ll i = n - 1; i >= 0; --i) {
    invs[1][i] = search0(1, 1, n, inputs[i], false);
    insert(1, 1, n, inputs[i]);
  }

  ll result = 0;
  for (ll i = 0; i < n; ++i) {
    result += invs[0][i] * invs[1][i];
  }

  cout << result << "\n";

  return 0;
}
```