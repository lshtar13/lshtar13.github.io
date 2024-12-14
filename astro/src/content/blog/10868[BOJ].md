---
title: '10868 BOJ'
description: '최솟값'
pubDate: 'Dec 14 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree", "Sparse Table"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/10868)

## 접근

세그먼트 트리를 이용해 해결하였다.

최솟값을 저장하는 세그먼트 트리를 이용해 해결하였다. 세그먼트 트리를 응용하는 좋은 연습 문제이다.
희소 배열을 이용하는 해결방법도 있던데, 세그먼트 트리 문제를 풀 때 항상 쌍으로 생각해두면 좋은 것 같다.

세그먼트 트리 문제들을 반복적으로 풀면서 세그먼트 트리에 대한 구현력과 이해도가 나아진 것 같다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef unsigned long long ull;
typedef pair<ll, ll> pll;
typedef pair<ull, ull> pull;
typedef const ll cll;
typedef queue<ll> qll;
typedef queue<pll> qpll;
typedef priority_queue<ll> pqll;
typedef priority_queue<pll> pqpll;
typedef vector<ll> vll;
typedef vector<pll> vpll;
typedef vector<vll> vvll;
typedef vector<vpll> vvpll;
#define FOR1(a, A) for (ll a = 0; a < A; ++a)
#define FOR2(a, b, A, B)                                                       \
  for (ll a = 0; a < A; ++a)                                                   \
    for (ll b = 0; b < B; ++b)

cll N = 1e5, M = 1e5, INF = 1e9 + 1;
ll n, m, nums[N] = {}, seg[N * 15] = {};

ll fill(ll st, ll en, ll node) {
  if (st == en) {
    return seg[node] = nums[st];
  } else {
    ll mid = (st + en) / 2;
    return seg[node] =
               min(fill(st, mid, node * 2), fill(mid + 1, en, node * 2 + 1));
  }
}

ll find(cll from, cll to, ll st, ll en, ll node) {
  if (from <= st && en <= to) {
    return seg[node];
  } else if (en < from || to < st) {
    return INF;
  } else {
    ll mid = (st + en) / 2;
    return min(find(from, to, st, mid, node * 2),
               find(from, to, mid + 1, en, node * 2 + 1));
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll i = 0; i < n; ++i) {
    cin >> nums[i];
  }

  fill(0, n - 1, 1);

  for (ll a, b, query = 0; query < m; ++query) {
    cin >> a >> b;
    --a, --b;
    cout << find(a, b, 0, n - 1, 1) << "\n";
  }

  return 0;
}
```