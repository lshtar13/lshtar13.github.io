---
title: '13907 BOJ'
description: '세금'
pubDate: 'Jan 09 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dijkstra"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/13907)

## 접근

다익스트라 알고리즘을 이용해 해결하였다.

거쳐온 길의 개수에 따라 오르는 통행료가 달라지기 때문에,
거쳐온 길의 개수 별로 최소 거리를 계산하였다.
이후에 세금이 늘어날 때마다, 최소 거리를 계산한다.

다른 사람들 풀이와 비교하였을 때, 뭔가 수정이 많이 필요해 보인다.

## 코드

```c++
#include <bits/stdc++.h>
#include <functional>
#include <vector>

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

cll N = 1000, M = 3e4, K = 3e4, W = 1000, INF = W * M;
ll n, m, k, start, depart, minDist[N][N] = {{}};
vpll edges[N];

void fillMin() {
  memset(minDist, 0x3f3f3f, sizeof(minDist));

  priority_queue<info_t, vector<info_t>, greater<info_t>> pq;
  pq.push({0, 0, start});
  minDist[start][0] = 0;

  for (ll node, nedge, w; !pq.empty();) {
    tie(w, nedge, node) = pq.top();
    // cout << w << " " << nedge << " " << node << "\n";
    pq.pop();

    if (minDist[node][nedge] < w) {
      continue;
    }

    for (auto &edge : edges[node]) {
      ll av = edge.first, _w = w + edge.second;
      if (nedge + 1 > n - 1) {
        continue;
      } else if (_w >= minDist[av][nedge + 1]) {
        continue;
      }

      minDist[av][nedge + 1] = _w;
      pq.push({_w, nedge + 1, av});
    }
  }
}

ll findMin(ll tax) {
  ll result = INF;
  for (ll nedge = 0; nedge < N; ++nedge) {
    result = min(result, nedge * tax + minDist[depart][nedge]);
  }

  return result;
}

int main(void) {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

  cin >> n >> m >> k;
  cin >> start >> depart;
  --start, --depart;

  for (ll a, b, w, i = 0; i < m; ++i) {
    cin >> a >> b >> w;
    --a, --b;
    edges[a].emplace_back(make_pair(b, w));
    edges[b].emplace_back(make_pair(a, w));
  }

  fillMin();
  cout << findMin(0) << "\n";
  for (ll tax, sum = 0, step = 0; step < k; ++step) {
    cin >> tax;
    sum += tax;
    cout << findMin(sum) << "\n";
  }

  return 0;
}
```