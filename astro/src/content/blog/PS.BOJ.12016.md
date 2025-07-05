---
title: '12016 BOJ'
description: '라운드 로빈 스케쥴러'
pubDate: 'Jul 05 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree", "Offline Query"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/12016)

## 접근

오프라인 쿼리와 세그먼트 트리를 이용해 해결하였다.

마치 지금껏 공부해온 자료구조와 문제 해결 기술을 일괄적으로 점검해보는 듯한 문제였다.
요세푸스 문제가 생각나는 문제 구성으로, 순차적으로 제거되는 것이 아니라 주어진 시간이 가장 짧은 순서대로 제거된다는 점에서
오프라인 쿼리를 이용하게끔 한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 1e5, Time = 1e9;
ll n, segs[N * 10] = {}, results[N] = {};
pll durs[N];

ll query(ll node, ll st, ll en, ll idx) {
  if (idx < st) {
    return 0;
  } else if (en <= idx) {
    return segs[node];
  }

  ll mid = (st + en) / 2;
  return query(node * 2, st, mid, idx) + query(node * 2 + 1, mid + 1, en, idx);
}

void add(ll node, ll st, ll en, ll idx) {
  if (idx < st || idx > en) {
    return;
  }

  ++segs[node];
  ll mid = (st + en) / 2;
  if (st < en && idx <= mid) {
    add(node * 2, st, mid, idx);
  } else if (idx > mid) {
    add(node * 2 + 1, mid + 1, en, idx);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  FOR(i, n) {
    cin >> durs[i].first;
    durs[i].second = i;
  }
  sort(durs, durs + n);

  FOR(i, n) {
    static ll cur = 1, sum = 0, offset = 0, idx, dur;
    tie(dur, idx) = durs[i];

    if (cur != dur) {
      sum += (dur - cur - 1) * (n - i) + n - i + offset, cur = dur, offset = 0;
    }

    results[idx] = idx + 1 - query(1, 0, n - 1, idx) + sum + offset;
    add(1, 0, n - 1, idx);
    ++offset;
  }

  FOR(i, n) { cout << results[i] << "\n"; }

  return 0;
}
```