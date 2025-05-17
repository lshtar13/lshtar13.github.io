---
title: '14572 BOJ'
description: '스터디 그룹'
pubDate: 'May 17 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Greedy", "Two Pointer"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/14572)

## 접근

투포인터와 그리디 알고리즘을 이용해 해결하였다.

실력차에 대한 제한이 없을 경우, 그룹원은 많을 수록 효율성이 증대된다.
따라서, 실력에 따라 오름차순으로 정렬한 이후 실력차가 d 이하인 조합들을 투포인터로 조사하면서
해당 범위들에 대한 효율성을 계산해 최댓값을 구한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;

cll N = 1e5, K = 30, D = 1e9;
ll n, k, d, comp[K] = {}, nmember = 0;
pll abils[N] = {};
bool algos[N][K] = {{}};

ll join(ll idx) {
  ++nmember;
  idx = abils[idx].second;
  pll result = {0, 0};
  for (ll algo = 0; algo < k; ++algo) {
    comp[algo] += algos[idx][algo];

    if (comp[algo]) {
      ++result.first;
    }

    if (comp[algo] == nmember) {
      ++result.second;
    }
  }

  return (result.first - result.second) * nmember;
}

ll disjoin(ll idx) {
  --nmember;
  idx = abils[idx].second;
  pll result = {0, 0};
  for (ll algo = 0; algo < k; ++algo) {
    comp[algo] -= algos[idx][algo];

    if (comp[algo]) {
      ++result.first;
    }

    if (comp[algo] == nmember) {
      ++result.second;
    }
  }

  return (result.first - result.second) * nmember;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> k >> d;
  for (ll i = 0, nalgo, abil; i < n; ++i) {
    cin >> nalgo >> abil;
    abils[i] = {abil, i};
    for (ll l = 0, algo; l < nalgo; ++l) {
      cin >> algo;
      algos[i][--algo] = true;
    }
  }

  sort(abils, abils + n);

  ll result = join(0);
  for (ll st = 0, en = 1, nresult; en < n; ++en) {
    while (st < en && abils[en].first - abils[st].first > d) {
      disjoin(st++);
    }

    result = max(result, join(en));
  }

  cout << result << "\n";

  return 0;
}
```