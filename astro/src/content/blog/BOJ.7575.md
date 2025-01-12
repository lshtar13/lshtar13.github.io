---
title: '7575 BOJ'
description: '바이러스'
pubDate: 'Dec 05 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS","KMP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/7575)

## 접근

KMP 알고리즘을 이용해 해결하였다.

첫번째 문자열을 기준으로 생성가능한 길이 K의 모든 부분 문자열을 대상으로 순서대로 혹은
역순으로 선택하여 다른 문자열에 포함되어 있는지 KMP로 검색한다.

다만, 문제 해석에 있어 조금의 생각이 필요했다.
공통 문자열 최소 길이가 K라 나와 있는데, 길이가 K인 부분 문자열들만 검색해도
최소 길이 조건을 만족시키니 다른 길이의 부분 문자열을 검색하지 않아도 된다.
이것을 간파하지 못해 시간 낭비를 많이 했다.

백준에서 플5 ~ 골3 랜덤 디펜스를 시작하였다.
지금까지는 [특정 문제 추천 사이트](https://algorithm.tony9402.com/)을 이용했는데,
요새 사이트가 먹통이 되어서 랜덤 디펜스를 시작하였다.

문자열 문제를 많이 안풀었어서 풀이에 시간이 좀 오래 걸렸다.
앞으로 나아지길 기대한다.

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

cll N = 100, K = 1000, M = 1000;
ll n, k;
vll programs[N];
ll results[N][M] = {{}};
vll tgts[2][M], pis[2][M];

void addPi(vll &tgt, vll &pi, ll num) {
  ll _pi = pi.back();
  while (_pi > 0 && num != tgt[_pi]) {
    _pi = pi[_pi - 1];
  }

  pi.emplace_back(num == tgt[_pi] ? _pi + 1 : 0);
}

bool kmp(vll &src, vll &tgt) {
  vll pi = {0};
  for (auto &t : tgt) {
    addPi(tgt, pi, t);
  }

  ll a = 0, b = 0;
  while (a < src.size()) {
    if (src[a] == tgt[b]) {
      ++a, ++b;
    } else if (!b) {
      ++a;
    } else {
      b = pi[b - 1];
    }

    if (b == tgt.size()) {
      return true;
    }
  }

END:
  return false;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> k;
  for (ll m, i = 0; i < n; ++i) {
    cin >> m;
    programs[i].resize(m);
    for (ll l = 0; l < m; ++l) {
      cin >> programs[i][l];
    }
  }

  vll &src = programs[0];
  for (ll st = 0; st < src.size(); ++st) {
    vll tgt = vll(src.begin() + st, src.begin() + st + k);
    bool result = true;
    for (ll p = 1; result && p < n; ++p) {
      bool _result = false;
      _result |= kmp(programs[p], tgt);
      reverse(tgt.begin(), tgt.end());
      _result |= kmp(programs[p], tgt);
      result &= _result;
    }

    if (result) {
      cout << "YES" << "\n";
      goto END;
    }
  }

  cout << "NO\n";
END:

  return 0;
}
```