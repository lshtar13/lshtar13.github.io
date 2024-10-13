---
title: '2228 BOJ'
description: '구간 나누기'
pubDate: 'Oct 13 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2228)
N(1 ≤ N ≤ 100)개의 수로 이루어진 1차원 배열이 있다. 
이 배열에서 M(1 ≤ M ≤ ⌈(N/2)⌉)개의 구간을 선택해서, 구간에 속한 수들의 총 합이 최대가 되도록 하려 한다. 단, 다음의 조건들이 만족되어야 한다.
각 구간은 한 개 이상의 연속된 수들로 이루어진다.
서로 다른 두 구간끼리 겹쳐있거나 인접해 있어서는 안 된다.
정확히 M개의 구간이 있어야 한다. M개 미만이어서는 안 된다.
N개의 수들이 주어졌을 때, 답을 구하는 프로그램을 작성하시오.

# 접근
Top-down 방식의 다이내믹 프로그래밍을 적용하여 풀었다. 
`search()`를 중심으로 구현하였는데, `search(i, k)`은 i번째 숫자부터 고려하였을 때 k개의 구간을 만들었을 때 구간 합의 최댓값을 반환한다.
이는 i번째 수를 포함할지 안할지 두가지 경우로 구분한다. 
* i번째 수를 포함 안 할 경우, `search(i+1, k)`를 고려하면 된다.
* 포함할 경우, i부터 i+1 ~ n까지 구간을 가지는 경우들을 고려하면 된다.

위 경우들을 종합하여 최댓값을 반환한다.

# 입력
첫째 줄에 두 정수 N, M이 주어진다. 다음 N개의 줄에는 배열을 이루는 수들이 차례로 주어진다. 배열을 이루는 수들은 -32768 이상 32767 이하의 정수이다.

# 출력
첫째 줄에 구간에 속한 수들의 총 합의 최댓값을 출력한다.

# 코드
```
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
typedef vector<vll> vvll;

cll N = 100, M = 50, INF = 1e7;
ll n, m, preSum[N + 1] = {}, dp[N + 1][M] = {{{}}};

ll search(ll i, ll k)
{
    if (k <= 0)
    {
        return 0;
    }
    else if (i >= n)
    {
        return -INF;
    }
    else if (dp[i][k] != INF)
    {
        return dp[i][k];
    }

    dp[i][k] = -INF;
    dp[i][k] = max(dp[i][k], search(i + 1, k));
    for (ll l = i + 1; l <= n; ++l)
    {
        dp[i][k] = max(dp[i][k], preSum[l] - preSum[i] + search(l + 1, k - 1));
    }

    return dp[i][k];
}

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> n >> m;
    for (ll i = 0; i <= n; ++i)
    {
        for (ll k = 0; k <= m; ++k)
        {
            dp[i][k] = INF;
        }
    }
    for (ll i = 1; i <= n; ++i)
    {
        cin >> preSum[i];
        preSum[i] += preSum[i - 1];
    }

    cout << search(0, m) << "\n";

    return 0;
}
```
