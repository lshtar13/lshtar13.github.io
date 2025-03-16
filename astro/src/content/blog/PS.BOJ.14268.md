---
title: '14268 BOJ'
description: '회사 문화2'
pubDate: 'Mar 16 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Euler Tour Technique", "ETT", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/14268)

## 접근

오일러 경로 테크닉과 세그먼트 트리를 이용해 해결하였다.

오일러 경로 테크닉(ETT)을 알게 해준 문제이다.
자신의 상사의 점수를 모두 더해야 하는데, 세그먼트 트리를 적용하기에는 그래프라
상사들이 연속적으로 분포하지 않아 힘들다.
혹은, 상사의 점수가 오를 때마다 부하들을 일일이 찾아가 반영해줘야 하는데 시간초과나기 십상이다.

ETT를 이용하면 비연속적인 그래프를 연속적인 배열로 변환할 수 있다.
Post-order 혹은 pre-order로 순회한 결과를 배열하면,
부모 노드 입장에선 자식 노드들이 자기로부터 연속적으로 배치되어 있을 것이다.
이러한 상태에서, 세그먼트 트리를 사용해 상사의 점수 증가를 기록하면 빠르게 부하들의 점수를 계산할 수 있다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e5, M = 1e5;
ll n, m, parents[N] = {}, numbering[N] = {}, nchild[N] = {}, segs[N * 15] = {};
vll childs[N];

void add(ll node, ll st, ll en, cll idx0, cll idx1, cll weight) {
  if (st > idx1 || en < idx0) {
    return;
  } else if (idx0 <= st && idx1 >= en) {
    segs[node] += weight;
    return;
  }

  ll mid = (st + en) / 2;
  add(node * 2, st, mid, idx0, idx1, weight);
  add(node * 2 + 1, mid + 1, en, idx0, idx1, weight);
}

ll find(ll node, ll st, ll en, cll idx) {
  if (st == en) {
    return segs[node];
  }

  ll mid = (st + en) / 2;
  if (idx <= mid) {
    return segs[node] + find(node * 2, st, mid, idx);
  } else {
    return segs[node] + find(node * 2 + 1, mid + 1, en, idx);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll i = 0; i < n; ++i) {
    cin >> parents[i];
    if (parents[i] != -1) {
      childs[--parents[i]].emplace_back(i);
    }
  }

  stack<ll> search, result;
  search.push(0);
  while (!search.empty()) {
    ll tgt = search.top();
    search.pop();

    result.push(tgt);
    for (auto child : childs[tgt]) {
      search.push(child);
    }
  }

  for (ll e, i = 0; i < n; ++i) {
    e = result.top();
    result.pop();

    numbering[e] = i;
    nchild[parents[e]] += nchild[e] + 1;
  }

  for (ll q = 0, c, i, w, idx; q < m; ++q) {
    cin >> c >> i;

    idx = numbering[--i];
    if (c == 1) {
      cin >> w;
      add(1, 0, n - 1, idx - nchild[i], idx, w);
    } else {
      cout << find(1, 0, n - 1, idx) << "\n";
    }
  }

  return 0;
}
```