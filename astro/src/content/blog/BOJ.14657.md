---
title: '14657 BOJ'
description: '준오는 최종인재야!'
pubDate: 'Nov 21 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Diameter of Tree",
 "Depth-First Search", "DFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/14657)

## 접근

트리에서의 DFS를 이용해 해결하였다.

모든 경우의 수를 탐색하여, 가장 긴 경로들을 찾고 그 중 가중치의 합이 가장 작은 경우를 
골랐다. 시간 복잡도를 낮추기 위하여, 중복된 탐색을 막기 위해 map 자료구조를 사용하였다.

결과적으로는 문제를 해결하였지만, 문제를 맞힌 198명 중 가장 저조한 퍼포먼스로 통과하였다.
찾아보니, 트리의 지름으로 풀면 훨씬 나은 퍼포먼스로 풀 수 있었다.
전에도 트리의 지름 무제를 몇번 풀어보았지만, 해당 문제가 트리의 지름을 이용해서 푸는 지 
알아보는 것이 힘들었다. 이번 문제는 아예 놓쳤다. 조금 더 많이 풀어보고 노력해야 겠다.

# 코드

```cpp
#include <bits/stdc++.h>
#include <climits>

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

cll N = 5e4, T = 1e5, INF = 1e10;
ll n, t;
vvpll edges(N + 1);
map<ll, pll> m;

pll find(ll prev, ll node) {
  ll idx = prev * (N + 1) + node;
  if (m.find(idx) != m.end()) {
    return m[idx];
  }

  ll nproblem = 0, weights = INF;
  for (auto &p : edges[node]) {
    if (prev == p.first) {
      continue;
    }

    pll result = find(node, p.first);
    if (result.first > nproblem) {
      nproblem = result.first, weights = result.second + p.second;
    } else if (result.first == nproblem) {
      weights = min(weights, result.second + p.second);
    }
  }

  weights = weights == INF ? 0 : weights;
  return m[idx] = make_pair(nproblem + 1, weights);
}

int main(void) {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

  cin >> n >> t;
  for (ll a, b, c, i = 0; i < n - 1; ++i) {
    cin >> a >> b >> c;
    edges[a].emplace_back(make_pair(b, c));
    edges[b].emplace_back(make_pair(a, c));
  }

  pll result(0, INF);
  for (ll i = 1; i <= n; ++i) {
    // cout << i << "\n";
    pll p = find(0, i);
    if (p.first > result.first) {
      result = p;
    } else if (p.first == result.first && p.second < result.second) {
      result = p;
    }
  }

  cout << result.second / t + bool(result.second % t) << "\n";

  return 0;
}
```