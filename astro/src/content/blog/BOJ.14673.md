---
title: '14676 BOJ'
description: '영우는 사기꾼?'
pubDate: 'Nov 22 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Indegree","Implementation"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/14676)

## 접근

위상정렬의 indegree를 이용해 해결하였다.

아이디어 자체는 어렵지 않으나, 중복 건설이 가능하다는 점에서 구현할 때 애를 좀 먹었다.
set을 이용해 지어진 건물과, 지을 수 있는 건물을 기록하였으나 배열을 이용해 관리해도
충분하였을 것 같다. 오히려 시간을 단축할 수 있었을 것이다.

# 코드

```cpp
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

cll N = 1e5, M = 1e5, K = 1e5;
ll n, m, k, degree[N] = {};
vvll childs(N), parents(N);

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> k;
  FOR1(i, m) {
    ll x, y;
    cin >> x >> y;
    childs[--x].emplace_back(--y);
    parents[y].emplace_back(x);
    ++degree[y];
  }

  set<ll> avail;
  multiset<ll> constructed;
  FOR1(i, n) {
    if (!degree[i]) {
      avail.insert(i);
    }
  }

  FOR1(i, k) {
    ll type, a;
    cin >> type >> a;
    --type, --a;
    if (!type) {
      if (avail.find(a) == avail.end()) {
        cout << "Lier!" << "\n";
        goto END;
      } else {
        constructed.insert(a);
        for (auto &child : childs[a]) {
          if (!avail.count(child) && constructed.count(a) == 1 &&
              !--degree[child]) {
            avail.insert(child);
          }
        }
      }
    } else {
      if (constructed.find(a) == constructed.end()) {
        cout << "Lier!" << "\n";
        goto END;
      } else {
        auto it = constructed.find(a);
        auto cnt = constructed.count(a);
        if (cnt == 0) {
          continue;
          //   goto PRINT;
        }
        constructed.erase(it);

        if (cnt != 1) {
          continue;
          //   goto PRINT;
        }
        for (auto &child : childs[a]) {
          if (avail.erase(child)) {
            ++degree[child];
          }
        }
      }
    }
    //   PRINT:
    //     for (auto &_avail : avail) {
    //       cout << _avail << " ";
    //     }
    //     cout << "\n";
    //     for (auto &_const : constructed) {
    //       cout << _const << " ";
    //     }
    //     cout << "\n";
  }

  cout << "King-God-Emperor" << "\n";

END:

  return 0;
}
```