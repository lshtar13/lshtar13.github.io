---
title: '14621 BOJ'
description: '나만 안되는 연애'
pubDate: 'Nov 20 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Minimum Spanning Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/14621)

## 접근

MST의 [크루스칼 알고리즘](https://chanhuiseok.github.io/posts/algo-33/)을 이용해 해결하였다.

대학교의 종류를 배열에 저장하고, 매번 edge를 뽑을 때 싸이클을 형성하는지 여부와 함께
해당 edge가 연결하는 두 대학교의 종류가 다른지 또한 확인하게끔 하였다.
만약 선택된 edge의 개수가 n-1이 아니면 -1을 출력한다.

MST의 활용문제로써 크게 어려운 점이 없었다.

# 코드

```cpp
#include <bits/stdc++.h>
#include <functional>
#include <queue>
#include <tuple>

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

typedef tuple<ll, ll, ll> info_t;

cll N = 1000, M = 10000;
ll n, m, parent[N] = {};
bool isMale[N] = {};
priority_queue<info_t, vector<info_t>, greater<info_t>> pq;

ll find(ll node) {
  return parent[node] = parent[node] == node ? node : find(parent[node]);
}

void merge(ll u, ll v) { parent[find(u)] = find(v); }

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;

  for (ll i = 0; i < n; ++i) {
    cin.ignore(1);
    char c;
    cin >> c;
    isMale[i + 1] = c == 'M';
    parent[i + 1] = i + 1;
  }

  for (ll u, v, d, i = 0; i < m; ++i) {
    cin >> u >> v >> d;
    pq.push(make_tuple(d, u, v));
  }

  ll result = 0, resultN = 0;
  while (!pq.empty()) {
    ll u, v, d;
    tie(d, u, v) = pq.top();
    pq.pop();

    if (!(isMale[u] ^ isMale[v]) || find(u) == find(v)) {
      continue;
    }

    merge(u, v);
    result += d, ++resultN;
  }

  cout << (resultN == n - 1 ? result : -1) << "\n";

  return 0;
}
```