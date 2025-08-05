---
title: '1572 BOJ'
description: '중앙값'
pubDate: 'Aug 05 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Priority Queue", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1572)

## 접근

우선순위 큐를 이용해 해결하였다.
[#1655](https://www.acmicpc.net/problem/1655)에 슬라이딩 윈도우를 추가하여,
범위에서 벗어난 값을 어떻게 처리해줄지 조금 더 고민하면 되는 문제이다.
큐의 크리를 작게 유지하기 위해선 범위에서 벗어난 값이 큐의 top에 등장할 때마다 제거를 해줘야 한다.

세그먼트 트리를 이용해 범위내에서 등장한 값들의 빈도수를 저장하고
매개 변수 탐색을 통하여 중앙값을 구하는 식의 풀이도 가능하다.
시간 측면에서 30ms 정도 더 빠른 해결책이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef priority_queue<pll> pqpll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)

cll N = 25e4, K = 5e3;
ll n, k;
bool isLeft[N] = {};
pqpll pq0;
priority_queue<pll, vpll, greater<pll>> pq1;

ll push(ll num) {
  static ll idx = 0, nleft = 0, nright = 0;
  pq0.push({num, idx});
  isLeft[idx] = true;

  if (idx >= k) {
    if (isLeft[idx - k]) {
      ++nleft;
    } else {
      ++nright;
    }
  }

  while (pq1.empty() || pq0.top().first > pq1.top().first) {
    ll nnum = pq0.top().first, nidx = pq0.top().second;
    pq0.pop();
    if (nidx <= idx - k) {
      --nleft;
    } else {
      isLeft[nidx] = false;
      pq1.push({nnum, nidx});
    }
  }

  while (pq0.size() - nleft < pq1.size() - nright) {
    ll nnum = pq1.top().first, nidx = pq1.top().second;
    pq1.pop();

    if (nidx <= idx - k) {
      --nright;
    } else {
      isLeft[nidx] = true;
      pq0.push({nnum, nidx});
    }
  }

  while (pq0.size() - nleft > pq1.size() - nright + 1 ||
         pq0.top().second <= idx - k) {
    ll nnum = pq0.top().first, nidx = pq0.top().second;
    pq0.pop();

    if (nidx <= idx - k) {
      --nleft;
    } else {
      isLeft[nidx] = false;
      pq1.push({nnum, nidx});
    }
  }

  return ++idx >= k ? pq0.top().first : 0;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll result = 0;
  cin >> n >> k;
  FOR(i, 0, n) {
    ll num;
    cin >> num;
    result += push(num);
  }

  cout << result << "\n";

  return 0;
}
```