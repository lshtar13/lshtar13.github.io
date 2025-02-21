---
title: '1695 BOJ'
description: '팰린드롬 만들기'
pubDate: 'Oct 05 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1695)

앞에서 뒤로 보나, 뒤에서 앞으로 보나 같은 수열을 팰린드롬 이라고 한다. 예를 들어 {1}, {1, 2, 1}, {1, 2, 2, 1}과 같은 수열은 팰린드롬 이지만, {1, 2, 3}, {1, 2, 3, 2} 등은 팰린드롬이 아니다.</br>
한 수열이 주어졌을 때, 이 수열에 최소 개수의 수를 끼워 넣어 팰린드롬을 만들려고 한다. 최소 몇 개의 수를 끼워 넣으면 되는지를 알아내는 프로그램을 작성하시오.

# 접근

Top-Down 방식에 Memoization을 이용해 풀었다. 주어진 배열(`nums`)을 `st`에서 `en`까지 슬라이싱 했을 때, 해당 부분 배열을 팰린드롬으로 만들기 위한 최소 개수의 끼워 넣는 수를 반환하는 함수 `search(st, en)`를 만들었다. `st`-`en` 조합이 반복될 것 이기에 이차원의 `dp` 배열을 만들어 반환값을 저장했다가, 같은 조합에 대한 탐색이 발생했을 때 재사용하였다.

## `search(st, en)`

`nums[st]`와 `nums[en]`이 동일한 상황과 아닌 상황으로 나누어 생각한다. 동일할 때, 둘이 서로 대응하여 팰린드롬을 형성할 수 있고 그러지 않을 수도 있다. 동일하지 않을 때, 둘이 대응하는 경우는 존재하지 않는다. 두 상황 모두 대응하지 않는 경우를 포함한다. 대응하지 않을 경우에는 `nums[st]` 앞에 `nums[en]`와 동일한 수를 끼워넣거나, `nums[en]`뒤에 `nums[st]`와  동일한 수를 끼워넣어야 한다. 이후 각각 다음 구간, `search(st, en -1)`와 `search(st+1, en)`를 조사한다. 대응하는 경우에는 `search(st+1, en-1)`를 조사한다.</br>
따라서 먼저 `nums[st]`와 `nums[en]`이 동일한지 살피고 동일하면 세가지 경우 (둘이 대응, `nums[st]`앞에 끼워 넣기, `nums[en]`뒤에 끼워넣기)를 고려하고, 다르면 두가지 경우 (`nums[st]`앞에 끼워 넣기, `nums[en]`뒤에 끼워넣기)를 고려하여 가장 작은 값을 도출하는 경우를 선택한다.

## LCS(Longest Common subsequence)

풀이를 마치고, 다른 사람들의 풀이를 읽어보니 LCS(Longest Common subsequence)를 활용한 풀이가 좋은 성능을 보여주는 것을 알 수 있었다. LCS를 응용하여 주어진 `nums`에서 가장 긴 팰린드롬을 이루는 부분 배열을 찾아내고 전체 길이에 이 길이를 뺀 값 만큼 끼워 넣으면 된다.

# 입력

첫째 줄에 수열의 길이 N(1≤N≤5,000)이 주어진다. 다음 줄에는 N개의 수열을 이루는 수들이 주어진다. 각 수들은 int 범위이다.

# 출력

첫째 줄에 끼워 넣을 수들의 최소 개수를 출력한다.

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

cll N = 5000;
int n, nums[N] = {}, dp[N][N] = {{}};

ll search(ll st, ll en)
{
    // cout << st << " " << en << "\n";
    if (st >= en)
    {
        return 0;
    }
    else if (dp[st][en] != -1)
    {
        return dp[st][en];
    }

    ll result = LLONG_MAX;
    if (nums[st] == nums[en])
    {
        result = min(result, search(st + 1, en - 1));
    }
    result = min(result, search(st + 1, en) + 1);
    result = min(result, search(st, en - 1) + 1);

    return dp[st][en] = result;
}

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> n;
    for (ll i = 0; i < n; ++i)
    {
        cin >> nums[i];
    }
    memset(dp, -1, sizeof(dp));
    cout << search(0, n - 1) << "\n";

    return 0;
}
```
