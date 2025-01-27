---
title: '1185 BOJ'
description: '유럽여행'
pubDate: 'Jan 27 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Minimum Spanning Tree", "MST"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1185)

## 접근

MST를 이용해 해결하였다.

N-1개의 길만 남긴다는 점에서 MST를 구해야 한다고 생각을 했다.
하지만, '방문 후 복귀'하는 비용의 최소를 구해야 하므로 주어진 가중치를 그대로 사용해선 안되었다.
프림 알고리즘을 이용하였는데, 간선을 우선순위 큐에 저장해 줄 때 간선의 가중치를 변형하였다.
모든 노드들은 한번 방문하고 다시 부모 노드로 복귀해야 한다.
따라서 기존 가중치의 두배에 노드 방문 비용과 부모 노드 방문 비용을 더한 값을 새로운 가중치로 설정하였다.

시작 지점은 방문 비용이 가장 작은 노드로 설정하였다.
총 비용은 시작지점 방문비용과 MST의 간선 비용의 합이 될텐데, MST의 간선 비용의 합은 어떤 시작지점이든 같은 최소값이기에
시작지점의 방문 비용만 신경쓰면 된다. 따라서 방문 비용이 가장 작은 노드를 시작지점으로 설정하였다.

## 코드

```c++
#include <algorithm>
#include <bits/stdc++.h>
#include <climits>
#include <tuple>
#include <utility>

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

cll N = 1e4, P = 1e5;
ll n, p, taxs[N] = {};
vpll edges[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> p;
  for (ll i = 0; i < n; ++i) {
    cin >> taxs[i];
  }
  for (ll s, e, l, i = 0; i < p; ++i) {
    cin >> s >> e >> l;
    --s, --e;
    edges[s].emplace_back(make_pair(e, l));
    edges[e].emplace_back(make_pair(s, l));
  }

  ll st = min_element(taxs, taxs + n) - taxs, cost = taxs[st];
  bool included[N] = {};
  included[st] = true;
  priority_queue<pll, vector<pll>, greater<pll>> pq;
  for (auto &p : edges[st]) {
    pq.push(make_pair(taxs[p.first] + taxs[st] + p.second * 2, p.first));
  }

  for (ll added, to; !pq.empty();) {
    tie(added, to) = pq.top();
    pq.pop();

    if (included[to]) {
      continue;
    }

    cost += added;
    included[to] = true;
    for (auto &p : edges[to]) {
      if (!included[p.first]) {
        pq.push(make_pair(taxs[p.first] + taxs[to] + p.second * 2, p.first));
      }
    }
  }

  cout << cost << "\n";

  return 0;
}
```