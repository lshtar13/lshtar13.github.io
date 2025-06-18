---
title: '2465 BOJ'
description: '줄 세우기'
pubDate: 'Jun 18 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2465)

## 접근

세그먼트 트리로 해결하였다.

수열의 맨 뒤에서부터 알맞은 사람의 키를 찾는다.
트리에는 현재 배치되지 않은 사람의 키 분포를 기록한다.
배치된 사람의 키는 0으로 만들어 추후 계산에 포함되지 않도록 한다.
세그먼트 트리를 사용하여 아직 배치되지 않은 사람들 중 n번째 키를 가진 사람을 빠르게 찾을 수 있다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 1e5, Height = 2e9;
ll n, heights[N] = {}, seq[N] = {}, segs[N * 10] = {}, pos[N] = {};

void update(ll node, ll st, ll en, ll idx, ll amnt) {
  if (idx < st || idx > en) {
    return;
  }
  segs[node] += amnt;

  if (st == en) {
    return;
  }

  ll mid = (st + en) / 2;
  if (idx <= mid) {
    update(node * 2, st, mid, idx, amnt);
  } else {
    update(node * 2 + 1, mid + 1, en, idx, amnt);
  }
}

ll query(ll node, ll st, ll en, ll amnt) {
  if (st == en) {
    return st;
  }

  ll mid = (st + en) / 2;
  if (segs[node * 2] >= amnt) {
    return query(node * 2, st, mid, amnt);
  } else {
    return query(node * 2 + 1, mid + 1, en, amnt - segs[node * 2]);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  FOR(i, n) { cin >> heights[i]; }
  FOR(i, n) { cin >> seq[i]; }
  FOR(i, n) { update(1, 0, n - 1, i, 1); }
  sort(heights, heights + n);

  for (ll i = n - 1, nsmaller, idx; i >= 0; --i) {
    idx = query(1, 0, n - 1, seq[i] + 1);
    update(1, 0, n - 1, idx, -1);
    pos[i] = heights[idx];
  }

  FOR(i, n) { cout << pos[i] << "\n"; }

  return 0;
}
```