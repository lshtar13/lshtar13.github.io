---
title: '2494 BOJ'
description: '숫자 맞추기'
pubDate: 'Apr 15 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Back Tracking", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2494)

## 접근

다이내믹 프로그래밍과 역추적을 이용해 해결하였다.

dp[i][l]에는, i번째 이전의 나사들을 지금까지 l번 왼쪽으로 돌렸다면 i번째 나사 이후의 나사들을 정해진 값에 맞추기 위한 최소한의 회전 칸수를 저장한다.
왼쪽으로 돌리는 경우에만 이후 나사들에게 영향을 주고, 왼쪽으로 돌 때는 다같이 돌기 때문에 이전에 어떤 나사에서 얼만큼 돌렸든 왼쪽으로 돌린 총합이 같으면,
이후 나사들의 배열은 같다는 점을 이용한 것이다.

dp[i][l]은 i번째 나사를 왼쪽으로 0 ~ 9 번 돌린 경우, 총 10개의 경우에 대하여 조사하면 구할 수 있다.
왼쪽으로 돌린 후, i번째 나사를 정해진 값에 맞추기 위해 오른 쪽으로 조정한다.
왼쪽으로 돌린 횟수와 오른쪽으로 돌린 횟수 그리고 다음 나사부터 계산한 값(dp[i+1][l'])을 가지고 dp[i][l]을 구한다.
구한 dp[i][l]을 역추적해서 어떤 식으로 돌렸는지 구할 수 있다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 10000, INF = N * 10 + 1;
ll n, genesis[N + 1] = {}, goal[N] = {}, dp[N][10] = {{}};

ll find(ll idx, ll prv) {
  if (idx == n) {
    return 0;
  } else if (dp[idx][prv] != -1) {
    return dp[idx][prv];
  }

  ll &result = dp[idx][prv] = INF;
  for (ll cur = 0, nnum, right, turn, next; cur < 10; ++cur) {
    nnum = (genesis[idx] + prv + cur) % 10;
    right = (nnum - goal[idx] + 10) % 10;
    next = (prv + cur) % 10;
    turn = cur + right + find(idx + 1, next);
    result = min(result, turn);
  }

  return result;
}

void track(ll idx, ll prv) {
  if (idx == n) {
    return;
  }

  ll result = dp[idx][prv];
  for (ll cur = 0, nnum, right, turn, next; cur < 10; ++cur) {
    nnum = (genesis[idx] + prv + cur) % 10;
    right = (nnum - goal[idx] + 10) % 10;
    next = (prv + cur) % 10;
    turn = cur + right + find(idx + 1, next);

    if (turn == result) {
      if (cur) {
        cout << idx + 1 << " " << cur << "\n";
      }

      if (right) {
        cout << idx + 1 << " " << -right << "\n";
      }

      return track(idx + 1, next);
    }
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  cin.ignore();
  for (ll i = 0; i < n; ++i) {
    char c;
    cin >> c;
    genesis[i] = c - '0';
  }
  cin.ignore();
  for (ll i = 0; i < n; ++i) {
    char c;
    cin >> c;
    goal[i] = c - '0';
  }
  memset(dp, -1, sizeof(dp));

  cout << find(0, 0) << "\n";
  track(0, 0);

  return 0;
}
```