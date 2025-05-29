---
title: '3176 BOJ'
description: '도로 네트워크'
pubDate: 'May 29 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Lowest Common Ancestor", "LCA", "Sparse Table"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3176)

## 접근

최소 공통 조상과 희소 배열을 통해 해결하였다.

희소 배열을 작성할 때, 해당 구간의 최단 및 최장 간선 길이를 같이 기록하는 방식으로 해결하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<ll> qll;
typedef vector<pll> vpll;

typedef tuple<ll, ll, ll> info_t;
cll N = 1e5, Length = 1e6, K = 1e5;
ll n, k, levels[N + 1] = {}, parents[N + 1][20] = {}, dists[N + 1][20][2] = {};
vpll edges[N + 1];

info_t getInfo(ll node, ll level) {
  ll dst = node, minDist = Length, maxDist = 0;
  for (ll i = 0; i < 20; ++i) {
    if (!(level & (1 << i))) {
      continue;
    }
    minDist = min(minDist, dists[dst][i][0]);
    maxDist = max(maxDist, dists[dst][i][1]);
    dst = parents[dst][i];
  }

  return {dst, minDist, maxDist};
}

pll find0(ll node0, ll node1) {
  ll st = 0, en = min(levels[node0], levels[node1]), minDist, maxDist;
  while (st <= en) {
    ll mid = (st + en) / 2;
    ll ans0, minDist0, maxDist0, ans1, minDist1, maxDist1;

    tie(ans0, minDist0, maxDist0) = getInfo(node0, levels[node0] - mid);
    tie(ans1, minDist1, maxDist1) = getInfo(node1, levels[node1] - mid);

    if (ans0 == ans1) {
      minDist = min(minDist0, minDist1), maxDist = max(maxDist0, maxDist1),
      st = mid + 1;
    } else {
      en = mid - 1;
    }
  }

  return {minDist, maxDist};
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0, a, b, c; i < n - 1; ++i) {
    cin >> a >> b >> c;
    edges[a].emplace_back(b, c);
    edges[b].emplace_back(a, c);
  }

  qll q;
  q.push(1);
  levels[1] = 0, parents[1][0] = 1, dists[1][0][0] = dists[1][0][1] = 0;
  while (!q.empty()) {
    ll node = q.front();
    q.pop();

    for (auto &p : edges[node]) {
      ll av = p.first, dist = p.second;
      if (parents[av][0]) {
        continue;
      }

      parents[av][0] = node, dists[av][0][0] = dists[av][0][1] = dist,
      levels[av] = levels[node] + 1;
      q.push(av);
    }
  }

  for (ll step = 1; step < 20; ++step) {
    for (ll node = 1; node <= n; ++node) {
      ll prvParent = parents[node][step - 1], prvMin = dists[node][step - 1][0],
         prvMax = dists[node][step - 1][1];
      parents[node][step] = parents[prvParent][step - 1];
      dists[node][step][0] = min(prvMin, dists[prvParent][step - 1][0]);
      dists[node][step][1] = max(prvMax, dists[prvParent][step - 1][1]);
    }
  }

  cin >> k;
  for (ll i = 0, d, e, minDist, maxDist; i < k; ++i) {
    cin >> d >> e;
    tie(minDist, maxDist) = find0(d, e);
    cout << minDist << " " << maxDist << "\n";
  }

  return 0;
}
```