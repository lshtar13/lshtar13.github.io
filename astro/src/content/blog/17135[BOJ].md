---
title: '17135 BOJ'
description: '캐슬 디펜스'
pubDate: 'Dec 02 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Brute Force"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/17135)

## 접근

브루트 포스 알고리즘으로 해결하였다.

탐색해야하는 범위가 작아서, 완전 탐색으로도 시간 초과없이 해결할 수 있었다.
궁수도 3명만 고려하면 되기 때문에 부담이 적었다.

궁수 위치의 모든 조합에 대하여 탐색을 시도하였다.
궁수 위치를 바탕으로, 모든 타겟들의 거리를 계산한다.
Step 별로, 거리를 재계산하여 제외할 타겟을 선택한다.
이때, 다른 궁수에 의해 이미 제거된 타겟을 제거하지 않도록 주의해야 한다.

처음에 허술하게 계산하여 기워넣기 식으로 코드를 짜다 보니, 너덜너덜한 코드가 완성되었다.
우선순위 큐도 사실은 이용할 필요가 딱히 없는데, 사용하게 되었다.
조금 더 생각하고 풀이를 시작하는 습관을 들일 필요가 있다.

요새 solved.ac에서 골드 2 ~ 3의 안풀어본 문제들을 '푼 사람' 많은 순으로 하나씩 풀어보고 있는데,
확실히 그래프나 구현 유형의 문제들이 인기가 좋은 것 같다.

# 코드

```c++
#include <bits/stdc++.h>
#include <tuple>

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

typedef tuple<ll, ll, ll> tll;

cll N = 15, M = 15, D = 10;
ll n, m, d;
vpll enemies;

ll find(ll archers[]) {
  map<pll, ll> result;
  priority_queue<tll, vector<tll>, greater<tll>> pqs[3];

  for (const auto &e : enemies) {
    for (ll di = n - e.first, dl, idx = 0; idx < 3; ++idx) {
      dl = abs(archers[idx] - e.second);
      pqs[idx].push(make_tuple(di + dl, e.second, e.first));
    }
  }

  for (ll step = 0; step < n + 1; ++step) {
    ll dist, i, l;
    pll cords;
    for (auto &pq : pqs) {
    AGAIN:
      if (pq.empty()) {
        continue;
      }

      tie(dist, l, i) = pq.top();
      cords = make_pair(i, l);
      if (i + step >= n ||
          (result.find(cords) != result.end() && result[cords] < step)) {
        pq.pop();
        goto AGAIN;
      }
      if (dist > d + step) {
        continue;
      }

      pq.pop();
      result[cords] = step;
    }
  }

  return result.size();
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> d;
  FOR2(i, l, n, m) {
    ll value;
    cin >> value;
    if (value) {
      enemies.emplace_back(make_pair(i, l));
    }
  }

  ll result = 0;
  for (ll i = 0; i < m; ++i) {
    for (ll l = i + 1; l < m; ++l) {
      for (ll j = l + 1; j < m; ++j) {
        ll archers[3] = {i, l, j};
        result = max(result, find(archers));
      }
    }
  }

  cout << result << '\n';

  return 0;
}
```