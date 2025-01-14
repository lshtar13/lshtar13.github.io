---
title: '16118 BOJ'
description: '달빛 여우'
pubDate: 'Dec 22 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dijkstra"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/16118)

## 접근

다익스트라 알고리즘을 이용해 해결하였다.

똑같은 목적지를 가더라도, 방문 순서에 따라 간선의 가중치가 달라지기 때문에
조금 다르게 다익스트라 알고리즘을 적용해야 했다.
달리기를 통해 도착했을 때의 비용과 걷기를 통해 도착했을 때의 비용을 구분해서 기록하였다.

몇가지 실수가 있었다. 스스로 알아채지 못해 블로그들을 보고 알았다.
시작점 노드의 비용을 0으로 고정하면 안되는데, 이는 시작점을 다시 거쳐 도착하는 최적을 경로가
존재할 수 있기 때문이다.
경로의 가중치를 저장할 때 2를 곱해서 저장해야 하는데, 이는 2로 나누기 연산이 수행되기 때문이다.

## 코드

```c++
#include <bits/stdc++.h>
#include <climits>
#include <iostream>

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

typedef pair<double, ll> info;

cll N = 4000, M = 1e5, INF = LLONG_MAX;
ll n, m;
vll dist0(N, INF);
vvll dist1(2, vll(N, INF));
vpll edges[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;

  ll a, b, d;
  while (m--) {
    cin >> a >> b >> d;
    --a, --b, d *= 2;
    edges[a].emplace_back(make_pair(b, d));
    edges[b].emplace_back(make_pair(a, d));
  }

  pqpll pq;
  pq.push(make_pair(0, 0));
  dist0[0] = 0;
  while (!pq.empty()) {
    ll dist = -pq.top().first, node = pq.top().second;
    pq.pop();

    if (dist0[node] < dist) {
      continue;
    }

    for (auto &p : edges[node]) {
      ll av = p.first, d = p.second;
      if (dist0[av] > d + dist) {
        dist0[av] = d + dist;
        pq.push(make_pair(-(d + dist), av));
      }
    }
  }

  pq.push(make_pair(0, 1));
  while (!pq.empty()) {
    ll dist = -pq.top().first, node = pq.top().second / 2,
       state = pq.top().second % 2;
    pq.pop();

    if (dist1[!state][node] < dist) {
      continue;
    }

    for (auto &p : edges[node]) {
      ll av = p.first, d = p.second;
      d = state ? d / 2 : d * 2;
      if (dist1[state][av] > d + dist) {
        dist1[state][av] = d + dist;
        pq.push(make_pair(-(d + dist), av * 2 + !state));
      }
    }
  }

  ll result = 0;
  for (ll i = 1; i < n; ++i) {
    result += dist0[i] < min(dist1[0][i], dist1[1][i]);
    // cout << dist0[i] << " " << min(dist1[0][i], dist1[1][i]) << "\n";
  }
  cout << result << "\n";

  return 0;
}
```