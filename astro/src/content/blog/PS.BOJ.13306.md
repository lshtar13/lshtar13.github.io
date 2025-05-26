---
title: '13306 BOJ'
description: '트리'
pubDate: 'May 26 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Union-Find", "Offline Query"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/13306)

## 접근

오프라인 쿼리를 이용한 유니온 파인드로 해결하였다.

입력되는 쿼리들을 거꾸로 수행한다.
질의가 들어올 시점에 두 노드간에 경로가 있는지는 유니온 파인드를 이용해 판단한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef tuple<ll, ll, ll> info_t;

cll N = 2e5, Q = 2e5;
ll n, q, childs[N + 1] = {}, parents[N + 1] = {}, dijs[N + 1] = {};

ll findParent(ll node) {
  if (node == dijs[node]) {
    return node;
  }

  return dijs[node] = findParent(dijs[node]);
}

void merge(ll node0, ll node1) {
  ll parent0 = findParent(node0), parent1 = findParent(node1);
  dijs[parent0] = parent1;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> q;
  parents[1] = 1;
  for (ll i = 2; i <= n; ++i) {
    cin >> parents[i];
    dijs[i] = i;
  }

  stack<info_t> queries;
  for (ll i = 0, x, a, b; i < n - 1 + q; ++i) {
    cin >> x >> a;
    if (x == 1) {
      cin >> b;
    } else {
      b = 0;
    }

    queries.push({x, a, b});
  }

  stack<string> answers;
  for (ll x, a, b; !queries.empty();) {
    tie(x, a, b) = queries.top();
    queries.pop();

    if (x == 0) {
      ll node0 = a, node1 = parents[node0];
      merge(node0, node1);
    } else {
      ll parent0 = findParent(a), parent1 = findParent(b);
      if (parent0 == parent1) {
        answers.push("YES\n");
      } else {
        answers.push("NO\n");
      }
    }
  }

  while (!answers.empty()) {
    cout << answers.top();
    answers.pop();
  }

  return 0;
}
```