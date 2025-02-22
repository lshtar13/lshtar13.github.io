---
title: '9463 BOJ'
description: '순열 그래프'
pubDate: 'Feb 22 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree", "Counting Inversions"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/9463)

## 접근

Counting inversions 문제이다. 세그먼트 트리를 이용해 해결하였다.

먼저 주어진 순열의 순서를 기준으로 아래 순열의 반전 여부를 조사하였다.
아래 순열의 i번째 원소가 윗 순열에선 l번째 일 때,
이전까지 세그먼트 트리에서 l부터 n-1까지의 원소들이 몇개 등장했는지 조사한다.
i번째 원소를 추가함으로써 해당 원소의 개수만큼 반전이 발생한 것이다.

찾아보니 counting inversions를 세그먼트 트리말고 머지 소트를 이용해 해결하는 방법도 있는 것을 알게 되었다.
처음 counting inversions 문제를 보았을 때 생각해낸 풀이가 세그먼트 트리인지라
다른 counting inversions 문제들을 보았을 때도 계속 세그먼트 트리로 풀게끔 사고하게 되는 것 같다.
머지 소트를 이용한 풀이가 조금 더 깔끔해 보인다. 구현도 적고.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e5;
ll idxs[N + 1] = {}, segs[N * 10] = {};

ll sum(ll node, ll st, ll en, ll idx) {
  ll mid = (st + en) / 2, result;
  if (idx <= st) {
    result = segs[node];
  } else if (idx > en) {
    result = 0;
  } else {
    result = sum(node * 2, st, mid, idx) + sum(node * 2 + 1, mid + 1, en, idx);
  }

  if (st <= idx && idx <= en) {
    ++segs[node];
  }

  return result;
}

ll solve() {
  ll n, result = 0;
  cin >> n;

  memset(idxs, 0, sizeof(idxs));
  memset(segs, 0, sizeof(segs));
  for (ll num, i = 0; i < n; ++i) {
    cin >> num;
    idxs[num] = i;
  }

  for (ll num, i = 0; i < n; ++i) {
    cin >> num;
    result += sum(1, 0, n - 1, idxs[num]);
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    cout << solve() << '\n';
  }

  return 0;
}
```