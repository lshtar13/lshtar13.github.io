---
title: '1989 BOJ'
description: '부분배열 고르기 2'
pubDate: 'May 14 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Set"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1989)

## 접근

Set을 이용해 해결하였다.

이 문제는 [2104](https://www.acmicpc.net/problem/2104)번 문제 그리고
[6549](https://www.acmicpc.net/problem/6549)번 문제와 동일하다.
모노리틱 스택 혹은 세그먼트 트리를 이용한 분할 정복으로 해결할 수 있는 문제들이다.
이번에는 분할정복 아이디어를 변형하여 set을 이용한 해법으로 해결하였다.
수와 인덱스를 결합하여 수를 기준으로 오름차순 정렬을 한다.
작은 수부터 해당 수가 가장 작은 수가 되는 구간을 구하여 해당 구간에 대한 점수를 계산한다.
어떤 수에 대하여 해당 수가 가장 작은 수가 되는 구간을 구하기 위해
이전에 조사한 수의 인덱스들을 set에 저장한다.
이번에 조사하는 수의 인덱스보다 작은 인덱스 중 가장 큰 것과 큰 인덱스 중 가장 작은 것을 구하면 그것이 해당 수가 가장 작은 수가 되는 구간이다.
빠른 탐색을 위해 set을 사용한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<ll> qll;

cll N = 1e5;
ll n, sums[N + 1] = {};
set<ll> minIdxs[2];
pll infos[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0, num; i < n; ++i) {
    cin >> num;
    infos[i] = {num, i};
    sums[i + 1] = sums[i] + num;
  }
  sort(infos, infos + n);

  ll result = -1, st, en;
  qll buf;
  minIdxs[0].insert(1);
  minIdxs[1].insert(-1);
  minIdxs[0].insert(-n);
  minIdxs[1].insert(n);
  for (ll i = 0, num, idx; i < n; ++i) {
    tie(num, idx) = infos[i];

    ll nst = -(*minIdxs[0].upper_bound(-idx)) + 1,
       nen = *minIdxs[1].upper_bound(idx) - 1,
       nresult = (sums[nen + 1] - sums[nst]) * num;

    if (result < nresult) {
      st = nst, en = nen, result = nresult;
    }

    minIdxs[0].insert(-idx);
    minIdxs[1].insert(idx);
  }

  cout << result << "\n";
  cout << st + 1 << " " << en + 1 << "\n";

  return 0;
}
```