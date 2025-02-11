---
title: '1615 BOJ'
description: '교차개수세기'
pubDate: 'Feb 11 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1615)

## 접근

세그먼트 트리를 이용해 해결하였다.

Inversion Counting 문제라고들 부른다.
간선을 시작점을 기준으로, 시작점이 동일할 경우 도착점을 기준 삼아 오름차순으로 정렬한다.
순서대로 간선을 조사하여 해당 간선의 도착점을 세그먼트 트리에 반영한다.
해당 간선을 추가함으로써 얻은 새로운 교차점은, 현재의 세그먼트 트리에서 해당 간선의 도착점부터 끝점까지 더한 값과 같다.

위와 같이 하면, 오름 차순으로 정렬되어 있기 때문에 소급해서 조사할 필요가 없다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;

cll N = 2e3, M = 2e6;
ll n, m, segs[N * 10] = {};
pll edges[M];

ll increase(ll node, ll st, ll en, ll idx) {
  if (st > idx || en < idx) {
    return segs[node];
  } else if (st == en) {
    return ++segs[node];
  }

  ll mid = (st + en) / 2;
  return segs[node] = increase(node * 2, st, mid, idx) +
                      increase(node * 2 + 1, mid + 1, en, idx);
}

ll query(ll node, ll st, ll en, ll idx) {
  if (en < idx) {
    return 0;
  } else if (st >= idx) {
    return segs[node];
  }

  ll mid = (st + en) / 2;
  return query(node * 2, st, mid, idx) + query(node * 2 + 1, mid + 1, en, idx);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll i = 0; i < m; ++i) {
    cin >> edges[i].first >> edges[i].second;
  }
  sort(edges, edges + m);

  ll result = 0;
  for (ll i = 0, a, b; i < m; ++i) {
    tie(a, b) = edges[i];
    result += query(1, 1, n, b + 1);
    increase(1, 1, n, b);
  }

  cout << result << '\n';

  return 0;
}
```