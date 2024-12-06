---
title: '1208 BOJ'
description: '부분수열의 합 2'
pubDate: 'Dec 06 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS",]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1208)

## 접근

이분 탐색과 중간에서 만나기를 이용해 해결하였다.

모든 부분수열을 한번에 고려하기는 어렵다.
원소의 개수가 최대 40개이기 때문에 2의 40승까지 고려해줘야 하는데
시간 초과를 받기 십상일 것이다.
따라서, 배열을 두개로 쪼개 두 배열의 부분 수열 합을 각각 구하고
하나의 배열을 기준삼아, 어떤 원소에 대하여 합이 s가 되는 다른 배열의 원소 값을
구하는 식으로 풀었다.

처음에는 부분 배열의 합을 구할 때, 비트마스킹을 이용해 해결하였는데
비트마스킹을 인코딩하고 디코딩하는 데 시간이 오래걸려 배열을 이용한 방식으로 바꿔 해결하였다.

또, 원소를 탐색함에 있어 이분탐색을 선택하였더니 중복된 탐색에 의해 시간 지체가 발생하였다.
따라서 중간에서 만나기 알고리즘을 선택하니 시간이 절반으로 줄어들었다. 하지만, 다른 사람들 코드를 보면 아직도 최적화가 덜 된것 같다.

## 코드

```c++
#include <algorithm>
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

cll N = 40, S = 1000000, MAX_KIND = 1 << (N / 2);
ll n, s, nums[N] = {};
vll s0 = {0}, s1 = {0};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> s;
  for (ll i = 0; i < n; ++i) {
    cin >> nums[i];
  }

  for (ll i = 0; i < n / 2; ++i) {
    for (ll l = 0, limit = s0.size(); l < limit; ++l) {
      s0.emplace_back(s0[l] + nums[i]);
    }
  }

  for (ll i = n / 2; i < n; ++i) {
    for (ll l = 0, limit = s1.size(); l < limit; ++l) {
      s1.emplace_back(s1[l] + nums[i]);
    }
  }

  sort(s0.begin(), s0.end());
  sort(s1.begin(), s1.end());

  ll result = 0, idx0 = 0, idx1 = s1.size() - 1;
  while (idx0 < s0.size() && idx1 >= 0) {
    ll sum = s0[idx0] + s1[idx1], _idx0 = idx0, _idx1 = idx1;
    if (sum == s) {
      while (_idx0 < s0.size() && s0[idx0] == s0[_idx0]) {
        ++_idx0;
      }
      while (_idx1 >= 0 && s1[idx1] == s1[_idx1]) {
        --_idx1;
      }

      result += (_idx0 - idx0) * (idx1 - _idx1);
      idx0 = _idx0, idx1 = _idx1;
    } else if (sum > s) {
      --idx1;
    } else {
      ++idx0;
    }
  }

  // ll tgt = s, result = 0;
  // for (ll i = 0; i < s0.size(); ++i) {
  //   tgt = s - s0[i];
  //   auto lo = lower_bound(s1.begin(), s1.end(), tgt),
  //        up = upper_bound(s1.begin(), s1.end(), tgt);
  //   result += (up - lo);
  // }
  if (s == 0) {
    --result;
  }

  cout << result << "\n";

  return 0;
}
```