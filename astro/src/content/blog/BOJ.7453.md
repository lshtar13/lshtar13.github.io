---
title: '7453 BOJ'
description: '합이 0인 네정수'
pubDate: 'Nov 30 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Two Pointer", "Meet in the Middle"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/7453)

## 접근

투포인터와 meet in the middle 알고리즘을 이용해 해결하였다.

모든 경우를 bruteforce로 해결하는 접근은 시간복잡도가 $O(n^4)$이기은 부적합하다.
네 개의 배열을 둘 씩 나눠 계산하고 합치는 전략은 시간복잡도를 크게 아낄 수 있다.
A와 B의 각 원소들의 합 $n^2$개 그리고 C와 D의 각 원소들의 합 $n^2$개를 구한 후, 이들 $2n^2$개 원소에 대하여
서로 다른 집합에서 원소를 하나씩 선택해 두 원소를 더했을 때 합이 0이 되는 경우때 구하면 된다.

1. A와 B에서 각각 하나의 원소를 선택해 더한 값 $n^2$개를 배열 AB에 저장한다.
2. C와 D에서 각각 하나의 원소를 선택해 더한 값 $n^2$개를 배열 CD에 저장한다.
3. AB와 CD를 정렬한다.
4. AB는 뒤에서부터, CD는 앞에서부터 탐색하며 두 원소의 합이 0이 되는 경우를 계산한다.

[solved.ac](https://solved.ac/problems)에서 우연히 고른 문제였는데, 전에 풀다가 포기한 문제였다.
그 이후로 합이 0이되는 형태의 문제를 몇 번 풀었고 투포인터 문제도 몇 번 풀었는데
해당 경험들이 이 문제를 푸는 데 도움이 많이 되었다.
특히 투포인터로 AB와 CD를 탐색할 때, 중복되는 경우를 처리하는 데 있어 큰 도움이 되었다.

# 코드

```c++
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

cll N = 4000;
ll n, A[N] = {}, B[N] = {}, C[N] = {}, D[N] = {}, AB[N * N] = {},
      CD[N * N] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> A[i] >> B[i] >> C[i] >> D[i];
  }

  FOR2(i, l, n, n) {
    AB[i * n + l] = A[i] + B[l];
    CD[i * n + l] = C[i] + D[l];
  }

  sort(AB, AB + n * n);
  sort(CD, CD + n * n);

  ll result = 0, ab = n * n - 1, cd = 0;
  while (ab >= 0 && cd < n * n) {
    ll sum = AB[ab] + CD[cd], nab, ncd;
    if (sum == 0) {
      nab = 1, ncd = 1;
      while (ab - nab >= 0 && AB[ab] == AB[ab - nab]) {
        ++nab;
      }
      while (cd + ncd < n * n && CD[cd] == CD[cd + ncd]) {
        ++ncd;
      }
      result += nab * ncd, ab += nab, cd += ncd;
    } else if (sum < 0) {
      ++cd;
    } else {
      --ab;
    }
  }

  cout << result << "\n";

  return 0;
}
```