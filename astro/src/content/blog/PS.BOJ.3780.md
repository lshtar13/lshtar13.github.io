---
title: '3780 BOJ'
description: '네트워크 연결'
pubDate: 'Jun 02 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Disjoint Set", "Union Find"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3780)

## 접근

분리 집합을 이용해 해결하였다.

기업을 합칠 때, 흡수되는 기업이 센터가 되는 기업임을 놓치고 bfs로 해결하려다가 애먹었던 문제이다.
클러스터를 합친다길래 처음에 분리 집합을 이용하려 하였지만,
위에 언급한 사항을 고려하지 않으니 분리 집합을 이용하면 parent가 아닌 노드들끼리 연결될 때 거리 갱신이 어렵게 되는 경향이 있었다.
따라서, 합칠 때마다 bfs를 통해 거리 갱신을 해주려고 하였으나 WA를 받았다.
문제를 다시 읽어보니 놓친 부분이 있어서 해당 부분을 고려해 분리 집합으로 해결하게 되었다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 2e4, Mod = 1e3;
ll n, parents[N + 1] = {}, dists[N + 1] = {};

ll findParent(ll node) {
  if (node == parents[node]) {
    return node;
  }

  ll prv = parents[node];
  parents[node] = findParent(prv);
  dists[node] += dists[prv];

  return parents[node];
}

void merge(ll a, ll b) {
  ll parent = findParent(b);
  parents[a] = parent, dists[a] = abs(a - b) % Mod + dists[b];
}

void solve() {
  cin >> n;
  for (ll i = 1; i <= n; ++i) {
    parents[i] = i, dists[i] = 0;
  }

  while (true) {
    cin.ignore();

    char inst;
    ll i, j;
    cin >> inst;
    if (inst == 'O') {
      break;
    } else if (inst == 'E') {
      cin >> i;
      findParent(i);
      cout << dists[i] << "\n";
    } else if (inst == 'I') {
      cin >> i >> j;
      merge(i, j);
    }
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    solve();
  }

  return 0;
}
```