---
title: '2026 BOJ'
description: '소풍'
pubDate: 'Oct 11 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Back Tracking"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2026)
원장선생님께서는 1부터 N까지 번호가 붙은 N(K ≤ N ≤ 900)명의 학생들 중에서 K(1 ≤ K ≤ 62)명의 학생들을 소풍에 보내려고 한다. 
그런데 원장선생님께서는 중간에 싸움이 일어나면 안되므로 소풍을 갈 학생들이 모두 서로 친구 사이이기를 원한다. 
원장선생님께서는 이러한 일을 이번에 조교로 참가한 고은이에게 친구 관계에 대한 정보를 F(1 ≤ F ≤ 5,600)개를 주시며 K명을 선발하라고 부탁하였다.
고은 조교를 도와 소풍을 가게 될 K명의 학생들을 결정하시오.

# 접근
백트래킹을 이용하여 풀었다. 친구관계를 입력받아 인접행렬로 만들고, 이 인접행렬을 바탕으로 친구조합들의 정답여부를 판별한다.
사전순으로 가장 빠른 조합을 출력해야 하므로 재귀함수의 실행 순서를, 해당 인덱스를 포함하는 것부터로 한다.

# 입력
첫째 줄에 공백으로 분리된 세 정수 K, N, F가 주어진다. 
다음 F개의 줄에는 서로 친구 관계인 두 사람의 번호가 주어진다. 
친구 관계는 상호적인 관계이므로 2번 학생이 4번 학생을 좋아하면 4번 학생도 2번 학생을 좋아한다. 
같은 친구 관계가 여러 번 주어지는 경우는 없다.

# 출력
만약 K명의 친구 관계인 학생들이 존재하지 않는다면 -1을 출력한다. 그 외의 경우에는, K개의 줄에 학생들의 번호를 증가하는 순서로 한 줄에 한 개씩 출력한다. 
여러 경우가 존재한다면 첫 번째 학생의 번호가 제일 작은 것을 출력한다. 
첫 번째 학생의 번호가 같은 경우라면, 두 번째 학생의 번호가 작은 경우를 출력하고, 이와 같은 식으로 출력한다.

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

cll K = 62, N = 900, F = 5600;
ll k, n, f, mat[N][N] = {{}};

bool search(vll &nodes, ll idx)
{
    if (nodes.size() == k)
    {
        for (auto &node : nodes)
        {
            cout << node + 1 << "\n";
        }
        return true;
    }
    else if (n - idx < k - nodes.size())
    {
        return false;
    }

    bool isOk = true;
    for (auto &node : nodes)
    {
        if (!mat[node][idx])
        {
            isOk = false;
            break;
        }
    }
    if (isOk)
    {
        nodes.emplace_back(idx);
        if (search(nodes, idx + 1))
        {
            return true;
        }
        nodes.pop_back();
    }

    if (search(nodes, idx + 1))
    {
        return true;
    }

    return false;
}

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> k >> n >> f;
    for (ll f0, f1, i = 0; i < f; ++i)
    {
        cin >> f0 >> f1;
        --f0, --f1;
        mat[f0][f1] = mat[f1][f0] = 1;
    }

    vll nodes;
    if (!search(nodes, 0))
    {
        cout << -1;
    }

    return 0;
}
```
