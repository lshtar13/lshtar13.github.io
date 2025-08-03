---
title: '15899 BOJ'
description: '트리와 색깔'
pubDate: 'Aug 03 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", 
	"Euler Tour Technique", "ETT", "Segment Tree", "Depth First Search", "DFS", "Offline Query"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/15899)

## 접근

오일러 경로 테크닉(ETT)과 세그먼트 트리, 오프라인 쿼리를 이용해 해결하였다.
오프라인 쿼리와 ETT를 사용하는 방법 외에, 머지 소트 트리(Merge Sort Tree)라는 것을 활용하는 방식도 있다.
머지 소트 하는 과정을 그대로 기록해 놓은 것과 같은 트리인데,
각 노드의 머지 소트 배열에서 lower bound 메서드를 사용하면 쉽게 쿼리를 해결할 수 있다.

이 문제는 단순하게 주어진 색보다 크거나 같은 색을 가진 노드의 개수를 구하는 것이 쿼리라 오프라인 쿼리 방식이 유효했을 것이다.
더 복잡한 쿼리가 주어졌다면 머지 소트 트리를 사용했었어야 했다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)
#define IFOR(i, a, A) for (ll i = a; i >= A; --i)

cll N = 2e5, M = 2e5, C = N, Mod = 1e9 + 7;
ll n, m, c, parents[N] = {}, nchilds[N] = {}, idxs[N] = {}, idx = 0,
            segs[N * 15] = {};
vll edges[N], mems[C], queries[C];

void update(ll node, ll left, ll right, ll idx, ll amnt) {
  if (idx < left || idx > right) {
    return;
  }

  segs[node] += amnt, segs[node] %= Mod;
  if (left != right) {
    ll mid = (left + right) / 2;
    update(node * 2, left, mid, idx, amnt);
    update(node * 2 + 1, mid + 1, right, idx, amnt);
  }
}

ll seek(ll node, ll left, ll right, ll st, ll en) {
  if (en < left || st > right) {
    return 0;
  } else if (left >= st && right <= en) {
    return segs[node] % Mod;
  }

  ll mid = (left + right) / 2, lresult = seek(node * 2, left, mid, st, en),
     rresult = seek(node * 2 + 1, mid + 1, right, st, en);

  return (lresult + rresult) % Mod;
}

ll dfs(ll node) {
  idxs[node] = idx++;
  for (auto &child : edges[node]) {
    if (parents[child] != -1) {
      continue;
    }

    parents[child] = node, nchilds[node] += dfs(child) + 1;
  }

  return nchilds[node];
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> c;
  FOR(node, 0, n) {
    ll color;
    cin >> color;
    mems[--color].emplace_back(node);
  }
  FOR(edge, 0, n - 1) {
    ll a, b;
    cin >> a >> b;
    --a, --b;
    edges[a].emplace_back(b);
    edges[b].emplace_back(a);
  }

  memset(parents, -1, sizeof(parents));
  parents[0] = 0;
  dfs(0);

  FOR(query, 0, m) {
    ll v, c;
    cin >> v >> c;
    --v, --c;
    queries[c].emplace_back(v);
  }

  ll result = 0;
  FOR(color, 0, c) {
    for (auto &mem : mems[color]) {
      update(1, 0, n - 1, idxs[mem], 1);
    }

    for (auto &v : queries[color]) {
      ll st = idxs[v], en = idxs[v] + nchilds[v],
         cur = seek(1, 0, n - 1, st, en);
      result = (result + cur) % Mod;
    }
  }

  cout << result << "\n";

  return 0;
}
```