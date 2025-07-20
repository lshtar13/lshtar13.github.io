---
title: '11266 BOJ'
description: '단절점'
pubDate: 'Jul 20 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Articulation", "Depth-First Search", "DFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/11266)

## 접근

타잔 알고리즘으로 단절점을 찾아 내었다.
타잔 알고리즘으로 SCC를 찾는 것과 비슷하게,
DFS 트리 내에서 부모를 거치지 않고 이전 경로에 위치한 노드를 찾아 갈 수 있는지 여부를 조사하여야 한다.
찾아갈 수 있다면 해당 노드의 부모 노드는 단절점이 되지 않는다.
위 조건을 파악하여 구현하는 것은 오래 걸리지 않았다.
그러나, root에 대한 조건을 구성하는 데 어려움을 겪어 다른 사람의 해설을 참고 하여 아래 코드를 완성하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)

cll V = 1e4, E = 1e5;
ll v, e, parents[V] = {}, orders[V] = {}, oidx = 0, root;
vll edges[V], results;
bool isCut[V] = {};

ll check(ll node) {
  ll order = orders[node] = oidx++, nchild = 0;
  for (auto &av : edges[node]) {
    if (orders[av] == -1) {
      ++nchild;
      ll corder = check(av);
      order = min(order, corder);
      if (node != root && corder >= orders[node]) {
        isCut[node] = true;
      }
    } else {
      order = min(order, orders[av]);
    }
  }

  if (root == node && nchild > 1) {
    isCut[node] = true;
  }

  return order;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> v >> e;
  FOR(i, 0, e) {
    ll a, b;
    cin >> a >> b;
    --a, --b;
    edges[a].emplace_back(b);
    edges[b].emplace_back(a);
  }

  memset(orders, -1, sizeof(orders));
  FOR(node, 0, v) {
    if (orders[node] == -1) {
      root = node;
      check(node);
    }
  }

  vll result;
  FOR(node, 0, v) {
    if (isCut[node]) {
      result.emplace_back(node + 1);
    }
  }

  cout << result.size() << "\n";
  for (auto &mem : result) {
    cout << mem << " ";
  }
  cout << "\n";

  return 0;
}
```