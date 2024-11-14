---
title: '12912 BOJ'
description: '트리 수정'
pubDate: 'Nov 14 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Diameter of Tree", "Brute Force", "Breadth-First Algorithm", "BFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/12912)

N개의 정점으로 이루어진 트리 T가 있다. 트리의 각 정점은 0번부터 N-1번까지 번호가 매겨져 있다.

* 트리에서 임의의 두 정점을 연결하는 단순 경로의 개수는 1개이다.
* 두 정점사이의 거리는 두 정점을 연결하는 단순 경로상에 있는 간선의 가중치의 합이다.
* 트리의 지름은 트리에 존재하는 모든 경로 중에서 가장 긴 것이다.

홍준이는 T에서 간선을 하나 제거하고, 간선을 하나 추가하려고 한다. 이때, 추가하는 간선의 가중치는 제거한 간선의 가중치와 같아야 하며, 간선을 추가한 이후에도 트리를 유지해야 한다.

이때, 홍준이가 만들 수 있는 트리 중에서 지름이 가장 큰 것을 구하는 프로그램을 작성하시오.

# 접근

트리의 지름구하는 알고리즘을 활용해 해결하였다.

간선을 삭제하고 다시 이어붙임으로써 최대 지름을 얻는다는 것은, 두 트리를 합친다는 것과 같은 말이다.
트리를 합칠 때, 지름과 지름이 맞닿게 구성하면 이어주는 간선의 가중치와 두 트리의 지름을 합한 값이
새로운 트리의 지름이 된다. 트리는 노드들 간의 경로가 유일하기 때문에 그렇다. 이 때문에 최대 경로,
즉 지름이 맞닿게 구성이 되었을 때, 각 트리의 지름을 이루는 말단 노드들 간에 연결이 되려면 각각의
최대경로를 무조건 이용해야 한다.

따라서 모든 간선에 대하여, 해당 간선을 배제하였을 때 생기는 두 트리의 지름의 합과 해당 간선의 가중치를
더한 값이 수정된 트리의 최대 지름이 된다의

# 입력

첫째 줄에 트리 정점의 개수 N이 주어진다. (2 ≤ N ≤ 2,000)

둘째 줄부터 N-1개의 줄에는 트리를 이루는 간선이 주어진다. 간선은 from, to, cost와 같이 세 가지 정수로 이루어져 있으며, from과 to를 연결하는 간선의 가중치가 cost라는 뜻이다. (1 ≤ cost ≤ 1,000,000,000)

# 출력

첫째 줄에 홍준이가 만들 수 있는 트리 중에서 가장 지름이 큰 것의 지름을 출력한다.

# 코드

```cpp
#include <bits/stdc++.h>

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

cll N = 2000;
ll n;
vector<pair<pll, ll>> edges;
vvpll mat(N);

pll search(ll start, ll from, ll to) {
  ll tgt = start, tgtDist = 0;
  vll dist(n, -1);
  qll q;
  q.push(start);
  dist[start] = 0;
  while (!q.empty()) {
    ll node = q.front();
    q.pop();
    for (auto &p : mat[node]) {
      if (min(from, to) == min(p.first, node) &&
          max(from, to) == max(p.first, node)) {
        continue;
      }

      if (dist[p.first] != -1) {
        continue;
      }

      dist[p.first] = dist[node] + p.second;
      q.push(p.first);

      if (dist[p.first] > tgtDist) {
        tgt = p.first, tgtDist = dist[p.first];
      }
    }
  }

  return make_pair(tgt, tgtDist);
}

ll diameter(ll start, ll from, ll to) {
  return search(search(start, from, to).first, from, to).second;
}

ll find(ll from, ll to) {
  return diameter(from, from, to) + diameter(to, from, to);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll from, to, cost, i = 0; i < n - 1; ++i) {
    cin >> from >> to >> cost;

    mat[from].emplace_back(make_pair(to, cost));
    mat[to].emplace_back(make_pair(from, cost));
    edges.emplace_back(make_pair(make_pair(from, to), cost));
  }

  ll result = 0;
  for (auto &p : edges) {
    result = max(result, find(p.first.first, p.first.second) + p.second);
  }

  cout << result << "\n";

  return 0;
}
```
