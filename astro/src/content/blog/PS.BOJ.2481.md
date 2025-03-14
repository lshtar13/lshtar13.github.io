---
title: '2481 BOJ'
description: '해밍 경로'
pubDate: 'Mar 14 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bitmask", "Breadth-First Search", "BFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2481)

## 접근

BFS와 비트마스크를 이용해 해결하였다.

수를 입력받아 거리가 1인 수쌍을 파악한다.
각 수들에 대하여, 이진법으로 나타냈을 때의 각 비트 중 한개의 비트씩만 반전시킨 수가 입력받은 수에 존재하는 지 여부를 조사한다.
이를 위해서 map 자료형을 이용하여 해당 수의 인덱스를 추적할 수 있게끔 한다.
파악된 내용을 바탕으로 그래프를 구성하고 해당 그래프를 바탕으로 BFS를 수행한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef queue<ll> qll;

cll N = 1e5, K = 30;
ll n, k, nums[N + 1] = {}, m;
vll edges[N + 1];
unordered_set<ll> times;
map<ll, ll> indexes;

string find(ll tgt) {
  ll prvs[N + 1] = {0, -1};
  qll q;
  q.push(1);
  while (!q.empty()) {
    ll node = q.front();
    q.pop();

    if (node == tgt) {
      break;
    }

    for (auto &av : edges[node]) {
      if (prvs[av]) {
        continue;
      }

      q.push(av);
      prvs[av] = node;
    }
  }

  string result;
  if (!prvs[tgt]) {
    result = "-1";
  } else {
    while (tgt != -1) {
      result = to_string(tgt) + " " + result;
      tgt = prvs[tgt];
    }
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> k;
  for (ll i = 1; i <= n; ++i) {
    string str;
    cin >> str;
    for (ll l = 0; l < k; ++l) {
      nums[i] += (1 << l) * (str[k - 1 - l] - '0');
    }

    indexes[nums[i]] = i;
  }

  for (ll i = 0; i < n; ++i) {
    times.insert(1 << i);
  }

  for (ll i = 1; i <= n; ++i) {
    for (ll num, l = 0; l < k; ++l) {
      num = nums[i] ^ (1 << l);
      if (indexes.find(num) != indexes.end()) {
        edges[i].emplace_back(indexes[num]);
      }
    }
  }

  cin >> m;
  for (ll i = 0, tgt; i < m; ++i) {
    cin >> tgt;
    cout << find(tgt) << '\n';
  }

  return 0;
}
```