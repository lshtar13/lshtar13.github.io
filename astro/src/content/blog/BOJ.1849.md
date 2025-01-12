---
title: '1849 BOJ'
description: '순열'
pubDate: 'Jan 05 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree", "Binary Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1849)

## 접근

세그먼트 트리와 이분 탐색(lower_bound)를 통해 해결하였다.

1부터 n까지 순서대로 각 숫자가 들어갈 자리를 탐색하였다.
세그먼트 트리에 현재까지 채워진 숫자들의 자리를 기록하여 활용하였다.
만약 3에 대하여 앞에 4개의 3보다 큰 수가 위치해야 한다고 하면,
세그먼트 트리에서 아직 채워지지 않은 자리를 세어 합이 4개가 되는 구간을 구하여 3이 위치할 자리를 찾는다.
따라서 초기 세그먼트 트리는 모두 1로 채워진 배열을 상정하여 만들어진다.
이후에 채워진 자리에 대하여 1에서 0으로 바꾸는 update작업을 진행한다.
세그먼트 트리를 통해 찾은 자리가 이미 채워진 자리일 수 있다.
이러한 경우를 대비해 채워지지 않은 자리를 관리하는 별도의 set을 두어, 세그먼트 트리를 통해 찾은 자리 보다 크거나 같은
자리 중 비어있는 가장 작은 자리를 찾도록 한다.

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

cll N = 1e5;
set<ll> rest;
ll n, seq[N] = {}, seg[10 * N] = {};

void modify(ll st, ll en, ll node, ll tgt, ll amount) {
  if (tgt < st || en < tgt) {
    return;
  }

  seg[node] += amount;
  if (st != en) {
    ll mid = (st + en) / 2;
    modify(st, mid, 2 * node, tgt, amount);
    modify(mid + 1, en, 2 * node + 1, tgt, amount);
  }
}

ll query(ll st, ll en, ll node, ll tgt) {
  ll mid = (st + en) / 2;
  ll cur = seg[node], left = seg[2 * node], right = seg[2 * node + 1];

  if (cur == tgt) {
    return en;
  } else if (left < tgt) {
    return query(mid + 1, en, 2 * node + 1, tgt - left);
  } else {
    return query(st, mid, 2 * node, tgt);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 1; i <= n; ++i) {
    modify(0, n, 1, i, 1);
    rest.insert(i - 1);
  }
  for (ll num, idx, _idx, i = 1; i <= n; ++i) {
    cin >> num;
    _idx = query(0, n, 1, num);
    idx = *rest.lower_bound(_idx);
    rest.erase(idx);
    seq[idx] = i;
    modify(0, n, 1, idx + 1, -1);
  }

  for (ll i = 0; i < n; ++i) {
    cout << seq[i] << "\n";
  }

  return 0;
}
```