---
title: '2172 BOJ'
description: '팰린드롬 경로'
pubDate: 'May 31 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2172)

## 접근

다이내믹 프로그래밍으로 해결하였다.

dp[src][dst][len]은 src에서 dst까지의 len의 길이를 갖는 팰린드롬 경로의 개수를 기록한다.
src와 dst의 숫자가 다를 경우, dp의 값은 0이다.
이외의 경우, dp[src][dst][len]은 src의 인접 칸에서 dst의 인접 칸까지 len-2의 길이를 갖는 팰린드롬의 경로의 개수 합과 같다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;

cll N = 20, Len = 20, directions[8][2] = {{0, 1}, {0, -1}, {1, 0},  {-1, 0},
                                          {1, 1}, {1, -1}, {-1, 1}, {-1, -1}};
ll n, length, nums[N * N] = {{}}, dp[N * N][N * N][Len + 1] = {{{}}};

inline bool isValidCord(ll i, ll l) {
  return i >= 0 && i < n && l >= 0 && l < n;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> length;
  for (ll i = 0; i < n; ++i) {
    for (ll l = 0; l < n; ++l) {
      cin >> nums[i * n + l];
    }
  }

  for (ll src = 0; src < n * n; ++src) {
    dp[src][src][1] = 1;
  }

  for (ll src = 0; src < n * n; ++src) {
    ll si = src / n, sl = src % n;
    for (auto &d : directions) {
      ll di = si + d[0], dl = sl + d[1], dst = di * n + dl;
      if (!isValidCord(di, dl) || nums[src] != nums[dst]) {
        continue;
      }

      dp[src][dst][2] = 1;
    }
  }

  for (ll len = 3; len <= length; ++len) {
    for (ll src = 0; src < n * n; ++src) {
      for (ll dst = 0; dst < n * n; ++dst) {
        ll &value = dp[src][dst][len] = 0;
        if (nums[src] != nums[dst]) {
          continue;
        }

        ll si = src / n, sl = src % n, di = dst / n, dl = dst % n;
        for (auto &d : directions) {
          ll nsi = si + d[0], nsl = sl + d[1], nsrc = nsi * n + nsl;
          if (!isValidCord(nsi, nsl)) {
            continue;
          }

          for (auto &d : directions) {
            ll ndi = di + d[0], ndl = dl + d[1], ndst = ndi * n + ndl;
            if (!isValidCord(ndi, ndl)) {
              continue;
            }

            value += dp[nsrc][ndst][len - 2];
          }
        }
      }
    }
  }

  ll result = 0;
  for (ll src = 0; src < n * n; ++src) {
    for (ll dst = 0; dst < n * n; ++dst) {
      result += dp[src][dst][length];
    }
  }

  cout << result << "\n";

  return 0;
}
```