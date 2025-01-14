---
title: '14438 BOJ'
description: '수열과 쿼리 17'
pubDate: 'Dec 09 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/14438)

## 접근

세그먼트 트리를 이용해 해결하였다.

최솟값을 찾는 세그먼트 트리를 활용해 해결하였다.

## 코드

```c++
#include <bits/stdc++.h>
#include <climits>

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

cll N = 1e5, INF = 1e9 + 1;
ll n, A[N] = {}, m, seg[10 * N] = {};

ll fill(ll s, ll e, ll node) {
  if (s == e) {
    return seg[node] = A[s];
  }

  ll mid = (s + e) / 2;
  return seg[node] =
             min(fill(s, mid, node * 2), fill(mid + 1, e, node * 2 + 1));
}

ll update(const ll i, ll s, ll e, ll node) {
  if (s == e) {
    return seg[node] = A[i];
  }

  ll mid = (s + e) / 2;
  if (i <= mid) {
    return seg[node] = min(seg[node * 2 + 1], update(i, s, mid, node * 2));
  } else {
    return seg[node] = min(seg[node * 2], update(i, mid + 1, e, node * 2 + 1));
  }
}

ll find(const ll i, const ll j, ll s, ll e, ll node) {
  if (i <= s && e <= j) {
    return seg[node];
  } else if (j < s || e < i) {
    return INF;
  }

  ll mid = (s + e) / 2;
  return min(find(i, j, s, mid, node * 2),
             find(i, j, mid + 1, e, node * 2 + 1));
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> A[i];
  }

  fill(0, n - 1, 1);
  
  cin >> m;
  for (ll q, i, j, l = 0; l < m; ++l) {
    cin >> q >> i >> j;
    --i;
    if (q == 1) {
      A[i] = j;
      update(i, 0, n - 1, 1);
    } else {
      --j;
      cout << find(i, j, 0, n - 1, 1) << "\n";
    }
  }

  return 0;
}
```