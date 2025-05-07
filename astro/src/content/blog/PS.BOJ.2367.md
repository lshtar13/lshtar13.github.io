---
title: '2367 BOJ'
description: '파티'
pubDate: 'May 07 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Edmonds-Karp", "BFS", "Breadth-First Search", "Network Flow"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2367)

## 접근

최대유량 알고리즘을 이용해 해결하였다.

음식과 참가자를 노드로 설정하여 최대 유량 알고리즘을 적용하였다.
Source과 음식 사이에 해당 음식에 대한 제한에 따른 간선을 설정하였고,
음식과 참가자 사이를 용량이 1인 간선으로 연결하였다.
이후 용량이 k인 간선으로 참가자와 sink간의 사이를 연결하였다.
기본적인 최대 유량 알고리즘 문제이다. 아직 에드몬드-카프는 다른 포스팅을 참고하지 않고 구현하기 어려운 듯 하다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef queue<ll> qll;

cll N = 200, K = 5, D = 100, NODE = 302, INF = N * K + 1;
ll n, k, d, source = 0, foodStart = 1, memberStart, sink,
            cap[NODE][NODE] = {{}}, flow[NODE][NODE] = {{}};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> k >> d;
  memberStart = foodStart + d, sink = memberStart + n;
  for (ll food = foodStart, limit; food < foodStart + d; ++food) {
    cin >> limit;
    cap[source][food] = limit;
  }
  for (ll member = memberStart, nkind; member < memberStart + n; ++member) {
    cin >> nkind;
    for (ll i = 0, food; i < nkind; ++i) {
      cin >> food;
      cap[food][member] = 1;
    }
    cap[member][sink] = k;
  }

  ll result = 0;
  while (true) {
    ll parents[NODE] = {};
    memset(parents, -1, sizeof(parents));
    parents[source] = source;
    qll q;
    q.push(source);

    for (ll node; !q.empty() && parents[sink] == -1;) {
      node = q.front();
      q.pop();

      for (ll av = source; av <= sink; ++av) {
        if (cap[node][av] - flow[node][av] > 0 && parents[av] == -1) {
          parents[av] = node;
          q.push(av);
        }
      }
    }

    if (parents[sink] == -1) {
      break;
    }

    ll amount = INF;
    for (ll node = sink; node != source; node = parents[node]) {
      amount =
          min(amount, cap[parents[node]][node] - flow[parents[node]][node]);
    }

    for (ll node = sink; node != source; node = parents[node]) {
      flow[parents[node]][node] += amount;
      flow[node][parents[node]] -= amount;
    }

    result += amount;
  }

  cout << result << "\n";

  return 0;
}
```