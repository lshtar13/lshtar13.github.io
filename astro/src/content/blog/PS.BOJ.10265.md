---
title: '10265 BOJ'
description: 'MT'
pubDate: 'Jul 19 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Topological Sort", "Strongly Connected Component"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/10265)

## 접근

강한 연결 요소를 찾고 위상 정렬의 진입 차수를 이용해 트리를 만들어 준 후 해당 트리를 포함하는지 안 포함하는지 경우를 나눠가며 최대 사이즈를 구하면 된다.

## 코드

```c++
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
#define FOR(i, a, A) for (ll i = a; i < A; ++i)

cll N = 1000, K = 1000, X = N;
ll n, k, parents[N] = {}, pidx = 0, groups[N] = {}, gidx = 0, degrees[N] = {},
         sizes[N + 1] = {};
bool checked[N] = {}, results[N + 1] = {};
deque<deque<ll>> sccs;
vll companions[N], childs[N + 1], starts;

ll check0(ll node) {
  if (parents[node] != -1) {
    return parents[node];
  }

  static stack<ll> s;
  s.push(node);
  ll parent = parents[node] = pidx++;

  static bool checked[N] = {};
  for (auto &companion : companions[node]) {
    if (!checked[companion]) {
      parents[node] = min(parents[node], check0(companion));
    }
  }

  if (parent == parents[node]) {
    deque<ll> scc;
    while (!s.empty()) {
      ll pnode = s.top();
      scc.push_back(pnode);
      s.pop();

      checked[pnode] = true;
      groups[pnode] = gidx;

      if (pnode == node) {
        break;
      }
    }

    ++gidx;
    sccs.emplace_back(scc);
  }

  return parents[node];
}

ll check1(ll group) {
  for (auto &mem : sccs[group]) {
    for (auto &companion : companions[mem]) {
      if (groups[companion] != group && !checked[groups[companion]]) {
        checked[groups[companion]] = true;
        childs[group].emplace_back(groups[companion]);
      }
    }
  }

  return sccs[group].size();
}

void check2(ll group) {
  bool cur[K + 1] = {};
  cur[sizes[group]] = true;
  for (auto &child : childs[group]) {
    check2(child);
    for (ll tgt = k; tgt >= 0; --tgt) {
      for (ll prv = 0; prv <= tgt; ++prv) {
        cur[tgt] |= cur[prv] && results[tgt - prv];
      }
    }
  }

  memcpy(results, cur, sizeof(results));
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> k;
  FOR(a, 0, n) {
    ll b;
    cin >> b;
    companions[--b].emplace_back(a);
  }

  // find scc
  memset(parents, -1, sizeof(parents));
  FOR(node, 0, n) {
    if (!checked[node]) {
      check0(node);
    }
  }

  // make tree
  memset(checked, 0, sizeof(checked));
  FOR(group, 0, gidx) { sizes[group] = check1(group); }
  FOR(group, 0, gidx) {
    if (!checked[group]) {
      childs[n].emplace_back(group);
    }
  }

  // count
  memset(checked, 0, sizeof(checked));
  check2(n);
  for (ll avail = k; avail >= 0; --avail) {
    if (results[avail]) {
      cout << avail << "\n";
      break;
    }
  }

  return 0;
}
```