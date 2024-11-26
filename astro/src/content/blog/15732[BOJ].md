---
title: '15685 BOJ'
description: '드래곤 커브'
pubDate: 'Nov 25 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Math", "Implementation"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/15732)

## 접근

매개변수 탐색으로 해결하였다.
문제만 보고 매개변수 탐색을 떠올리기는 쉽지 않은 것 같다.

도토리의 개수(D) 혹은 상자의 개수(N)와, 규칙의 개수(K)를 보고 힌트를 얻을 수 있다.
나이브하게 iterate하기엔 D나 N이 너무 크고, K는 적당하다.
도토리를 추적해서 마지막 상자를 구하기에는 시간 초과가 두렵다.
규칙을 iterate 하는 것은 큰 부담이 되지 않기 때문에, D나 N에 관한 부분은 O(logN 혹은 logD)으로 
처리하고 여차하면 K에 관해서는 O(K)로 해결하는 방안이 설득력 있다.

마지막 도토리가 들어가는 상자의 번호를 이분탐색으로 탐색한다면, O(KlogN)으로 해결 가능하다.

# 코드

```cpp
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

cll N = 1e6, K = 1e4, D = 1e9;
ll n, k, d, rules[K][3] = {{}};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> k >> d;
  for (ll i = 0; i < k; ++i) {
    cin >> rules[i][0] >> rules[i][1] >> rules[i][2];
  }

  ll st = 1, en = n, ans;

  while (st <= en) {
    ll mid = (st + en) / 2, cnt = 0;
    for (ll i = 0; i < k; ++i) {
      if (rules[i][0] > mid) {
        continue;
      }
      cnt += (min(rules[i][1], mid) - rules[i][0]) / rules[i][2] + 1;
    }

    if (d <= cnt) {
      ans = mid, en = mid - 1;
    } else {
      st = mid + 1;
    }
  }

  cout << ans << "\n";

  return 0;
}
```