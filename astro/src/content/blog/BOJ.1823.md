---
title: '1823 BOJ'
description: '수확'
pubDate: 'Oct 08 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "DP", "Dynamic Programming"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1823)
1 × N 크기의 긴 밭에 벼가 심어져 있다. 준희는 이 벼를 수확 하려고 한다. 
그런데 가운데 있는 벼를 수확을 하려면 끝에서 가운데까지 헤집고 들어가야 하므로 양 끝에 있는 벼만 수확을 할 수 있다. 
처음에는 첫 번째와 N번째 벼를 수확을 할 수 있을 것이며 만약에 첫 번째 벼를 수확을 하였다면 두 번째 벼와 N번째 벼를 수확을 할 수 있다.
수확을 하였을 때 얻을 수 있는 이익은 다음과 같다. 만약에 그 벼의 가치가 v(i)라고 하고 그 벼를 k번째로 수확을 한다고 하면 v(i) × k 만큼의 이익을 얻게 된다.
만약에 벼의 가치가 차례로 1 3 1 5 2 라고 하고 첫 번째, 다섯 번째, 두 번째, 세 번째, 네 번째의 순서대로 수확을 한다고 하면 1×1 + 2×2 + 3×3 + 4×1 + 5×5 = 43 이 되어 43 만큼의 이익을 얻게 된다. 
그리고 이 값이 저 벼로 얻을 수 있는 최대 이익이 된다.
우리가 구해야 할 값은 다음과 같다. 벼의 개수 N과 벼의 가치가 주어져 있을 때, 얻을 수 있는 최대 이익을 구하는 프로그램을 작성하시오.

# 접근
DP를 활용해서 풀었다. 가장자리의 벼가 `i`번째 벼와 `l`번째 벼일때 얻을 수 있는 최대의 이익을 `dp[i][l]`에 저장한다. 
해당 시점의 `k`값은 `i`와 `l`을 통해 유추할 수 있다. 한번에 한 벼만 베어내므로 남아 있는 벼의 개수를 세어 전체 벼에 감하면 `k`를 구할 수 있다.

# 입력
첫째 줄에 벼의 개수 N(1 ≤ N ≤ 2,000)이 주어지고 두 번째 줄부터 N+1번쨰 줄까지 벼의 가치 v(i) (1 ≤ v(i) ≤ 1,000) 가 주어진다.

# 출력
첫째 줄에 얻을 수 있는 최대 이익을 출력한다.

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
cll N = 2000;
ll n, v[N] = {}, dp[N][N] = {{}};
ll search(ll st, ll en)
{
    if (st > en)
    {
        return 0;
    }
    else if (dp[st][en] != -1)
    {
        return dp[st][en];
    }
    ll k = n - en + st;
    dp[st][en] = search(st + 1, en) + k * v[st];
    dp[st][en] = max(dp[st][en], search(st, en - 1) + k * v[en]);
    return dp[st][en];
}
int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);
    memset(dp, -1, sizeof(dp));
    cin >> n;
    for (ll i = 0; i < n; ++i)
    {
        cin >> v[i];
    }
    cout << search(0, n - 1) << "\n";
    return 0;
}
```
