---
title: '5419 BOJ'
description: '북서풍'
pubDate: 'Jun 17 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Sweeping", "Segment Tree", "Coordinate Compression"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/5419)

## 접근

좌표 압축과 세그먼트 트리를 이용해 해결하였다.

x좌표가 증가하는 방향으로, y좌표가 감소하는 방향으로 좌표들을 정렬한 후 맨 앞 좌표부터 조사하였다.
세그먼트 트리에는 y좌표의 개수를 기록한다.
x좌표가 증가하는 방향이므로 그 이전에 세그먼트 트리에 기록된 좌표들은, x축에 한해선 짝지어질 수 있는 좌표들이다.
세그먼트 트리를 이용해 현재 추가되는 좌표보다 y좌표가 큰 좌표들의 개수를 세면 해당 개수가 짝지어질 수 있는 전체 좌표들의 개수이다.
어려운 문제이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<ll> qll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 75e3, X = 1e9, Y = 1e9;
ll n, segs[N * 15] = {}, ycords[N] = {};
pll cords[N];

ll update(ll node, ll st, ll en, ll num, ll amnt) {
  segs[node] += amnt;
  if (st == en) {
    return segs[node] - amnt;
  }

  ll mid = (st + en) / 2;
  if (num <= mid) {
    return update(node * 2, st, mid, num, amnt) + segs[node * 2 + 1];
  } else {
    return update(node * 2 + 1, mid + 1, en, num, amnt);
  }
}

bool comp(pll &a, pll &b) {
  if (a.first != b.first) {
    return a.first < b.first;
  } else {
    return a.second > b.second;
  }
}

ll solve() {
  map<ll, ll> indexs;
  cin >> n;
  FOR(i, n) {
    cin >> cords[i].first >> cords[i].second;
    indexs[cords[i].second] = 1;
  }

  ll idx = 0;
  for (auto &p : indexs) {
    indexs[p.first] = ++idx;
  }

  ll result = 0;
  sort(cords, cords + n, comp);
  memset(segs, 0, sizeof(segs));
  FOR(i, n) { result += update(1, 0, N, indexs[cords[i].second], 1); }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    cout << solve() << "\n";
  }

  return 0;
}
```