---
title: '13511 BOJ'
description: '트리와 쿼리 2'
pubDate: 'Aug 04 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Lowest Common Ancestor", "LCA", "Sparse Table"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/13511)

## 접근

최소공통조상과 희소배열을 이용해 해결하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<ll> qll;
typedef vector<pll> vpll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)
#define IFOR(i, a, A) for (ll i = a; i >= A; --i)

cll N = 1e5, M = 1e5, Step = 18;
ll n, m, k, parents[Step][N + 1] = {{}}, dists[Step][N + 1] = {{}},
                              depths[N + 1] = {};
vpll edges[N + 1];

pll ascend(ll node, ll step) {
  ll dst = node, cost = 0;
  FOR(i, 0, Step) {
    if (step & (1 << i)) {
      cost += dists[i][dst], dst = parents[i][dst];
    }
  }

  return {dst, cost};
}

pll check(ll u, ll v) {
  ll pu = u, pv = v, uamnt = 0, vamnt = 0, cost = 0, layover;
  if (depths[u] < depths[v]) {
    ll diff = depths[v] - depths[u];
    v = ascend(v, diff).first, vamnt += diff;
  } else if (depths[u] > depths[v]) {
    ll diff = depths[u] - depths[v];
    u = ascend(u, diff).first, uamnt += diff;
  }

  IFOR(i, Step - 1, 0) {
    ll nu = parents[i][u], nv = parents[i][v];
    if (nu != nv) {
      u = nu, v = nv, uamnt += (1 << i), vamnt += (1 << i);
    }
  }

  if (ascend(pu, uamnt).first != ascend(pv, vamnt).first) {
    ++uamnt, ++vamnt;
  }

  cost += ascend(pu, uamnt).second + ascend(pv, vamnt).second;
  if (k < uamnt) {
    layover = ascend(pu, k).first;
  } else {
    layover = ascend(pv, vamnt - (k - uamnt)).first;
  }

  return {layover, cost};
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  // 최소공통조상, sparse table
  cin >> n;
  FOR(edge, 0, n - 1) {
    ll u, v, w;
    cin >> u >> v >> w;
    edges[u].emplace_back(v, w);
    edges[v].emplace_back(u, w);
  }

  qll q;
  q.push(1);
  parents[0][1] = 1;
  while (!q.empty()) {
    ll node = q.front();
    q.pop();

    for (auto &p : edges[node]) {
      ll av, w;
      tie(av, w) = p;

      if (parents[0][av]) {
        continue;
      }

      parents[0][av] = node, dists[0][av] = w, depths[av] = depths[node] + 1;
      q.push(av);
    }
  }

  FOR(step, 1, Step)
  FOR(node, 1, n + 1) {
    ll prv = parents[step - 1][node];
    parents[step][node] = parents[step - 1][prv];
    dists[step][node] = dists[step - 1][node] + dists[step - 1][prv];
  }

  cin >> m;
  FOR(query, 0, m) {
    ll type, u, v;
    cin >> type >> u >> v;
    if (type == 1) {
      k = 0;
      cout << check(u, v).second << "\n";
    } else {
      cin >> k;
      --k;
      cout << check(u, v).first << "\n";
    }
  }

  return 0;
}
```