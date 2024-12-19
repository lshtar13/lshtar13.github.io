---
title: '2610 BOJ'
description: '회의준비'
pubDate: 'Dec 19 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Floyd-Warshall", "Depth-First Search", "DFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2610)

## 접근

플로이드-워셜 알고리즘과 DFS를 이용해 해결하였다.
난도가 높진 않았으나, 잔실수를 반복해 수정을 많이 했더니 누더기 코드가 되었다.

플로이드-워셜 알고리즘을 이용해 모든 노드들에 대하여 다른 모든 노드들까지의 의사 전달 시간을 구한다.
해당 정보와 DFS 알고리즘을 이용해 서로 연결되어 있는 노드 그룹을 구한다.
해당 노드 그룹(위원회)의 최소 의사 전달 시간을 구한다.

유니온 파인드를 이용해 그룹을 구하는 풀이도 있는 것 같다. 
하지만, 의사 전달 시간을 구해야 하기 때문에 DFS가 조금 더 나은 것 같다.

## 코드

```c++
#include <algorithm>
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
#define FOR1(a, A) for (ll a = 0; a < A; ++a)
#define FOR2(a, b, A, B)                                                       \
  for (ll a = 0; a < A; ++a)                                                   \
    for (ll b = 0; b < B; ++b)

cll N = 100, INF = 1234;
ll n, m, k = 0;

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  vector<bool> visited(n, false);
  vvll mat(n, vll(n, INF));
  vll maxDeliver(n, 0);
  for (ll a, b, i = 0; i < m; ++i) {
    cin >> a >> b;
    --a, --b;
    mat[a][b] = mat[b][a] = 1;
  }

  for (ll i = 0; i < n; ++i) {
    mat[i][i] = 0;
  }

  for (ll mid = 0; mid < n; ++mid) {
    FOR2(i, l, n, n) { mat[i][l] = min(mat[i][l], mat[i][mid] + mat[mid][l]); }
  }

  set<ll> result;
  for (ll st = 0; st < n; ++st) {
    if (visited[st]) {
      continue;
    }

    qll q;
    q.push(st);
    vll idxs = {st};
    visited[st] = true;
    while (!q.empty()) {
      ll node = q.front();
      q.pop();

      for (ll idx = 0; idx < n; ++idx) {
        if (node == idx || mat[node][idx] >= INF) {
          continue;
        }

        maxDeliver[node] = max(maxDeliver[node], mat[node][idx]);
        if (visited[idx]) {
          continue;
        }

        q.push(idx);
        visited[idx] = true;
        idxs.emplace_back(idx);
      }
    }

    ll maxIdx = st;
    for (auto idx : idxs) {
      if (maxDeliver[idx] < maxDeliver[maxIdx]) {
        maxIdx = idx;
      }
    }

    result.insert(maxIdx);
  }
  cout << result.size() << "\n";
  for (auto idx : result) {
    cout << idx + 1 << "\n";
  }

  return 0;
}
```