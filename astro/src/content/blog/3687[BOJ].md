---
title: '3687 BOJ'
description: '성냥개비'
pubDate: 'Oct 19 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP", "String"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3687)
성냥개비는 숫자를 나타내기에 아주 이상적인 도구이다. 보통 십진수를 성냥개비로 표현하는 방법은 다음과 같다.</br>
![image](https://github.com/user-attachments/assets/c9465230-cd38-4bd2-9008-1332c56e0185)
성냥개비의 개수가 주어졌을 때, 성냥개비를 모두 사용해서 만들 수 있는 가장 작은 수와 큰 수를 찾는 프로그램을 작성하시오.</br>

# 접근
DP를 이용해서 해결하였다. 0부터 100까지 성냥개비 개수를 늘려가며 해당 개수를 가지고 만들 수 있는 최대의 수와 최소의 수를 구하였다. 성냥개비로 0~9까지 만들 때, 사용되는 성냥개비 개수(num)를 구하여 활용하였다. 
i개를 이용해서 만들 수 있는 최대의 수를 구할 때, i-num[0~9] 개로 만들 수 있는 최대의 수 뒤에 0~9를 붙이는 식으로 구하였다. 최대의 수는 LLong_MAX를 넘어가기 때문에 문자열을 이용하여 해결하였다.

# 입력
첫째 줄에 테스트 케이스의 개수가 주어진다. 테스트 케이스는 최대 100개 이다. 각 테스트 케이스는 한 줄로 이루어져 있고, 성냥개비의 개수 n이 주어진다. (2 ≤ n ≤ 100)

# 출력
각 테스트 케이스에 대해서 입력으로 주어진 성냥개비를 모두 사용해서 만들 수 있는 가장 작은 수와 가장 큰 수를 출력한다. 두 숫자는 모두 양수이어야 하고, 숫자는 0으로 시작할 수 없다. 

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

cll N = 100, num[10] = {6, 2, 5, 5, 4, 5, 6, 3, 7, 6};
ll n;
string dp0[N + 1] = {"-1", "-1", "1", "7", "11", "71", "111", "711"},
               dp1[N + 1] = {"-1", "-1", "1", "7", "4", "2", "6", "8"};

string cmpStr(string str0, string str1, bool isMax)
{
    if (str0 == "-1")
    {
        return str1;
    }
    else if (str1 == "-1")
    {
        return str0;
    }
    else if (str0.size() > str1.size())
    {
        return isMax ? str0 : str1;
    }
    else if (str0.size() < str1.size())
    {
        return isMax ? str1 : str0;
    }
    else if (str0 > str1)
    {
        return isMax ? str0 : str1;
    }
    else
    {
        return isMax ? str1 : str0;
    }
}

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    for (ll i = 8; i <= N; ++i)
    {
        dp0[i] = "-1";
        for (ll k = 0; k < 10; ++k)
        {
            dp0[i] = cmpStr(dp0[i], dp0[i - num[k]] + to_string(k), true);
        }
    }

    for (ll i = 8; i <= N; ++i)
    {
        dp1[i] = "-1";
        for (ll k = 0; k < 10; ++k)
        {
            dp1[i] = cmpStr(dp1[i], dp1[i - num[k]] + to_string(k), false);
        }
    }

    cin >> n;
    for (ll k, i = 0; i < n; ++i)
    {
        cin >> k;
        cout << dp1[k] << " " << dp0[k] << "\n";
    }

    return 0;
}
```
