---
title: '16437 BOJ'
description: '양 구출 작전'
pubDate: 'Jan 06 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Depth-First Search", "DFS", "Stack"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/16437)

## 접근

DFS와 스택으로 해결하였다.

Leaf노드를 찾아 탐색을 시작하는 것은 추가적인 작업을 필요로 하기 때문에
루트 노드(1)에서 거슬러 이동하며 이동할 수 있는 양을 찾는 것이 더 수월하다.
DFS를 사용하여 루트 노드에서부터 차례로 이동을 하며 아래와 같이 탐색을 한다.

* 늑대 노드에 도달하면 해당 늑대 개체들에 대한 정보를 스택에 저장한다. 
  만약, 자식 노드에 대한 탐색을 마치고 복귀하였을 때 해당 노드 정보가 스택에 남아 있다면 제거한다.
* 양 노드에 도달하면 현재까지 쌓인 스택의 늑대들에 대하여 최대한 양을 소거해준다.
  소거 후, 양이 남았으면 해당 양들은 루트 노드에 도달할 수 있는 양으로 간주하여 결과에 반영한다.

이러한 풀이가 가능한 것은, 주어진 그래프가 트리 구조이며 
그리디하게 양을 소거시키는 것과 최적으로 양을 소거시키는 것의 차이가 없기 때문이다(?).

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

cll N = 123456;
ll n, species[2][N + 1] = {{}}, result = 0; // sheep(0), wolf(1)
stack<pll> wolves;
vvll edges(N + 1);
bool visited[N + 1] = {};

void search(ll node) {
  ll nspecie;
  for (auto child : edges[node]) {
    if (visited[child]) {
      continue;
    }

    visited[child] = true;
    if (species[0][child]) {
      nspecie = species[0][child];
      while (nspecie > 0 && !wolves.empty()) {
        ll _node = wolves.top().first, nwolf = wolves.top().second, _nspecie;
        wolves.pop();

        _nspecie = max(ll(0), nspecie - nwolf);
        nwolf -= nspecie - _nspecie;
        nspecie = _nspecie;

        if (nwolf > 0) {
          wolves.push({_node, nwolf});
        }
      }
      result += nspecie;
      search(child);
    } else {
      nspecie = species[1][child];
      wolves.push({child, nspecie});
      search(child);
      if (!wolves.empty() && wolves.top().first == child) {
        wolves.pop();
      }
    }
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 2; i <= n; ++i) {
    char specie;
    ll nspecie, bridge;
    cin >> specie >> nspecie >> bridge;

    edges[i].emplace_back(bridge);
    edges[bridge].emplace_back(i);

    species[specie == 'W'][i] = nspecie;
  }

  visited[1] = true;
  search(1);

  cout << result << "\n";

  return 0;
}
```