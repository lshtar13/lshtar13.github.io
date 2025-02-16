---
title: '2463 BOJ'
description: '비용'
pubDate: 'Feb 16 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Disjoint Set", "Offline Queries"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2463)

## 접근

분리 집합과 오프라인 쿼리를 이용해 해결하였다.

거꾸로 간선들이 전부 제거된 상태에서 탐색을 시작한다.
간선들을 가중치 기준 내림 차순으로 추가해가며, 해당 간선을 추가함으로써 서로 연결되는 노드 쌍의 개수를 구한다.
이미 추가된 간선들을 제외한 나머지 간선들의 가중치 합을 서로 연결되는 노드 쌍의 수와 곱하여 결과값에 더한다.
서로 연결되는 노드 쌍의 개수를 알기위해 원소의 개수를 추적할 수 있는 분리집합을 사용한다.

## 코드

```c++
#include <bits/stdc++.h>
#include <queue>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef tuple<ll, ll, ll> info_t;

cll N = 1e5, M = 1e5, MOD = 1e9;
ll n, m, parents[N] = {}, nMember[N] = {}, sum = 0, x, y, w;

ll findParent(ll node) {
  if (parents[node] == node) {
    return node;
  } else {
    parents[node] = findParent(parents[node]);
    nMember[node] = nMember[parents[node]];
    return parents[node];
  }
}

void merge(ll a, ll b) {
  a = findParent(a), b = findParent(b);
  nMember[a] += nMember[b];
  parents[b] = a;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll i = 0; i < n; ++i) {
    parents[i] = i, nMember[i] = 1;
  }

  priority_queue<info_t> pq;
  for (ll i = 0; i < m; ++i) {
    cin >> x >> y >> w;
    pq.push({w, --x, --y});
    sum += w;
  }

  ll result = 0;
  while (!pq.empty()) {
    tie(w, x, y) = pq.top();
    pq.pop();

    x = findParent(x), y = findParent(y);
    if (x != y) {
      result += sum * (nMember[x] * nMember[y]);
      result %= MOD;
      merge(x, y);
    }

    sum -= w;
  }

  cout << result << "\n";

  return 0;
}
```