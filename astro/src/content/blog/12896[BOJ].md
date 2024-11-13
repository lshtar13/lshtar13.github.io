---
title: '12896 BOJ'
description: '스트루지 민호'
pubDate: 'Nov 13 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Diameter of Tree", "Breadth-First Search", "BFS"]
series: "PS"
---
호
# [문제](https://www.acmicpc.net/problem/12896)
구두쇠로 유명한 스크루지 민호가 다스리는 천나라가 있다. 천나라에는 N 개의 도시들이 있는데 각각의 도시들 사이에는 양방향 도로로 이어져 있다. 민호는 도시를 세울 때 최소한의 비용만을 들이고 싶어서 N - 1 개의 도로를 이용해 모든 도시들 사이에는 단 한개의 경로만이 존재하도록 도시를 세웠다.

도시를 세울 당시에 소방서를 여러개 건설하는 것이 아까웠던 스쿠르지 민호는 단 하나의 도시에 소방서를  건설하기로 했다. 하지만 최소한의 양심이 있어서인지 소방서는 최적의 위치가 될 수 있는 도시에 건설하기로 했다. 최적의 위치라는 것은 소방서에서 소방차가 출동해 다른 도시에 도착을 할 때 이동해야 하는 거리중의 최대가 최소가 되는 지점을 의미한다. 편의상 같은 도시 내에서 이동하는 거리는 없다고 생각하며 한 도시에서 다른 도시로 연결된 도로는 거리가 1이라고 생각한다.

천나라에 있는 도시의 수와 도로들의 연결 상태가 주어질 때 최적의 위치에 설치된 소방서에서 소방차가 출동해 다른 도시에 도착할 때 이동해야하는 거리들 중 최대 거리를 구하는 프로그램을 작성하자.

# 접근

트리의 지름을 구해 해결하였다.

주어진 입력들을 분석하면 트리 구조를 띄고 있다는 것을 알 수 있다.
트리의 지름, 즉 말단 노드들 간의 최대 거리를 구하게 되면 이를 통해 최대 거리의 최단을
알 수 있기 때문에 트리의 지름을 구하였다.
지름을 이루는 경로의 정가운데를 소방서, 즉 루트를 설정하게 되면 최대거리의 최단을 이룰 수
있다. 따라서 지름을 구하고 그 절반에 해당하는 값을 출력하면 된다.

트리의 지름은 DFS를 이용하여 구하였다. 임의의 노드를 고르고, 해당 노드에서 가장 멀리
떨어진 노드 u를 구한다.
다시, u에서 가장 멀리 떨어진 노드 v를 구하면 u-v간의 거리가 트리의 지름이다.

# 입력

첫째 줄에는 천나라에 있는 도시의 수 N (2 ≤ N ≤ 100,000) 이 주어진다.  다음 N - 1 줄에 걸쳐 도시들의 연결 상태가 주어진다.

각각의 줄에는 공백을 기준으로 세개의 숫자가 u, v (1 ≤ u, v ≤ N) 가 주어지는데 이는 도시 u와 v가 양방향 도로로 연결이 되어 있다는 것을 의미한다.

# 출력

첫째 줄에 최적의 위치에 설치된 소방서에서 소방차가 출동해 다른 도시에 도착할 때까지 이동해야하는 거리들 중 최댓값을 출력한다.

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

cll N = 1e5;
ll n;
vvll edges(N);

pll find(ll start) {
  vll dist(n, -1);
  qll q;
  pll result(0, start);
  q.push(start);
  dist[start] = 0;
  while (!q.empty()) {
    ll node = q.front();
    q.pop();
    for (auto av : edges[node]) {
      if (dist[av] != -1) {
        continue;
      }

      q.push(av);
      dist[av] = dist[node] + 1;

      if (dist[av] > result.first) {
        result = make_pair(dist[av], av);
      }
    }
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll u, v, i = 0; i < n - 1; ++i) {
    cin >> u >> v;
    --u, --v;

    edges[u].emplace_back(v);
    edges[v].emplace_back(u);
  }

  pll uInfo = find(0);
  ll u = uInfo.second, distU = uInfo.first;
  pll vInfo = find(u);
  ll v = vInfo.second, distV = vInfo.first;

  cout << distV / 2 + distV % 2 << "\n";

  return 0;
}
```
