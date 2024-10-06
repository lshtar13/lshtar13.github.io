---
title: '1719 BOJ'
description: '택배'
pubDate: 'Oct 06 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Floyd-Warshall", "Dijkstra"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1719)
명우기업은 2008년부터 택배 사업을 새로이 시작하기로 하였다. 우선 택배 화물을 모아서 처리하는 집하장을 몇 개 마련했지만, 택배 화물이 각 집하장들 사이를 오갈 때 어떤 경로를 거쳐야 하는지 결정하지 못했다. 어떤 경로를 거칠지 정해서, 이를 경로표로 정리하는 것이 여러분이 할 일이다.</br>
![image](https://github.com/user-attachments/assets/88982e63-d41a-4843-afe7-7e5d43a52982)</br>
예시된 그래프에서 굵게 표시된 1, 2, 3, 4, 5, 6은 집하장을 나타낸다. 정점간의 간선은 두 집하장간에 화물 이동이 가능함을 나타내며, 가중치는 이동에 걸리는 시간이다. 이로부터 얻어내야 하는 경로표는 다음과 같다.</br>
![image](https://github.com/user-attachments/assets/d46d84b1-234d-42b7-8e8c-068db0385b1a)</br>
경로표는 한 집하장에서 다른 집하장으로 최단경로로 화물을 이동시키기 위해 가장 먼저 거쳐야 하는 집하장을 나타낸 것이다. 예를 들어 4행 5열의 6은 4번 집하장에서 5번 집하장으로 최단 경로를 통해 가기 위해서는 제일 먼저 6번 집하장으로 이동해야 한다는 의미이다.
이와 같은 경로표를 구하는 프로그램을 작성하시오.

# 접근
플로이드-워셜 알고리즘을 활용해서 풀었다. `i`에서 `j`까지의 최단거리를 `mat[i][j]`로 갖는 인접 행렬, `mat`을 플로이드 워셜을 통해 채워넣었다. 경로 역추적을 위한 행렬 `prv`도 활용하였다. `prv[i][j]`는 `i`에서 `j`까지의 최단 경로 상에서 가장 먼저 들르는 집하장을 나타낸다.

## [플로이드-워셜](https://velog.io/@kimdukbae/%ED%94%8C%EB%A1%9C%EC%9D%B4%EB%93%9C-%EC%9B%8C%EC%85%9C-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-Floyd-Warshall-Algorithm)
`n`개의 노드(집하장)을 중간 기점으로 삼았을 시 `i`에서 `j`까지의 최단거리가 단축되는지 조사한다. 단축된다면 `mat[i][j]`를 `mat[i][k]+mat[k][l]`로 최신화하고, `prv[i][l]` 또한 `prv[i][k]`로 최신화한다.
## [다익스트라](https://m.blog.naver.com/ndb796/221234424646)
다익스트라 알고리즘을 사용하여 매 `(i,j)`쌍 마다 계산한 풀이도 보였다.

# 입력
첫째 줄에 두 수 n과 m이 빈 칸을 사이에 두고 순서대로 주어진다.
n은 집하장의 개수로 200이하의 자연수, m은 집하장간 경로의 개수로 10000이하의 자연수이다.
이어서 한 줄에 하나씩 집하장간 경로가 주어지는데, 두 집하장의 번호와 그 사이를 오가는데 필요한 시간이 순서대로 주어진다.
집하장의 번호들과 경로의 소요시간은 모두 1000이하의 자연수이다.

# 출력
예시된 것과 같은 형식의 경로표를 출력한다.

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

cll N = 200, M = 10000, INF = 2e6;
ll n, m, prv[N][N] = {{}}, mat[N][N] = {{}};

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);
    cin >> n >> m;
    for (ll i = 0; i < n; ++i)
    {
        for (ll l = 0; l < n; ++l)
        {
            mat[i][l] = i == l ? 0 : INF;
        }
    }
    for (ll s0, s1, w, i = 0; i < m; ++i)
    {
        cin >> s0 >> s1 >> w;
        --s0, --s1;
        mat[s0][s1] = w, mat[s1][s0] = w;
        prv[s0][s1] = s1, prv[s1][s0] = s0;
    }
    for (ll k = 0; k < n; ++k)
    {
        for (ll i = 0; i < n; ++i)
        {
            for (ll l = 0; l < n; ++l)
            {
                ll w = mat[i][k] + mat[k][l];
                if (mat[i][l] > w)
                {
                    mat[i][l] = w, prv[i][l] = prv[i][k];
                }
            }
        }
    }
    for (ll i = 0; i < n; ++i)
    {
        for (ll l = 0; l < n; ++l)
        {
            if (i == l)
            {
                cout << "- ";
            }
            else
            {
                cout << prv[i][l] + 1 << " ";
            }
        }
        cout << "\n";
    }
    return 0;
}
```
