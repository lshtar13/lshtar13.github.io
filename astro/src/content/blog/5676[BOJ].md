---
title: '5676 BOJ'
description: '음주 코딩'
pubDate: 'Jan 07 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree", "EOF"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/5676)

## 접근

세그먼트 트리로 해결하였다.

구간 곱을 저장하는 세그먼트 트리와 동일하게 해결하였다.
solved.ac에 보니 곱하기를 굳이 하지 않고도 해결할 수 있다고 하는데,
구간 내 음수와 0의 여부만 계산하면 되기 때문에 일리 있는 말이다.
그러나, 곱하기를 직접하는 것이 조금 더 깔끔한 풀이인 것 같다.
물론, 실제로 곱하게 되면 값이 long long의 범위를 아득히 뛰어 넘어버리기 때문에
해당 수가 양수면 1, 음수면 -1, 0이면 그대로 변환하여 계산해야 한다.

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

cll N = 1e5, K = 1e5;
ll nums[N] = {}, seg[N * 10] = {};

ll update(ll st, ll en, ll node, ll idx, ll num) {
  if (idx < st || en < idx) {
    return seg[node];
  } else if (st == en) {
    return seg[node] = num ? num / abs(num) : 0;
  }

  ll mid = (st + en) / 2, left = update(st, mid, node * 2, idx, num),
     right = update(mid + 1, en, node * 2 + 1, idx, num);

  return seg[node] = left * right;
}

ll query(ll st, ll en, ll node, ll tgt0, ll tgt1) {
  if (tgt0 <= st && en <= tgt1) {
    return seg[node];
  } else if (en < tgt0 || tgt1 < st) {
    return 1;
  }

  ll mid = (st + en) / 2, left = query(st, mid, node * 2, tgt0, tgt1),
     right = query(mid + 1, en, node * 2 + 1, tgt0, tgt1);

  return left * right;
}

void solve(ll n, ll k) {
  for (ll i = 0; i < n; ++i) {
    cin >> nums[i];
    update(0, n - 1, 1, i, nums[i]);
  }

  char cmd, result;
  for (ll a, b, p, q = 0; q < k; ++q) {
    cin >> cmd >> a >> b;
    switch (cmd) {
    case 'C':
      update(0, n - 1, 1, --a, b);
      break;
    case 'P':
      p = query(0, n - 1, 1, --a, --b);
      if (p > 0) {
        cout << "+";
      } else if (p < 0) {
        cout << "-";
      } else {
        cout << "0";
      }
      break;
    }
  }
  cout << "\n";
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll n, k;
  while (cin >> n >> k) {
    solve(n, k);
  }

  return 0;
}
```