---
title: '17412 BOJ'
description: '도시 왕복하기 1'
pubDate: 'May 21 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Network Flow", "Edmond-Karp"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/17412)

## 접근

최대 유량 알고리즘으로 해결하였다.

어떤 경로에서 사용한 길을 다른 경로에서 재사용할 수 없다는 조건에서 최대 유량 알고리즘을 떠올렸다.
길들은 모두 용량이 1인 유량 그래프의 간선이다.
이러한 간선들로 구성된 그래프에서의 최대 유량을 구하면 된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef queue<ll> qll;
typedef vector<ll> vll;

cll N = 400, P = 1e4, SRC = 0, SNK = 1, INF = 1e5;
ll n, p, cap[N][N] = {{}}, flow[N][N] = {{}};
vll edges[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> p;
  for (ll i = 0, from, to; i < p; ++i) {
    cin >> from >> to;
    --from, --to;
    edges[from].emplace_back(to);
    edges[to].emplace_back(from);
    ++cap[from][to];
  }

  ll result = 0;
  while (true) {
    vll parents(n, -1);
    parents[SRC] = SRC;

    qll q;
    q.push(SRC);
    while (!q.empty()) {
      ll node = q.front();
      q.pop();

      for (auto &av : edges[node]) {
        if (parents[av] == -1 && cap[node][av] - flow[node][av] > 0) {
          parents[av] = node;
          q.push(av);
        }
      }
    }

    if (parents[SNK] == -1) {
      break;
    }

    ll cost = INF;
    for (ll node = SNK, parent; node != SRC; node = parent) {
      parent = parents[node];
      cost = min(cost, cap[parent][node] - flow[parent][node]);
    }
    result += cost;

    for (ll node = SNK, parent; node != SRC; node = parent) {
      parent = parents[node];
      flow[parent][node] += cost;
      flow[node][parent] -= cost;
    }
  }

  cout << result << "\n";

  return 0;
}
```