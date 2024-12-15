---
title: '1035 BOJ'
description: '조각 움직이기'
pubDate: 'Dec 15 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "DFS", "Breadth-First Search", "Implementation"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1035)

## 접근

조각이 위치해 있을 수 있는 모든 경우의 수를 탐색한다.
BFS를 이용해 서로 인접해 있는지 여부를 파악하고, 만약 서로 인접해 있다면 각 조각들의 거리를 계산해 최솟값을 구한다.

최적화가 심각하게 미비하다. 구현도 이렇게 했다가 저렇게 했다가 많이 바꿔서 난잡하고.
예제를 돌렸을 때 육안으로도 느리게 실행되는 것을 볼 수 있어서 통과가 안되겠거니 하고 포기하려 했으나
예상과는 다르게 AC를 받아 의아한 문제이다.

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

cll N = 5, directions[4][2] = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
ll nCord, result = 50;
vpll cords;

bool isValidCord(ll i, ll l) { return i >= 0 && i < 5 && l >= 0 && l < 5; }

bool isValidStatus(ll st, ll tgts[][N]) {
  ll nConnected = 1;
  qll q;
  q.push(st);
  tgts[q.front() / N][q.front() % N] = 0;
  while (!q.empty()) {
    ll i = q.front() / N, l = q.front() % N;
    q.pop();

    for (auto &d : directions) {
      ll _i = i + d[0], _l = l + d[1];
      pll next(_i, _l);
      if (!isValidCord(_i, _l) || !tgts[_i][_l]) {
        continue;
      }

      ++nConnected;
      q.push(_i * N + _l);
      tgts[_i][_l] = 0;
    }
  }

  return nConnected == nCord;
}

ll calc(ll idx, ll tgt) {
  ll i = cords[idx].first, l = cords[idx].second;
  ll _i = tgt / N, _l = tgt % N;

  return abs(i - _i) + abs(l - _l);
}

void search(vll &v, ll status) {
  if (v.size() == nCord) {
    ll tgts[N][N] = {{}}, dist = 0;
    for (auto &p : v) {
      tgts[p / N][p % N] = 1;
    }
    if (!isValidStatus(v.front(), tgts)) {
      return;
    }

    ll i = 0;
    for (auto &p : v) {
      dist += calc(i++, p);
    }
    result = min(result, dist);
    return;
  }

  for (ll i = 0; i < N * N;) {
    if (status & (1 << i)) {
      goto END;
    }
    status &= (1 << i);
    v.emplace_back(i);
    search(v, status);
    v.pop_back();
    status ^= (1 << i);
  END:
    ++i;
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  for (ll i = 0; i < 5; ++i) {
    for (ll l = 0; l < 5; ++l) {
      char c;
      cin >> c;
      if (c == '*') {
        ++nCord;
        cords.emplace_back(make_pair(i, l));
      }
    }
    cin.ignore();
  }

  vll status;
  search(status, 0);
  cout << result << "\n";

  return 0;
}
```