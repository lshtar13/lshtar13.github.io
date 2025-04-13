---
title: '6549 BOJ'
description: '히스토그램에서 가장 큰 직사각형'
pubDate: 'Apr 13 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree", "Divide and Conquer", "Monotone Stack"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/6549)

## 접근

세그먼트 트리와 분할 정복을 이용해 해결하였다.

가장 큰 직사각형의 넓이는 분할 정복을 이용해 구하였다.
어떤 구간에 대하여 가장 큰 직사각형의 넓이는,
해당 구간의 가장 작은 높이와 구간의 너비를 곱한 값과
가장 작은 높이를 갖는 인덱스를 기준으로 나눈 두 구간의 가장 큰 직사각형의 넓이들 총 3개의 직사각형의 넓이 중 최댓값이다.
구간 내에서 최소 값을 갖는 인덱스는 세그먼트 트리를 이용해 빠르게 탐색할 수 있게 하였다.

이러한 방법 외에도 스택을 활용한 방법이 있다.
이 방법이 시간 복잡도 면에서 가장 나은 방법이다.
모노톤 스택을 유지하면서, 원소가 pop될때 직사각형의 넓이를 계산하는 방식으로 구하면 된다.
모노톤 스택을 유지하게 되면, push될 원소와 top에 위치한 원소 사이에 가장 작은 원소가 top에 위치한 원소임을 이용하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e5, H = 1e9;
ll n, heights[N + 1] = {}, segs[N * 10] = {};

ll update(ll node, ll idx0, ll idx1, ll idx) {
  if (idx < idx0 || idx > idx1) {
    return segs[node];
  } else if (idx0 == idx1) {
    return segs[node] = idx;
  }

  ll mid = (idx0 + idx1) / 2, left = update(node * 2, idx0, mid, idx),
     right = update(node * 2 + 1, mid + 1, idx1, idx);

  if (heights[left] < heights[right]) {
    return segs[node] = left;
  } else {
    return segs[node] = right;
  }
}

ll query(ll node, ll idx0, ll idx1, ll st, ll en) {
  if (idx1 < st || idx0 > en) {
    return 0;
  } else if (idx0 >= st && idx1 <= en) {
    return segs[node];
  }

  ll mid = (idx0 + idx1) / 2, left = query(node * 2, idx0, mid, st, en),
     right = query(node * 2 + 1, mid + 1, idx1, st, en);
  if (heights[left] < heights[right]) {
    return left;
  } else {
    return right;
  }
}

void initialize() {
  memset(heights, 0, sizeof(heights));
  memset(segs, 0, sizeof(segs));

  heights[0] = H + 1;
  update(1, 0, n, 0);
}

ll findMax(ll st, ll en) {
  if (st == en) {
    return heights[st];
  } else if (st > en) {
    return 0;
  }

  ll minIdx = query(1, 0, n, st, en);
  ll result = heights[minIdx] * (en - st + 1);
  result = max(result, findMax(st, minIdx - 1));
  result = max(result, findMax(minIdx + 1, en));

  return result;
}

ll solve() {
  initialize();
  for (ll i = 1; i <= n; ++i) {
    cin >> heights[i];
    update(1, 0, n, i);
  }

  return findMax(1, n);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  for (; cin >> n && n;) {
    cout << solve() << '\n';
  }

  return 0;
}
```