---
title: '13911 BOJ'
description: '집 구하기'
pubDate: 'Nov 17 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dijkstra"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/13911)

안양에 사는 상혁이는 4년간의 통학에 지쳐 서울에 집을 구하려고 한다. 상혁이가 원하는 집은 세가지 조건이 있다.

* 맥세권 : 맥세권인 집은 맥도날드와 집 사이의 최단거리가 x이하인 집이다.
* 스세권 : 스세권인 집은 스타벅스와 집 사이의 최단거리가 y이하인 집이다.
* 맥세권과 스세권을 만족하는 집 중 최단거리의 합이 최소인 집

통학 때문에 스트레스를 많이 받은 상혁이는 집을 선택하는 데 어려움을 겪고 있다. 똑똑한 여러분이 상혁이 대신 이 문제를 해결해 주자. 이사 갈 지역의 지도가 그래프로 주어지고 맥도날드와 스타벅스의 위치가 정점 번호로 주어질 때 상혁이가 원하는 집의 최단거리의 합을 출력하는 프로그램을 작성하시오. (맥도날드와 스타벅스가 아닌 정점에는 모두 집이 있다.)

![image](https://onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/problem/13911/1.png)

위의 예제 지도에서 사각형은 맥도날드를, 별은 스타벅스가 위치한 정점을 나타낸다. 각 원은 집이 있는 정점을 낸다. x가 6이고 y가 4일 때 가능한 집의 정점은 6이다. 맥도날드까지의 최단거리가 2, 스타벅스까지의 최단거리가 4로 총 합이 6이 되기 때문이다. 정점 7은 맥세권이면서 스세권이지만 맥도날드까지의 최단거리가 6, 스타벅스까지의 최단거리가 2로 총 합이 8로써 정점 6의 값보다 크므로 답이 아니다. 그 외의 정점 2, 3, 4는 맥세권이면서 스세권인 조건을 충족하지 못하므로 답이 될 수 없다.

# 접근

다익스트라 알고리즘을 이용해 해결하였다.

처음에는 맥도날드와 스타벅스 노드들 별로 다익스트라를 전부 진행해볼까 생각하였으나, 각각 V-2개까지 노드가 배정될 수 있다는
조건을 보고 생각을 바꿨다. 시간초과가 일어날 수 있기 때문이다. 
대신, 맥도날드와 스타벅스 노드들에 대하여 각각 가상의 0번, 1번 노드를 연결시켰다. 
이때 0번, 1번 노드와 맥도날드, 스타벅스 노드들간의 거리는 0으로 설정한다. 
이렇게 하면, 한번의 다익스트라로 모든 집들의 맥도날드 혹은 스타벅스까지의 최단거리를 구할 수 있다.

주의해야 할 점은, 가상의 0번, 1번 노드가 최단 거리 경로에 포함되지 않도록 하는 점이다. 실제로는 존재하지 않는 노드이니.

# 입력

첫줄에는 정점의 개수 V(3 ≤ V ≤ 10,000)와 도로의 개수 E(0 ≤ E ≤ 300,000)가 주어진다. 그 다음 E줄에 걸쳐 각 도로를 나타내는 세 개의 정수 (u,v,w)가 순서대로 주어진다. 이는 u와 v(1 ≤ u,v ≤ V)사이에 가중치가 w(1 ≤ w < 10,000)인 도로가 존재한다는 뜻이다. u와 v는 서로 다르며 다른 두 정점 사이에는 여러 개의 간선이 존재할 수도 있음에 유의한다. E+2번째 줄에는 맥도날드의 수 M(1 ≤ M ≤ V-2) 맥세권일 조건 x(1 ≤ x ≤ 100,000,000)가 주어지고 그 다음 줄에 M개의 맥도날드 정점 번호가 주어진다. E+4번째 줄에는 스타벅스의 수 S(1 ≤ S ≤ V-2)와 스세권일 조건 y(1 ≤ y ≤ 100,000,000)가 주어지고 그 다음 줄에 S개의 스타벅스 정점 번호가 주어진다. 

* 맥도날드나 스타벅스가 위치한 정점에는 집이 없다.
* 한 정점에 맥도날드와 스타벅스가 같이 위치할 수 있다.
* 집이 있는(= 맥도날드나 스타벅스가 위치하지 않은) 정점이 하나 이상 존재한다.

# 출력

상혁이가 원하는 집의 맥도날드까지의 최단거리와 스타벅스까지의 최단거리 합을 출력한다. 만일 원하는 집이 존재하지 않으면 -1을 출력한다.


# 코드

```cpp
#include <bits/stdc++.h>
#include <climits>
#include <queue>
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

cll V = 1e4, E = 3e5, W = 1e4, X = 1e8, Y = 1e8;
ll v, e, m, x, s, y, dist[V + 3][3] = {{}};
vvpll edges(V + 3);

void dijkstra(ll type) {
  priority_queue<pll, vector<pll>, greater<pll>> pq;
  pq.push(make_pair(0, type));
  dist[type][type] = 0;
  while (!pq.empty()) {
    ll node = pq.top().second, d = pq.top().first;
    pq.pop();

    if (dist[node][type] < d) {
      continue;
    }

    for (auto &p : edges[node]) {
      ll av = p.first, w = p.second;
      if (av < 2) {
        continue;
      } else if (dist[av][type] <= d + w) {
        continue;
      } else if (!type && x < d + w) {
        continue;
      } else if (type && y < d + w) {
        continue;
      }

      pq.push(make_pair(dist[av][type] = d + w, av));
    }
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> v >> e;
  for (ll u, v, w, i = 0; i < e; ++i) {
    cin >> u >> v >> w;
    ++u, ++v;
    edges[u].emplace_back(make_pair(v, w));
    edges[v].emplace_back(make_pair(u, w));
  }

  cin >> m >> x;
  for (ll node, i = 0; i < m; ++i) {
    cin >> node;
    ++node;
    edges[0].emplace_back(make_pair(node, 0));
    edges[node].emplace_back(make_pair(0, 0));
    dist[node][2] = 1;
  }

  cin >> s >> y;
  for (ll node, i = 0; i < s; ++i) {
    cin >> node;
    ++node;
    edges[1].emplace_back(make_pair(node, 0));
    edges[node].emplace_back(make_pair(1, 0));
    dist[node][2] = 1;
  }

  for (ll node = 0; node <= v + 1; ++node) {
    dist[node][0] = dist[node][1] = 1e9;
  }

  dijkstra(0);
  dijkstra(1);

  ll result = 1e9;
  for (ll i = 2; i <= v + 1; ++i) {
    if (dist[i][2]) {
      continue;
    } else if (dist[i][0] > x) {
      continue;
    } else if (dist[i][1] > y) {
      continue;
    } else {
      result = min(result, dist[i][0] + dist[i][1]);
    }
  }

  if (result != 1e9) {
    cout << result << "\n";
  } else {
    cout << -1 << "\n";
  }

  return 0;
}
```
