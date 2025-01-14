---
title: '13392 BOJ'
description: '방법을 출력하지 않는 숫자 맞추기'
pubDate: 'Dec 16 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/13392)

## 접근

다이내믹 프로그래밍을 이용해 해결하였다.
Top-bottom으로 해결하였는데 제목에 나타나 있듯이 방법을 출력하지 않아도 되어 난도가 크게 높지는 않았던 문제이다.

밑에 나사가 돌아갈 경우, 다 같이 돌아가기 때문에 특정 인덱스의 나사 밑의 상태를 나타내기 위해서는 해당 나사의 상태만 알아도 충분하다.
만약 초기 상태가 1 2 3 4 였고 인덱스 2의 현재 상태가 3일 경우 인덱스 2 이상의 상태가 3 4 5 인 것을 알 수 있다.
따라서, 현재 다루려는 나사의 상태와 해당 나사의 인덱스를 매개변수로 갖는 search()를 구성하여 인덱스 0부터 n-1까지 탐색했다.
반복되는 탐색을 막기 위해서 dp 배열에 탐색결과를 저장하여 재활용하였다. 역추적을 해야했으면 조금 까다로워졌을 문제이다.

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

cll N = 10000, NUM = 10, INF = N * NUM;
ll n, state[N] = {}, goal[N] = {}, dp[N][NUM] = {{}};

ll find(ll idx, ll num) {
  ll next, toGo, result;
  if (idx == n) {
    return 0;
  } else if (dp[idx][num] != -1) {
    goto END;
  }
  next = (state[idx + 1] + num - state[idx] + NUM) % NUM;

  // left
  toGo = (goal[idx] - num + NUM) % NUM;
  result = find(idx + 1, (next + toGo) % NUM) + toGo;

  // right
  toGo = (num - goal[idx] + NUM) % NUM;
  result = min(result, find(idx + 1, next) + toGo);

  dp[idx][num] = result;

END:
  return dp[idx][num];
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  cin.ignore();
  FOR1(i, n) {
    char c;
    cin >> c;
    state[i] = c - '0';
  }
  cin.ignore();
  FOR1(i, n) {
    char c;
    cin >> c;
    goal[i] = c - '0';
  }

  memset(dp, -1, sizeof(dp));

  cout << find(0, state[0]) << "\n";

  return 0;
}
```