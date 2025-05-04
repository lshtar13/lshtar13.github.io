---
title: '1994 BOJ'
description: '등차수열'
pubDate: 'Mar 13 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP", "Binary Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1994)

## 접근

다이내믹 프로그래밍과 이분 탐색을 이용해 해결하였다.

등차수열을 결정하기 위해선 초기 세 원소가 필요하다는 점을 이용해 해결하였다.
find(first, second) 함수는 첫번째와 두번째 원소를  지정하였을 때, 그 뒤로 등차수열을 이루는 원소가 몇개나 존재하는지 반환하는 함수이다.
세번째 원소를 찾기 위해 이분탐색을 활용하였고, 세번째 원소 이후의 길이는 find(second, third)을 재귀적으로 활용함으로써 구하였다.
find()를 사용함에 있어 dp 배열을 통한 메모이제이션을 수행해 시간 복잡도를 줄였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 2000, NUM = 1e9;
ll n, nums[N] = {}, dp[N][N] = {{}};

ll find(ll fst, ll snd) {
  if (dp[fst][snd] != -1) {
    return dp[fst][snd];
  }

  dp[fst][snd] = 2;
  ll nxt = nums[snd] + nums[snd] - nums[fst];
  ll pos = lower_bound(nums + snd + 1, nums + n, nxt) - nums;
  if (pos < n && nums[pos] == nxt) {
    dp[fst][snd] = find(snd, pos) + 1;
  }

  return dp[fst][snd];
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);
  memset(dp, -1, sizeof(dp));

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> nums[i];
  }
  sort(nums, nums + n);
  
  ll result = 1;
  for (ll fst = 0; fst < n; ++fst) {
    for (ll snd = fst + 1; snd < n; ++snd) {
      result = max(result, find(fst, snd));
    }
  }

  cout << result << "\n";

  return 0;
}
```