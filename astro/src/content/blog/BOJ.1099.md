---
title: '1099 BOJ'
description: '알 수 없는 문장'
pubDate: 'Dec 12 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1099)

## 접근

다아내믹 프로그래밍을 이용해 해결하였다.

DP배열을 주어지는 문장의 길이만큼 채워넣어 해결하였다.
DP[i]는 1번째 문자부터 i번째 문자까지 고려하였을 때 얻을 수 있는 최소의 비용을 저장한다.
DP[i]는 주어진 모든 단어들에 대하여, i번째를 마지막으로 하였을 때 매칭되는 것이 있는지 확인하며 갱신한다.
만약 단어의 길이가 3이면, i-2, i-1, 그리고 i번째의 문자를 해당 단어와 비교하여 구간 비용을 구하고
해당 구간 비용을 DP[i-3]과 더해 DP[i]를 갱신한다.

구간 비용을 빠르게 해결하기 위해 누적합을 이용했다.
알파벳별로 지금까지 등장한 횟수를 저장해, 비용 계산 시 활용하였다.

처음에는 백트래킹 형식으로 계산해보려고 하였으나, DP가 나을 것 같아서 선회하였다.
배열의 범위를 잘못 설정하는 등, 잔실수가 많아 애를 먹었다.

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

cll NWORD = 50, NALPHA = 'z' - 'a' + 1, INF = NWORD + 1;
char tgt[NWORD + 1] = {};
string words[NWORD];
ll nword, len, wordStatus[NWORD][NALPHA] = {{}}, sum[NWORD + 1][NALPHA] = {{}};
vll dp(NWORD + 1, INF);

ll cost(ll idx, ll st, ll en) {
  ll result = INF, cost = en - st;
  for (ll a = 0; a < NALPHA; ++a) {
    if (sum[en][a] - sum[st][a] != wordStatus[idx][a]) {
      goto END;
    }
  }

  for (ll c = st; c < en; ++c) {
    cost -= (words[idx][c - st] == tgt[c]);
  }
  result = min(result, cost);

END:
  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> tgt >> nword;
  for (ll i = 0; i < nword; ++i) {
    cin >> words[i];
    for (auto &c : words[i]) {
      ++wordStatus[i][c - 'a'];
    }
  }

  ll len = strlen(tgt);
  for (ll idx, i = 0; i < len; ++i) {
    idx = tgt[i] - 'a';
    for (ll c = 0; c < NALPHA; ++c) {
      sum[i + 1][c] = sum[i][c];
    }
    ++sum[i + 1][idx];
  }

  dp[0] = 0;
  for (ll i = 1; i <= len; ++i) {
    for (ll w = 0; w < nword; ++w) {
      ll len = words[w].length();
      if (i < len) {
        continue;
      }

      dp[i] = min(dp[i], cost(w, i - len, i) + dp[i - len]);
    }
  }

  cout << (dp[len] >= INF ? -1 : dp[len]) << "\n";

  return 0;
}
```