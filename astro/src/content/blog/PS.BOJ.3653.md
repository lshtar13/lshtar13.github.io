---
title: '3653 BOJ'
description: '영화 수집'
pubDate: 'Feb 08 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3653)

## 접근

세그먼트 트리를 이용해 해결하였다.

세그먼트 트리를 이용해야 한다는 점은 빠르게 파악했지만, 트리 구성을 어떻게 해야 할지 많이 헤메었다.
결국 다른 사람들의 의견을 참고해서 배열의 범위를 1 ~ n+m으로 구성함으로써 해결하였다.

초기 DVD 배열은 m+1~m+n에 저장한다. 이후, DVD의 위치가 변할 때 마다 1~m으로 옮긴다.
이와 같은 방식으로, DVD간의 위치 교화이 일어나지 않아도 DVD의 최신 위치를 파악할 수 있게 된다.
이 과정에서 각 자리의 DVD 위치 여부를 저장하는
세그먼트 트리를 관리하며 자신보다 앞 인덱스에 DVD가 몇개 위치해 했는지 구한다.

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
cll N = 1e5, M = 1e5;
ll pos[N + 1] = {}, seg[18 * N] = {};

ll update(ll node, ll left, ll right, cll idx, cll num) {
  if (idx < left || idx > right) {
    return seg[node];
  } else if (left == right) {
    return seg[node] = num;
  }

  ll mid = (left + right) / 2;
  return seg[node] = update(node * 2, left, mid, idx, num) +
                     update(node * 2 + 1, mid + 1, right, idx, num);
}

ll sum(ll node, ll left, ll right, cll st, cll en) {
  if (en < left || st > right) {
    return 0;
  } else if (st <= left && en >= right) {
    return seg[node];
  }

  ll mid = (left + right) / 2;
  return sum(node * 2, left, mid, st, en) +
         sum(node * 2 + 1, mid + 1, right, st, en);
}

void solve(void) {
  ll n, m, next, movie;
  cin >> n >> m;
  memset(seg, 0, sizeof(seg));

  for (ll i = 1; i <= n; ++i) {
    update(1, 1, n + m, pos[i] = i + m, 1);
  }

  next = m;
  for (ll q = 0; q < m; ++q) {
    cin >> movie;
    cout << sum(1, 1, n + m, 1, pos[movie] - 1) << " ";
    update(1, 1, n + m, pos[movie], 0);
    update(1, 1, n + m, pos[movie] = next--, 1);
  }

  cout << "\n";
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    solve();
  }

  return 0;
}
```