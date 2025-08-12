---
title: '16404 BOJ'
description: '주식회사 승범이네'
pubDate: 'Aug 12 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree", "Euler Tour Technique", "ETT"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/16404)

## 접근

세그먼트 트리와 오일러 경로 테크닉을 이용해 해결하였다.
일반적인 세그먼트 트리와 느리게 갱신되는 세그먼트 트리는 서로 반대되는 상황에서 사용된다고 생각하면 쉽다는 것을 알게 되었다.
전자는 특정 노드에 대한 업데이트와 구간에 대한 쿼리를 처리하는 데 사용되고,
후자는 구간에 대한 업데이트와 특정 노드에 대한 쿼리를 처리하는 데 사용된다는 점이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)

cll N = 1e5, M = 1e5;
ll n, m, nchilds[N] = {}, idxs[N] = {}, segs[N * 10] = {};
vll childs[N];

ll dfs(ll node) {
  static ll idx = -1;
  idxs[node] = ++idx;
  for (auto &child : childs[node]) {
    if (idxs[child] != -1) {
      continue;
    }

    nchilds[idxs[node]] += dfs(child) + 1;
  }

  return nchilds[idxs[node]];
}

void update(ll node, ll st, ll en, ll left, ll right, ll amnt) {
  if (right < st || left > en) {
    return;
  } else if (left <= st && right >= en) {
    segs[node] += amnt;
    return;
  }

  ll mid = (st + en) / 2;
  update(node * 2, st, mid, left, right, amnt);
  update(node * 2 + 1, mid + 1, en, left, right, amnt);
}

ll query(ll node, ll st, ll en, ll idx) {
  if (st == en) {
    return segs[node];
  }

  ll mid = (st + en) / 2;
  if (idx <= mid) {
    return segs[node] + query(node * 2, st, mid, idx);
  } else {
    return segs[node] + query(node * 2 + 1, mid + 1, en, idx);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  FOR(seller, 0, n) {
    ll parent;
    cin >> parent;
    if (parent > 0) {
      childs[--parent].emplace_back(seller);
    }
  }

  memset(idxs, -1, sizeof(idxs));
  dfs(0);

  FOR(cmd, 0, m) {
    ll q, i, w, idx;
    cin >> q >> i;
    idx = idxs[--i];
    if (q == 1) {
      cin >> w;
      update(1, 0, n - 1, idx, idx + nchilds[idx], w);
    } else {
      cout << query(1, 0, n - 1, idx) << "\n";
    }
  }

  return 0;
}
```