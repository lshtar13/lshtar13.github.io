---
title: '11003 BOJ'
description: '최솟값 찾기'
pubDate: 'Jul 31 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Deque", "Priority Queue"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/11003)

## 접근

덱 혹은 우선순위 큐를 이용해 해결할 수 있는 문제이다.

가장 작은 원소를 log(n)이내에 구할 수 있는 자료구조에 항상 범위 내의 원소만 저장하는 것이 핵심이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)
#define IFOR(i, a, A) for (ll i = a; i >= A; --i)

typedef pair<int, int> pii;
cll N = 5e6, L = 5e6;
ll n, l;

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  //  cin >> n >> l;
  //  priority_queue<pii, vector<pii>, greater<pii>> pq;
  //  FOR(i, 0, n) {
  //    ll num, bound = max(ll(0), i - l + 1);
  //    cin >> num;
  //    pq.push({num, i});
  //    while (pq.top().second < bound) {
  //      pq.pop();
  //    }

  //    cout << pq.top().first << " ";
  //  }
  //  cout << "\n";

  deque<pii> dq;
  cin >> n >> l;
  FOR(i, 0, n) {
    ll num, bound = max(ll(0), i - l + 1);
    cin >> num;
    while (!dq.empty() && dq.back().first > num) {
      dq.pop_back();
    }

    dq.push_back({num, i});
    while (dq.front().second < bound) {
      dq.pop_front();
    }

    cout << dq.front().first << " ";
  }
  cout << "\n";

  return 0;
}
```