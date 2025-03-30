---
title: '12846 BOJ'
description: '무서운 아르바이트'
pubDate: 'Mar 30 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree", "Divide and Conquer"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/12846)

## 접근

세그먼트 트리와 분할 정복으로 해결하였다.

세그먼트 트리를 사용해야 한다는 점은 스스로 파악하였으나 그것을 어떻게 활용해야 할지 몰라 다른 사람들의 풀이를 참고하여 풀었다.
세그먼트 트리에 저장해야 하는 것은 최솟값이 아니라 최솟값의 인덱스를 저장해야 한다.
어떤 구간에 대하여 최솟값의 인덱스를 기준으로 잘라 분할 정복해야 유의미하기 때문이다.
만약, 다른 인덱스를 기준으로 잘라 조사하게 되면 기존 값보다 작거나, 크더라도 최적의 최댓값을 구할 수 없기 때문이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e5, T = 1e6;
ll n, segs[N * 10] = {}, salaries[N + 1] = {};

ll update(ll node, ll idx0, ll idx1, cll idx) {
  if (idx < idx0 || idx > idx1) {
    return segs[node];
  } else if (idx0 == idx1) {
    return segs[node] = idx;
  }

  ll mid = (idx0 + idx1) / 2;
  ll left = update(node * 2, idx0, mid, idx),
     right = update(node * 2 + 1, mid + 1, idx1, idx);

  if (salaries[left] < salaries[right]) {
    return segs[node] = left;
  } else {
    return segs[node] = right;
  }
}

ll query(ll node, ll idx0, ll idx1, cll st, cll en) {
  if (en < idx0 || st > idx1) {
    return 0;
  } else if (st <= idx0 && en >= idx1) {
    return segs[node];
  }

  ll mid = (idx0 + idx1) / 2;
  ll left = query(node * 2, idx0, mid, st, en),
     right = query(node * 2 + 1, mid + 1, idx1, st, en);
  if (salaries[left] < salaries[right]) {
    return left;
  } else {
    return right;
  }
}

ll findMax(ll l, ll r) {
  if (l > r) {
    return 0;
  }

  ll minIdx = query(1, 1, n, l, r),
     totalSalary = salaries[minIdx] * (r - l + 1);
  totalSalary = max(totalSalary, findMax(l, minIdx - 1));
  totalSalary = max(totalSalary, findMax(minIdx + 1, r));

  return totalSalary;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  salaries[0] = T + 1;

  cin >> n;
  ll result = 0;
  for (ll i = 1; i <= n; ++i) {
    cin >> salaries[i];
    update(1, 1, n, i);
  }

  cout << findMax(1, n) << "\n";

  return 0;
}
```