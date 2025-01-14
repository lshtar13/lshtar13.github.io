---
title: '11812 BOJ'
description: 'K진 트리'
pubDate: 'Jan 13 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS","LCA", "Lowest Common Ancestor"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/11812)

## 접근

최소 공통 조상을 이용해 해결하였다.

주어진 숫자에 대하여 깊이와 너비를 파악하고, 이진탐색을 통해 공통 조상을 찾아나갔다.
K가 1인 경우, 깊이를 파악하는데 O(n)의 시간이 걸리기 때문에 예외처리가 필요하다.

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

cll N = 1e15, K = 1e3, Q = 1e5;
ll n, k, q;
map<pll, ll> answers;

pll findDepth(ll x) {
  ll d = 0;
  if (k == 1) {
    return {x - 1, 0};
  }
  for (ll _d = 1; x > _d; _d *= k) {
    x -= _d, ++d;
  }

  return {d, --x};
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> k >> q;
  for (ll x, y, i = 0; i < q; ++i) {
    cin >> x >> y;
    pll infoX = findDepth(x), infoY = findDepth(y);
    ll depthX = infoX.first, depthY = infoY.first,
       minDepth = min(depthX, depthY);
    ll widthX = infoX.second, widthY = infoY.second;
    ll st = 0, en = minDepth, ans;
    while (st <= en) {
      ll mid = (st + en) / 2, _widthX, _widthY;

      _widthX = widthX / pow(k, depthX - mid);
      _widthY = widthY / pow(k, depthY - mid);

      if (_widthX == _widthY) {
        ans = depthX - mid + depthY - mid;
        st = mid + 1;
      } else {
        en = mid - 1;
      }
    }

    cout << ans << "\n";
  }

  return 0;
}
```