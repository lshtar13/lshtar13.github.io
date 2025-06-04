---
title: '2243 BOJ'
description: '사탕상자'
pubDate: 'Jun 04 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree", "Binary Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2243)

## 접근

세그먼트 트리를 이용한 이분탐색으로 해결하였다.

세그먼트 트리를 이용해 맛별 사탕의 분포를 기록하였다.
이후, 주어진 순위에 해당하는 사탕을 세그먼트 트리에 기록된 부분합 정보를 활용해 탐색하면 된다.
두 자식 노드들에 대하여 왼쪽 노드보다 구하는 순위가 크다면 오른쪽 구간을 탐색하고, 반대의 경우에도 동일하게 탐색하면 된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e6;
ll n, segs[10 * N] = {};

ll query(ll node, ll st, ll en, ll num) {
  --segs[node];
  if (st == en) {
    return st;
  }

  ll mid = (st + en) / 2, left = segs[node * 2], right = segs[node * 2];
  if (num > left) {
    return query(node * 2 + 1, mid + 1, en, num - left);
  } else {
    return query(node * 2, st, mid, num);
  }
}

ll update(ll node, ll st, ll en, cll num, cll amt) {
  if (num < st || num > en) {
    return segs[node];
  } else if (st == en) {
    return segs[node] += amt;
  }

  ll mid = (st + en) / 2;
  return segs[node] = update(node * 2, st, mid, num, amt) +
                      update(node * 2 + 1, mid + 1, en, num, amt);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0, a, b, c; i < n; ++i) {
    cin >> a >> b;
    if (a == 1) {
      ll idx = query(1, 1, N, b);
      cout << idx << "\n";
    } else if (a == 2) {
      cin >> c;
      update(1, 1, N, b, c);
    }
  }

  return 0;
}
```