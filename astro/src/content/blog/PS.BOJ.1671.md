---
title: '1671 BOJ'
description: '상어의 저녁식사'
pubDate: 'Jul 07 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bipartite Matching"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1671)

## 접근

이분 매칭으로 해결하였다.

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
#define FOR(a, from, to) for (ll a = from; a < to; ++a)

cll N = 50, Ability = 2e9;
ll n, pts[N][3] = {{}}, owners[N] = {};
vll edges[N];
bool visited[N], checked[N];

bool check(ll);

bool dfs(ll node, ll tgt) {
  if (visited[node]) {
    return false;
  }

  visited[node] = true;
  if (owners[node] == -1) {
    return true;
  }
  return check(owners[node]);
}

bool check(ll node) {
  if (checked[node]) {
    return false;
  }

  checked[node] = true;
  for (auto &av : edges[node]) {
    bool isValid = true;
    for (ll prv = owners[node]; prv != -1; prv = owners[prv]) {
      if (prv == av) {
        isValid = false;
        break;
      }
    }

    if (isValid && dfs(av, node)) {
      owners[av] = node;
      return true;
    }
  }
  return false;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  FOR(i, 0, n) { cin >> pts[i][0] >> pts[i][1] >> pts[i][2]; }

  FOR(a, 0, n)
  FOR(b, 0, n) {
    if (a == b) {
      continue;
    }

    bool isValid = true, isSame = true;
    FOR(i, 0, 3) {
      if (pts[a][i] < pts[b][i]) {
        isValid = false;
        break;
      }

      isSame &= (pts[a][i] == pts[b][i]);
    }

    if (isSame && a < b) {
      continue;
    }

    if (isValid) {
      edges[a].emplace_back(b);
    }
  }

  ll result = 0;
  memset(owners, -1, sizeof(owners));
  FOR(i, 0, 2) FOR(node, 0, n) {
    memset(visited, 0, sizeof(visited));
    memset(checked, 0, sizeof(checked));
    result += check(node);
  }

  cout << n - result << "\n";

  return 0;
}
```