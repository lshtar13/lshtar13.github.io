---
title: '15678 BOJ'
description: '연세워터파크'
pubDate: 'Apr 03 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/15678)

## 접근

다이내믹 프로그래밍과 세그먼트 트리를 이용해 해결하였다.

dp[i]는 i번째에서 시작하여 인덱스가 증가하는 방향으로만 징검다리를 건넜을 때 가질 수 있는 최대 점수이다.
dp[i]는 dp[i+1] ... d[i+d] 중 최댓값 혹은 0 중에 큰 수와 scores[i]를 더한 값이 된다.
주어진 범위 내에서의 최댓값을 구하기 위해 세그먼트 트리를 사용하였다.
세그먼트 트리외에 우선순위 큐나 덱을 사용하면 최댓값을 보다 빠르게 찾을 수 있다.
d가 불변이라 가능한 방법인 것 같다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e5, D = N - 1, K = 1e9;
ll n, d, scores[N] = {}, dp[N] = {}, segs[N * 10] = {};

ll update(ll node, ll idx0, ll idx1, ll idx, ll num) {
  if (idx < idx0 || idx > idx1) {
    return segs[node];
  } else if (idx0 == idx1) {
    return segs[node] = num;
  }

  ll mid = (idx0 + idx1) / 2;
  return segs[node] = max(update(node * 2, idx0, mid, idx, num),
                          update(node * 2 + 1, mid + 1, idx1, idx, num));
}

ll query(ll node, ll idx0, ll idx1, ll st, ll en) {
  if (en < idx0 || st > idx1) {
    return -K - 1;
  } else if (st <= idx0 && en >= idx1) {
    return segs[node];
  }

  ll mid = (idx0 + idx1) / 2;
  return max(query(node * 2, idx0, mid, st, en),
             query(node * 2 + 1, mid + 1, idx1, st, en));
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> d;
  for (ll i = 0; i < n; ++i) {
    cin >> scores[i];
  }

  memset(segs, 0xcfcfcfcf, sizeof(segs));

  ll result = -K - 1;
  dp[n - 1] = scores[n - 1];
  update(1, 0, n - 1, n - 1, dp[n - 1]);
  for (ll i = n - 2; i >= 0; --i) {
    dp[i] =
        scores[i] + max(ll(0), query(1, 0, n - 1, i + 1, min(n - 1, i + d)));
    update(1, 0, n - 1, i, dp[i]);
  }

  cout << query(1, 0, n - 1, 0, n - 1) << "\n";

  return 0;
}
```