---
title: '6087 BOJ'
description: '레이저 통신'
pubDate: 'Oct 23 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dijkstra Algorithm"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/6087)
크기가 1×1인 정사각형으로 나누어진 W×H 크기의 지도가 있다. 지도의 각 칸은 빈 칸이거나 벽이며, 두 칸은 'C'로 표시되어 있는 칸이다.
'C'로 표시되어 있는 두 칸을 레이저로 통신하기 위해서 설치해야 하는 거울 개수의 최솟값을 구하는 프로그램을 작성하시오. 레이저로 통신한다는 것은 두 칸을 레이저로 연결할 수 있음을 의미한다.
레이저는 C에서만 발사할 수 있고, 빈 칸에 거울('/', '\')을 설치해서 방향을 90도 회전시킬 수 있다.

# 접근
다익스트라 알고리즘을 이용해서 해결하였다. 최소 경로 배열에 방향 정보도 포함하여 확인하였고, 중복해서 방문하는 노드가 없도록 하였다.

# 입력
첫째 줄에 W와 H가 주어진다. (1 ≤ W, H ≤ 100)
둘째 줄부터 H개의 줄에 지도가 주어진다. 지도의 각 문자가 의미하는 것은 다음과 같다.
.: 빈 칸
*: 벽
C: 레이저로 연결해야 하는 칸
'C'는 항상 두 개이고, 레이저로 연결할 수 있는 입력만 주어진다.

# 출력
첫째 줄에 C를 연결하기 위해 설치해야 하는 거울 개수의 최솟값을 출력한다.

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

cll W = 100, H = 100, directions[4][2] = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
ll w, h, st0 = -1, st1 = -1, en0, en1;
ll dp[H][W][4] = {{{}}};
char mat[H][W] = {{}};
bool visited[H][W][4] = {{{}}};

bool isValid(ll i, ll l)
{
    return i >= 0 && i < h && l >= 0 && l < w;
}

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    memset(dp, -1, sizeof(dp));

    cin >> w >> h;
    for (ll i = 0; i < h; ++i)
    {
        cin.ignore();
        for (ll l = 0; l < w; ++l)
        {
            cin >> mat[i][l];
            if (mat[i][l] == 'C' && st0 == -1)
            {
                st0 = i, st1 = l;
            }
            else if (mat[i][l] == 'C')
            {
                en0 = i, en1 = l;
            }
        }
    }

    pqpll pq;
    pq.push(make_pair(0, st0 * W + st1));
    pq.push(make_pair(0, W * H + st0 * W + st1));
    pq.push(make_pair(0, 2 * W * H + st0 * W + st1));
    pq.push(make_pair(0, 3 * W * H + st0 * W + st1));
    dp[st0][st1][0] = dp[st0][st1][1] = dp[st0][st1][2] = dp[st0][st1][3] = 0;

    while (!pq.empty())
    {
        ll w = -pq.top().first, dir = pq.top().second / (W * H), i = (pq.top().second % (W * H)) / W, l = pq.top().second % W;
        pq.pop();

        if (visited[i][l][dir])
        {
            continue;
        }

        for (ll d : {0, 3, 1})
        {
            ll _dir = (d + dir) % 4, _i = i + directions[_dir][0], _l = l + directions[_dir][1];
            if (!isValid(_i, _l) || mat[_i][_l] == '*' || (dp[_i][_l][_dir] != -1 && dp[_i][_l][_dir] < w + (d != 0)))
            {
                continue;
            }

            dp[_i][_l][_dir] = w + (d != 0);
            pq.push(make_pair(-dp[_i][_l][_dir], _dir * W * H + _i * H + _l));
        }
        visited[i][l][dir] = true;
    }

    ll result = LLONG_MAX;
    for (ll i = 0; i < 4; ++i)
    {
        if (dp[en0][en1][i] != -1)
            result = min(result, dp[en0][en1][i]);
    }

    cout << result << "\n";

    return 0;
}
```
