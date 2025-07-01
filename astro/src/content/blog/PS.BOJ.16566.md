---
title: '16566 BOJ'
description: '카드 게임'
pubDate: 'Jul 01 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Binary Search", "Disjoint Set"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/16566)

## 접근

분리 집합을 이용해 해결하였다.
자기 자신을 포함해 남아 있는 카드 중 자신보다 크거나 같은 카드를 parent로 설정하였다.
이러한 분리 집합 외에도 정렬된 배열을 set으로 만들어 해결하거나 세그먼트 트리를 이용해 해결할 수 있다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ull, ull> pull;
typedef const ll cll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 4e6, M = 4e6, K = 1e4;
ll n, m, k, cards[M] = {}, parents[N + 2] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> k;
  FOR(i, m) { cin >> cards[i]; }
  sort(cards, cards + n);
  set<ll> s(cards, cards + n);

  FOR(i, k) {
    ll num;
    cin >> num;
    cout << (num = *s.upper_bound(num)) << "\n";
    s.extract(num);
  }

  return 0;
}
```

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 4e6, M = 4e6, K = 1e4;
ll n, m, k, cards[M] = {}, parents[N + 2] = {};

ll ascend(ll node) {
  if (node == parents[node]) {
    return node;
  }

  return parents[node] = ascend(parents[node]);
}

inline void merge(ll node, ll to) { parents[ascend(node)] = to; }

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> k;
  FOR(i, m) {
    cin >> cards[i];
    parents[cards[i]] = cards[i];
  }

  for (ll num = n + 1, parent; num >= 0; --num) {
    if (parents[num] == num) {
      parent = num;
    } else {
      parents[num] = parent;
    }
  }

  FOR(i, k) {
    ll num;
    cin >> num;
    cout << (num = ascend(num + 1)) << "\n";
    merge(num, num + 1);
  }

  return 0;
}
```