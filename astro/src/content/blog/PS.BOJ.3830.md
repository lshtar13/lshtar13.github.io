---
title: '3830 BOJ'
description: '교수님은 기다리지 않는다'
pubDate: 'Apr 01 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Disjoint Set"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3830)

## 접근

분리 집합을 이용해 해결하였다.

오랜만에 분리 집합을 이용하는 문제를 해결하였다.
다른 것은 모두 일반적인 분리 집합 문제와 동일하고 부모와 노드간에 가중치가 추가 되었다는 점만 조심하면 된다.
가중치를 업데이트 해주는 방식을 찾는 것이 어려웠지만 게시판 반례를 보며 빠르게 해결할 수 있었다.
그것보다 입력을 받는 과정에서 공연히 stringstream을 사용하는 바람에 예상되로 코드가 작동하지 않아 많이 헤메었다.
익숙치 않은 것은 사용하지 않아야 겠다(알고리즘 이야기는 아니다 ...).

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e5, M = 1e5, Parent = 0, Weight = 1;
ll n, m, unionFind[N][2] = {}; // parent, weight(prefixSum)

ll findParents(ll node) {
  ll parent = unionFind[node][Parent], pWeight, nparent;
  if (parent == node) {
    return node;
  }

  pWeight = unionFind[parent][Weight], nparent = findParents(parent);
  if (nparent != parent) {
    unionFind[node][Weight] += unionFind[parent][Weight];
  }

  return unionFind[node][Parent] = nparent;
}

void merge(ll a, ll b, ll w) {
  ll aParent = findParents(a), bParent = findParents(b);
  if (aParent == bParent) {
    return;
  }

  unionFind[bParent][Parent] = aParent;
  unionFind[bParent][Weight] = w - unionFind[b][Weight] + unionFind[a][Weight];
}

void solve() {
  memset(unionFind, 0, sizeof(unionFind));
  for (ll i = 0; i < n; ++i) {
    unionFind[i][Parent] = i;
  }

  cin.ignore();
  for (ll i = 0; i < m; ++i) {
    char q;
    ll a, b, w;
    cin >> q >> a >> b;
    --a, --b;
    if (q == '!') {
      cin >> w;
      merge(a, b, w);
    } else if (findParents(a) != findParents(b)) {
      cout << "UNKNOWN\n";
    } else {
      cout << unionFind[b][Weight] - unionFind[a][Weight] << "\n";
    }
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  while (cin >> n >> m && n && m) {
    solve();
  }

  return 0;
}
```