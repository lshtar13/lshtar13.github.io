---
title: '1726 BOJ'
description: '로봇'
pubDate: 'Oct 06 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "BFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1726)
많은 공장에서 로봇이 이용되고 있다. 우리 월드 공장의 로봇은 바라보는 방향으로 궤도를 따라 움직이며, 움직이는 방향은 동, 서, 남, 북 가운데 하나이다. 로봇의 이동을 제어하는 명령어는 다음과 같이 두 가지이다.
* 명령 1. Go k: k는 1, 2 또는 3일 수 있다. 현재 향하고 있는 방향으로 k칸 만큼 움직인다.
* 명령 2. Turn dir: dir은 left 또는 right 이며, 각각 왼쪽 또는 오른쪽으로 90° 회전한다.
공장 내 궤도가 설치되어 있는 상태가 아래와 같이 0과 1로 이루어진 직사각형 모양으로 로봇에게 입력된다. 0은 궤도가 깔려 있어 로봇이 갈 수 있는 지점이고, 1은 궤도가 없어 로봇이 갈 수 없는 지점이다.
로봇이 (4, 2) 지점에서 남쪽을 향하고 있을 때,  이 로봇을 (2, 4) 지점에서 동쪽으로 향하도록 이동시키는 것은 아래와 같이 9번의 명령으로 가능하다.</br>
![image](https://github.com/user-attachments/assets/ee435bd1-f73b-4ffe-89db-8a6d25617c1e)</br>
로봇의 현재 위치와 바라보는 방향이 주어졌을 때, 로봇을 원하는 위치로 이동시키고, 원하는 방향으로 바라보도록 하는데 최소 몇 번의 명령이 필요한지 구하는 프로그램을 작성하시오.

# 접근
너비우선탐색을 활용해서 풀었다.

## [BFS(너비 우선 탐색, Breadth-first search)](https://gmlwjd9405.github.io/2018/08/15/algorithm-bfs.html)
방문 배열을 만들어 각 위치별로 몇 번의 이동 끝에 도착하게 되는지 기록한다. BFS를 이용해서 모든 원소를 순회하고 도착지점의 방문 배열 값을 출력한다. 2~3칸씩 이동할 경우, 도착지점이 아닌 지나가는 부분 또한 이동가능한 지점이어야 하는 점을 놓쳐 헤매었다.

# 입력
첫째 줄에 공장 내 궤도 설치 상태를 나타내는 직사각형의 세로 길이 M과 가로 길이 N이 빈칸을 사이에 두고 주어진다. 이때 M과 N은 둘 다 100이하의 자연수이다.
이어 M줄에 걸쳐 한 줄에 N개씩 각 지점의 궤도 설치 상태를 나타내는 숫자 0 또는 1이 빈칸을 사이에 두고 주어진다. 다음 줄에는 로봇의 출발 지점의 위치 (행과 열의 번호)와 바라보는 방향이 빈칸을 사이에 두고 주어진다.
마지막 줄에는 로봇의 도착 지점의 위치 (행과 열의 번호)와 바라보는 방향이 빈칸을 사이에 두고 주어진다. 방향은 동쪽이 1, 서쪽이 2, 남쪽이 3, 북쪽이 4로 주어진다. 출발지점에서 도착지점까지는 항상 이동이 가능하다.
# 출력
첫째 줄에 로봇을 도착 지점에 원하는 방향으로 이동시키는데 필요한 최소 명령 횟수를 출력한다.

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

cll N = 100, M = 100, DIR = 4, INF = 1e9,
    directions[4][3][2] = {{{0, 1}, {0, 2}, {0, 3}}, {{0, -1}, {0, -2}, {0, -3}}, {{1, 0}, {2, 0}, {3, 0}}, {{-1, 0}, {-2, 0}, {-3, 0}}};
ll n, m, record[M][N][DIR] = {{}};
bool industry[M][N] = {{}};

bool isValid(ll i, ll l)
{
    return i >= 0 && i < m && l >= 0 && l < n;
}

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> m >> n;
    for (ll i = 0; i < m; ++i)
    {
        for (ll l = 0; l < n; ++l)
        {
            cin >> industry[i][l];
            for (ll d = 0; d < 4; ++d)
            {
                record[i][l][d] = INF;
            }
        }
    }

    pair<pll, ll> st, en;
    cin >> st.first.first >> st.first.second >> st.second;
    cin >> en.first.first >> en.first.second >> en.second;
    --st.first.first, --st.first.second, --st.second;
    --en.first.first, --en.first.second, --en.second;
    queue<pair<pll, ll>> q;
    q.push(st);
    record[st.first.first][st.first.second][st.second] = 0;
    while (!q.empty())
    {
        ll i = q.front().first.first, l = q.front().first.second, dir = q.front().second;
        q.pop();

        for (auto &d : directions[dir])
        {
            ll _i = i + d[0], _l = l + d[1];
            if (!isValid(_i, _l) || record[_i][_l][dir] != INF)
            {
                continue;
            }
            else if (industry[_i][_l])
            {
                break;
            }
            record[_i][_l][dir] = record[i][l][dir] + 1;
            q.push(make_pair(make_pair(_i, _l), dir));
        }

        for (ll d = 0; d < 4; ++d)
        {
            if ((dir < 2 && d < 2) || (dir > 1 && d > 1) || record[i][l][d] != INF)
            {
                continue;
            }

            record[i][l][d] = record[i][l][dir] + 1;
            q.push(make_pair(make_pair(i, l), d));
        }
    }

    cout << record[en.first.first][en.first.second][en.second];

    return 0;
}
```
