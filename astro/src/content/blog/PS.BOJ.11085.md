---
title: '11085 BOJ'
description: '군사이동'
pubDate: 'Nov 09 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Minimum Spanning Tree", "MST", "Disjoint Set"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/11085)
전쟁 당시 Baekjoon World의 국왕은 Cube World를 공격할 작전을 세운 적이 있습니다. Baekjoon World와 Cube World는 p개의 지점과 w개의 길로 표현됩니다. 모든 길은 양방향이며, 각 길마다 너비가 존재하여 이에 비례하는 수의 군사가 지나갈 수 있습니다.

Baekjoon World의 국왕은 군사들이 뭉치는 것이 유리하다고 생각해서, 미리 Cube World로 가는 경로를 정해 두고 그 경로로만 모든 군사를 보냈습니다. Baekjoon World의 국왕은 총명해서, 경로 상에 있는 길 중 너비가 가장 좁은 길의 너비를 최대화하는 경로를 택했습니다.

그런데 전쟁 때문에 어느 길로 보냈는지에 대한 기록이 불타 없어져 버렸습니다. 전쟁사를 완성하려면 이 기록이 꼭 필요합니다. 위대한 과학자인 당신이 다시 복구해 주세요.

# 접근
최소스패닝트리를 구성하는데 사용하는 프림 알고리즘을 활용하여 해결하였다. '최소'스패닝 트리를 구성하는 것이 아니라, '최대'스패닝 트리를 구성하는 방식이다. 실제로 스패닝 트리를 만들진 않고, 시작점과 끝점을 연결하는 트리가 완성될 시점까지만 지속한다. 이러한 접근을 다음과 같이 구현했다.
* 입력된 edge 정보들을 우선순위 큐에 넣는다.
* 이미 시작점에 새로운 node를 추가해주는 edge 중 가장 너비가 큰 edge를 골라 해당 node를 추가한다.
* 시작점과 끝점이 연결되면 중단한다.

# 입력
첫 줄에 p와 w가 공백을 사이에 두고 주어집니다. (2 ≤ p ≤ 1 000; 1 ≤ w ≤ 50 000)

다음 줄에 Baekjoon World의 수도 c와 Cube World의 수도 v가 공백을 사이에 두고 주어집니다. (0 ≤ c, v < p; c ≠ v)

다음 w줄에 길이 연결하는 두 지점 wstart, wend,와 길의 너비 wwidth가 공백을 사이에 두고 주어집니다. (0 ≤ wstart, wend < p; wstart ≠ wend; 1 ≤ wwidth ≤ 1 000)

# 출력
첫 줄에 Baekjoon World의 국왕이 정한 경로 상에 있는 길 중 너비가 가장 좁은 길의 너비를 출력합니다.

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

cll P = 1000, W = 50000;
ll p, w, c, v, parents[P] = {};
vvpll mat(P);

ll findParent(ll node) {
  if (node == parents[node]) {
    return node;
  }

  return parents[node] = findParent(parents[node]);
}

inline void merge(ll n0, ll n1) { parents[n1] = findParent(n0); }

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> p >> w >> c >> v;
  for (ll i = 0; i < p; ++i) {
    parents[i] = i;
  }

  for (ll n0, n1, width, i = 0; i < w; ++i) {
    cin >> n0 >> n1 >> width;
    mat[n0].emplace_back(make_pair(n1, width));
    mat[n1].emplace_back(make_pair(n0, width));
  }

  pqpll pq;
  for (auto &p : mat[c]) {
    pq.push(make_pair(p.second, p.first));
  }

  ll result = LLONG_MAX;
  while (findParent(c) != findParent(v)) {
    ll width = pq.top().first, node = pq.top().second;
    pq.pop();

    if (findParent(c) == findParent(node)) {
      continue;
    }

    result = min(result, width);
    merge(c, node);

    for (auto &p : mat[node]) {
      pq.push(make_pair(p.second, p.first));
    }
  }

  cout << result << "\n";

  return 0;
}
```