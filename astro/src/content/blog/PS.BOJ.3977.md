---
title: '3977 BOJ'
description: '축구 전술'
pubDate: 'Apr 06 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Strongly Connected Components", "SCC"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3977)

## 접근

강한 연결 요소를 통해 해결하였다.

강한 연결 요소를 파악하여 그것들끼리 묶어 하나의 노드로 만들면, 방향 비순환 그래프를 얻을 수 있다.
해당 그래프에서 진입차수가 0인 노드가 하나이면 해당 노드에 해당하는 인덱스들을 출력하면 되고,
둘 이상인 경우 Confused를 출력하면 된다.

SCC를 활용한 문제를 처음 풀었는데, 타잔 알고리즘이 조금 이해하기 힘들었다.
많이 연습해봐야 할 부분이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<vll> vvll;

cll N = 1e5, M = 1e5;
ll n, m, cnt, cnts[N] = {}, degree[N] = {};
stack<ll> s;
bool finished[N] = {}, visited[N] = {}, isValid[N] = {};

ll scc(ll node, vvll &edges) {
  ll ret = cnts[node] = cnt++;
  visited[node] = true;
  s.push(node);
  for (auto &av : edges[node]) {
    if (!visited[av]) {
      ret = min(ret, scc(av, edges));
    } else if (!finished[av]) {
      ret = min(ret, cnts[av]);
    }
  }

  if (ret == cnts[node]) {
    isValid[ret] = true;
    while (true) {
      ll tnode = s.top();
      s.pop();

      finished[tnode] = true;
      cnts[tnode] = ret;
      if (tnode == node) {
        break;
      }
    }
  }

  return ret;
}

void solve() {
  cin >> n >> m;
  vvll edges(n), group(n);
  memset(finished, false, sizeof(finished));
  memset(visited, false, sizeof(visited));
  memset(isValid, false, sizeof(isValid));
  memset(cnts, 0, sizeof(cnts));
  memset(degree, 0, sizeof(degree));
  for (ll i = 0, a, b; i < m; ++i) {
    cin >> a >> b;
    edges[a].emplace_back(b);
  }

  // strongly connected components
  // topology-sort (use only degree)
  cnt = 0;
  for (ll node = 0; node < n; ++node) {
    if (!visited[node]) {
      scc(node, edges);
    }
  }

  for (ll a = 0; a < n; ++a) {
    for (auto &b : edges[a]) {
      if (cnts[a] != cnts[b]) {
        ++degree[cnts[b]];
      }
    }
  }

  ll nresult = 0, result = 0;
  for (ll i = 0; i < n; ++i) {
    if (isValid[i] && !degree[i]) {
      ++nresult, result = i;
    }
  }
  if (nresult != 1) {
    cout << "Confused\n";
  } else {
    for (ll i = 0; i < n; ++i) {
      if (cnts[i] == result) {
        cout << i << "\n";
      }
    }
  }
  cout << "\n";
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