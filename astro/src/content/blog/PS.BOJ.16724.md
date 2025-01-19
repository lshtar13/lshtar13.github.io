---
title: '16724 BOJ'
description: '피리 부는 사나이'
pubDate: 'Jan 20 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Union-Find"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/16724)

## 접근

분리집합을 통해 해결하였다.

분리집합을 통해 하나의 사이클을 형성하는 노드 군의 개수를 알아내어 출력하였다.
하나의 노드 군에 safe zone이 하나만 있으면, 해당 군에 속한 모든 노드들이 전부 safe zone에 
들어갈 수 있으므로 노드 군의 개수와 safe zone의 최소 개수는 같다.

처음에는 DP로 해결하려다가 safe zone의 초기 위치를 설정하는 것이 어렵다는 것을 깨닫고
분리집합을 사용하는 방식으로 선회하였다.

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
#define FOR1(a, A) for (ll a = 0; a < A; ++a)
#define FOR2(a, b, A, B)                                                       \
  for (ll a = 0; a < A; ++a)                                                   \
    for (ll b = 0; b < B; ++b)

cll N = 1000, M = 1000;
ll n, m, parents[N * M] = {};
char mat[N][M] = {};
bool isExist[N * M] = {};

ll find(ll node) {
  if (node == parents[node]) {
    return node;
  }

  return parents[node] = find(parents[node]);
}

void merge(ll child, ll parent) { parents[child] = find(parent); }

void gather(ll i, ll l) {
  ll cur = i * m + l, next;
  switch (mat[i][l]) {
  case 'U':
    next = (i - 1) * m + l;
    break;
  case 'D':
    next = (i + 1) * m + l;
    break;
  case 'L':
    next = i * m + l - 1;
    break;
  case 'R':
    next = i * m + l + 1;
    break;
  }

  merge(cur, next);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll i = 0; i < n; ++i) {
    cin.ignore();
    for (ll l = 0; l < m; ++l) {
      cin >> mat[i][l];
      parents[i * m + l] = i * m + l;
    }
  }

  ll result = 0;
  FOR2(i, l, n, m) { gather(i, l); }
  FOR2(i, l, n, m) {
    ll parent = find(i * m + l);
    if (!isExist[parent]) {
      ++result;
      isExist[parent] = true;
    }
  }

  cout << result << "\n";

  return 0;
}
```