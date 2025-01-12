---
title: '2637 BOJ'
description: '장난감 조립'
pubDate: 'Oct 18 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP", "Topology Sort"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2637)
우리는 어떤 장난감을 여러 가지 부품으로 조립하여 만들려고 한다. 이 장난감을 만드는데는 기본 부품과 그 기본 부품으로 조립하여 만든 중간 부품이 사용된다. 기본 부품은 다른 부품을 사용하여 조립될 수 없는 부품이다. 중간 부품은 또 다른 중간 부품이나 기본 부품을 이용하여 만들어지는 부품이다.

예를 들어보자. 기본 부품으로서 1, 2, 3, 4가 있다. 중간 부품 5는 2개의 기본 부품 1과 2개의 기본 부품 2로 만들어진다. 그리고 중간 부품 6은 2개의 중간 부품 5, 3개의 기본 부품 3과 4개의 기본 부품 4로 만들어진다. 마지막으로 장난감 완제품 7은 2개의 중간 부품 5, 3개의 중간 부품 6과 5개의 기본 부품 4로 만들어진다. 이런 경우에 장난감 완제품 7을 만드는데 필요한 기본 부품의 개수는 1번 16개, 2번 16개, 3번 9개, 4번 17개이다.

이와 같이 어떤 장난감 완제품과 그에 필요한 부품들 사이의 관계가 주어져 있을 때 하나의 장난감 완제품을 조립하기 위하여 필요한 기본 부품의 종류별 개수를 계산하는 프로그램을 작성하시오.

# 접근
DP를 이용해서 풀었다. 각 중간 혹은 기본 부품들이 서로다른 중간 부품들에의해 여러번 사용되기에 반복되는 구조가 나타난다. 이를 최적화하고자 방문배열을 만들었고, 
result 배열을 만들어 각 부품들의 기본부품 사용을 조사하였다. 이후 result 배열을 참조해 부모(합쳐져서 만들어지는 부품) 부품들에 대하여 자식 부품들의 기본부품 사용 조사 결과를, 그 수만큼 곱하여 더함으로써 해결하였다.</br>
다른 사람들 풀이를 보니 위상정렬로 풀은 사람도 있던데, 기본부품이 중간부품들을 가리키도록 방향을 바꿔서 그래프를 구성해서 위상정렬 풀듯 풀었으면 풀이가 더 깔끔했을 것이다.

# 입력
첫째 줄에는 자연수 N(3 ≤ N ≤ 100)이 주어지는데, 1부터 N-1까지는 기본 부품이나 중간 부품의 번호를 나타내고, N은 완제품의 번호를 나타낸다. 그리고 그 다음 줄에는 자연수 M(3 ≤ M ≤ 100)이 주어지고, 그 다음 M개의 줄에는 어떤 부품을 완성하는데 필요한 부품들 간의 관계가 3개의 자연수 X, Y, K로 주어진다. 이 뜻은 "중간 부품이나 완제품 X를 만드는데 중간 부품 혹은 기본 부품 Y가 K개 필요하다"는 뜻이다. 두 중간 부품이 서로를 필요로 하는 경우가 없다.
# 출력
하나의 완제품을 조립하는데 필요한 기본 부품의 수를 한 줄에 하나씩 출력하되(중간 부품은 출력하지 않음), 반드시 기본 부품의 번호가 작은 것부터 큰 순서가 되도록 한다. 각 줄에는 기본 부품의 번호와 소요 개수를 출력한다.

정답은 2,147,483,647 이하이다.
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

cll N = 100;
ll n, m, result[N][N] = {{}};
bool visited[N] = {};
vector<vector<pll>> edges(N);

void search(ll node)
{
    if (visited[node])
    {
        return;
    }

    visited[node] = true;
    for (auto &p : edges[node])
    {
        search(p.first);
        for (ll i = 0; i < n; ++i)
        {
            result[node][i] += result[p.first][i] * p.second;
        }
    }

    if (!edges[node].size())
    {
        result[node][node] = 1;
    }

    return;
}

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> n >> m;
    for (ll x, y, k, i = 0; i < m; ++i)
    {
        cin >> x >> y >> k;
        --x, --y;
        edges[x].emplace_back(make_pair(y, k));
    }

    search(n - 1);
    for (ll i = 0; i < n; ++i)
    {
        if (result[n - 1][i])
        {
            cout << i + 1 << " " << result[n - 1][i] << "\n";
        }
    }

    return 0;
}
```
