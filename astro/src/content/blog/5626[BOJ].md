---
title: '5626 BOJ'
description: '제단'
pubDate: 'Dec 31 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/5626)

## 접근

다이내믹 프로그래밍으로 해결하였다.

메모리가 부족하여 최적화가 조금 필요한 문제였다.
실행시간이 다른 평균적인 풀이에 비해 수배 차이나서 다시 한번 풀어봐야 할 문제이다.

살펴보니 점화식 자체는 틀리지 않았다.
다만, 대부분 풀이에서는 bottom-up 방식으로 해결해 상당한 시간을 아끼고 있었다.
이러한 과정에서 슬라이딩 윈도우를 사용해 메모리도 많이 아낀 것을 확인할 수 있었다.

늘 dp 문제에서는 같은 실수를 반복한다.
점화식을 찾았다는 생각에 안도하여
실제 코드를 너무 대충 짜고 넘기는 식의 안일함이 그것이다.
아래는 976ms가 나온 안타까운 코드이다.

---- 수정 -----

최적화를 하여 더 나은 결과를 얻었다. 164ms로 거의 6배 가까이 줄였다.
더불어 메모리도 많이 줄여냈다.

## 코드

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

cll N = 1e4, INF = 1e9 + 7;
ll n, nums[N] = {};
int dp[N / 2 + 1][N] = {};

ll find(ll prv, ll idx) {
  ll result;
  if (idx >= n) {
    return 1;
  } else if (dp[prv][idx] != -1) {
    goto END;
  }

  if (nums[idx] != -1) {
    if (abs(prv - nums[idx]) > 1) {
      result = 0;
    } else {
      result = find(nums[idx], idx + 1);
    }
  } else {
    result = 0;
    if (prv + 1 <= n / 2) {
      result += find(prv + 1, idx + 1);
    }
    result += find(prv, idx + 1);
    if (prv >= 1) {
      result += find(prv - 1, idx + 1);
    }
  }

  result %= INF;
  dp[prv][idx] = result;

END:
  return dp[prv][idx];
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
  if (nums[0] != -1 && nums[0] != 0) {
    cout << "0\n";
  } else if (nums[n - 1] != -1 && nums[n - 1] != 0) {
    cout << "0\n";
  } else {
    nums[0] = nums[n - 1] = 0;
    cout << find(0, 1) << "\n";
  }

  return 0;
}
```

개선한 코드

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

cll N = 1e4, INF = 1e9 + 7;
ll n, nums[N] = {}, dp[2][N] = {{}};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> nums[i];
  }
  if (nums[0] != -1 && nums[0] != 0) {
    cout << "0\n";
  } else if (nums[n - 1] != -1 && nums[n - 1] != 0) {
    cout << "0\n";
  } else {
    nums[0] = nums[n - 1] = 0, dp[n % 2][0] = 1;
    for (ll idx = n - 1; idx >= 0; --idx) {
      for (ll num = 0; num <= n / 2; ++num) {
        if (nums[idx] != -1 && nums[idx] != num) {
          dp[idx % 2][num] = 0;
          continue;
        }

        dp[idx % 2][num] = dp[(idx + 1) % 2][num];
        if (num >= 1) {
          dp[idx % 2][num] += dp[(idx + 1) % 2][num - 1];
        }
        if (num < n / 2) {
          dp[idx % 2][num] += dp[(idx + 1) % 2][num + 1];
        }
        dp[idx % 2][num] %= INF;
      }
    }

    cout << dp[0][0] << "\n";
  }

  return 0;
}
```