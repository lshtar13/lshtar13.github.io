---
title: '2201 BOJ'
description: '이친수 찾기'
pubDate: 'Dec 29 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2201)

## 접근

다이내믹 프로그래밍으로 해결하였다.
아이디어를 떠올리는 데에 걸린 시간이 길지 않았으나, 개인적으로 쉽지 않은 발상이었다.
잔실수도 있어서 애먹은 문제이다.

N개의 비트를 이용해 표현할 수 있는, N자리의 이친수가 몇개 있는지 나타내는 dp배열을 만들어 활용한다.
해당 배열을 사용하면 주어진 K번째 이친수가 몇 자리 이진수인지 알 수 있게 된다.
N자리의 이진수이면 N번째 비트는 1이다.
이러한 논리를 재귀적으로 파고들어 몇번째 자리에 1이 들어가는지 알 수 있다.
1에서 N-1자리의 이친수의 개수만큼을 K에서 빼고 남은 수를 \`K라 할 때, \`K에 대하여 위 과정을 반복하면 그 다음으로
오는 1의 자릿수를 알 수 있게 되는 것이다.

## 잡설

주말에 평일보다 컨디션이 안 좋은 이유를 모르겠다. 어제 오늘 문제가 영 안 풀렸다.
어제는 바로 포기하고 휴식했지만, 이틀 연속 쉴 순 없다는 생각에 오늘은 끝까지 붙잡고 늘어져
결국 한 문제를 해결하였다. 사실, 풀 수 있는 문제를 푼거라 실력 향상에 있어서 큰 의미가 없었겠지만,
꾸준함에 의미를 두고 하였다.

매번 비트 계산에서 실수를 저지른다. 이번 문제에서도, 최대로 구할 이진수의 자릿수를 잘못 계산하여 헤메었다.
반성할 지점이다.

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

cll N_BIT = 101, K = 1e18;
ll k, dp[N_BIT][3] = {{}};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  dp[0][0] = 0, dp[0][1] = 1, dp[0][2] = 1;
  for (ll b = 1; b < N_BIT; ++b) {
    dp[b][0] = dp[b - 1][0] + dp[b - 1][1];
    dp[b][1] = dp[b - 1][0];
    dp[b][2] = dp[b][0] + dp[b][1];
  }

  cin >> k;

  ll bit, sum, order;
  stack<ll> s;
  while (true) {
    for (bit = 0, sum = 0; sum < k; ++bit) {
      sum += dp[bit][2];
    }

    if (bit > 0) {
      k = dp[bit - 1][2] - (sum - k) - 1;
      s.push(bit);
    } else {
      break;
    }
  }

  ll prv = 0, cur;
  string result = "";
  while (!s.empty()) {
    cur = s.top();
    s.pop();

    for (ll i = 0; i < cur - prv - 1; ++i) {
      result = "0" + result;
    }

    result = "1" + result;
    prv = cur;
  }

  cout << result;

  return 0;
}
```