---
title: '1168 BOJ'
description: '요세푸스 문제 2'
pubDate: 'Jun 14 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1168)

## 접근

세그먼트 트리를 이용해 해결하였다.

세그먼트 트리를 이용해 현재 남은 인원 중 특정 순서의 인원이 누구인지 구하는 테크닉을 이용했다.
다만, 구해야 하는 순서가 무엇인지 결정하는 것이 약간 까다롭지만 모듈러 계산을 이용하면 편리하게 구할 수 있다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;

cll N = 1e5, K = 1e5;
ll n, k, segs[N * 10] = {};

ll update(ll node, ll left, ll right, ll idx, ll num) {
  if (idx < left || idx > right) {
    return segs[node];
  } else if (left == right) {
    return segs[node] += num;
  }

  ll mid = (left + right) / 2;
  return segs[node] = update(node * 2, left, mid, idx, num) +
                      update(node * 2 + 1, mid + 1, right, idx, num);
}

ll query(ll node, ll left, ll right, ll amnt) {
  if (left == right) {
    return left;
  }

  ll lamnt = segs[node * 2], ramnt = segs[node * 2 + 1],
     mid = (left + right) / 2;

  if (lamnt < amnt) {
    return query(node * 2 + 1, mid + 1, right, amnt - lamnt);
  } else {
    return query(node * 2, left, mid, amnt);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> k;
  for (ll i = 0; i < n; ++i) {
    update(1, 0, n - 1, i, 1);
  }

  vll results;
  for (ll nleft = n, tocheck = k; nleft > 0; --nleft, tocheck += k - 1) {
    if (tocheck > nleft) {
      tocheck %= nleft;
      if (tocheck == 0) {
        tocheck = nleft;
      }
    }

    ll idx = query(1, 0, n - 1, tocheck);
    update(1, 0, n - 1, idx, -1);
    results.emplace_back(idx + 1);
  }

  cout << "<";
  for (ll i = 0; i < results.size() - 1; ++i) {
    cout << results[i] << ", ";
  }
  cout << results[results.size() - 1] << ">\n";

  return 0;
}
```