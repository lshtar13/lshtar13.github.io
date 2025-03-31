---
title: '1321 BOJ'
description: '군인'
pubDate: 'Mar 31 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree", "Binary Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1321)

## 접근

세그먼트 트리와 이분 탐색을 활용하여 나이브하게 해결하였다.

두 아이디어를 융햡하여 사용하는 것 자체는 괜찮으나,
이분 탐색을 적용하는 방법에 있어서 나이브한 방식을 사용하였다.
쿼리를 여러번 발생시켜서 딱 맞는 부대를 찾았으나, 쿼리 한번으로 처리하는 방식도 존재한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 5e5, M = 1e4;
ll n, m, segs[N * 10] = {};

ll update(ll node, ll idx0, ll idx1, ll idx, ll num) {
  if (idx < idx0 || idx > idx1) {
    return segs[node];
  } else if (idx0 == idx1) {
    return segs[node] += num;
  }

  ll mid = (idx0 + idx1) / 2;
  return segs[node] = update(node * 2, idx0, mid, idx, num) +
                      update(node * 2 + 1, mid + 1, idx1, idx, num);
}

ll query(ll node, ll idx0, ll idx1, ll st, ll en) {
  if (en < idx0 || st > idx1) {
    return 0;
  } else if (st <= idx0 && en >= idx1) {
    return segs[node];
  }

  ll mid = (idx0 + idx1) / 2;
  return query(node * 2, idx0, mid, st, en) +
         query(node * 2 + 1, mid + 1, idx1, st, en);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll idx = 0, num; idx < n; ++idx) {
    cin >> num;
    update(1, 0, n - 1, idx, num);
  }

  cin >> m;
  for (ll i = 0, q, idx, a; i < m; ++i) {
    cin >> q >> idx;
    if (q == 1) {
      cin >> a;
      update(1, 0, n - 1, idx - 1, a);
    } else {
      ll st = 0, en = n - 1, ans;
      while (st <= en) {
        ll mid = (st + en) / 2;
        if (query(1, 0, n - 1, 0, mid) >= idx) {
          ans = mid, en = mid - 1;
        } else {
          st = mid + 1;
        }
      }

      cout << ans + 1 << "\n";
    }
  }

  return 0;
}
```