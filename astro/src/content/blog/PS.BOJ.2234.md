---
title: '2234 BOJ'
description: '성곽'
pubDate: 'Oct 15 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Breadth-First Search", "BFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2234)
![image](https://github.com/user-attachments/assets/bde5a418-1e0d-4fea-97ae-cceac7dd3585)</br>

대략 위의 그림과 같이 생긴 성곽이 있다. 
굵은 선은 벽을 나타내고, 점선은 벽이 없어서 지나다닐 수 있는 통로를 나타낸다. 
이러한 형태의 성의 지도를 입력받아서 다음을 계산하는 프로그램을 작성하시오.
1. 이 성에 있는 방의 개수
2. 가장 넓은 방의 넓이
3. 하나의 벽을 제거하여 얻을 수 있는 가장 넓은 방의 크기


위의 예에서는 방은 5개고, 가장 큰 방은 9개의 칸으로 이루어져 있으며, 위의 그림에서 화살표가 가리키는 벽을 제거하면 16인 크기의 방을 얻을 수 있다.

성은 M × N(1 ≤ M, N ≤ 50)개의 정사각형 칸으로 이루어진다. 성에는 최소 두 개의 방이 있어서, 항상 하나의 벽을 제거하여 두 방을 합치는 경우가 있다.

# 접근
너비우선탐색을 통해 풀었다. </br>
방문하지 않은 좌표에 대하여 출발점으로 잡고 너비우선탐색을 통해 벽으로 가로막히지 않은 방을 탐색하였다.
이미 탐색한 좌표에 대해서 해당 방번호를 적어서 방문 표시를 하였다. 한번의 너비 우선 탐색에 하나의 방이 만들어지게끔 하였다.
따라서 해당 탐색때 방문한 모든 좌표의 개수를 집계하면 방 넓이를 구할 수 있었다.</br>
그래프 내 모든 방의 구성을 탐색한 후 다시 반복문을 돌면서 맞닿은 방들에 대하여 넓이합의 최댓값을 구하였다.

# 입력
첫째 줄에 두 정수 N, M이 주어진다. 다음 M개의 줄에는 N개의 정수로 벽에 대한 정보가 주어진다. 
벽에 대한 정보는 한 정수로 주어지는데, 서쪽에 벽이 있을 때는 1을, 북쪽에 벽이 있을 때는 2를, 동쪽에 벽이 있을 때는 4를, 남쪽에 벽이 있을 때는 8을 더한 값이 주어진다. 
참고로 이진수의 각 비트를 생각하면 쉽다. 따라서 이 값은 0부터 15까지의 범위 안에 있다.
# 출력
첫째 줄에 1의 답을, 둘째 줄에 2의 답을, 셋째 줄에 3의 답을 출력한다.

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

cll N = 50, M = 50, directions[4][2] = {{0, -1}, {-1, 0}, {0, 1}, {1, 0}};
ll n, m, mat[M][N] = {{}}, room[M][N] = {{}}, roomSize[M * N] = {};

bool isValid(ll i, ll l)
{
    return i >= 0 && i < m && l >= 0 && l < n;
}

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> n >> m;
    for (ll i = 0; i < m; ++i)
    {
        for (ll l = 0; l < n; ++l)
        {
            cin >> mat[i][l];
        }
    }

    ll roomNo = 0, maxSize = 0, maxSum = 0;
    qpll q;
    for (ll a = 0; a < m; ++a)
    {
        for (ll b = 0; b < n; ++b)
        {
            if (room[a][b])
            {
                continue;
            }

            room[a][b] = ++roomNo, roomSize[roomNo] = 1;
            q.push(make_pair(a, b));
            while (!q.empty())
            {
                ll i = q.front().first, l = q.front().second;
                q.pop();
                for (ll d = 0; d < 4; ++d)
                {
                    ll _i = i + directions[d][0], _l = l + directions[d][1];
                    if (!isValid(_i, _l) || room[_i][_l] || (mat[i][l] & (1 << d)))
                    {
                        continue;
                    }

                    ++roomSize[roomNo], room[_i][_l] = roomNo;
                    q.push(make_pair(_i, _l));
                }
            }

            maxSize = max(maxSize, roomSize[roomNo]);
        }
    }

    for (ll i = 0; i < m; ++i)
    {
        for (ll l = 0; l < n; ++l)
        {
            for (ll d = 0; d < 4; ++d)
            {
                ll _i = i + directions[d][0], _l = l + directions[d][1];
                if (!isValid(_i, _l) || room[i][l] == room[_i][_l] || !(mat[i][l] & (1 << d)))
                {
                    continue;
                }

                maxSum = max(maxSum, roomSize[room[i][l]] + roomSize[room[_i][_l]]);
            }
        }
    }

    cout << roomNo << "\n";
    cout << maxSize << "\n";
    cout << maxSum << "\n";

    return 0;
}
```
