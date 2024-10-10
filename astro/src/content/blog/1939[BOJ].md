---
title: '1939 BOJ'
description: '역사'
pubDate: 'Oct 09 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Binary Search", "Parametric Search", "Breadth-First Search", "BFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1939)
N(2 ≤ N ≤ 10,000)개의 섬으로 이루어진 나라가 있다. 이들 중 몇 개의 섬 사이에는 다리가 설치되어 있어서 차들이 다닐 수 있다.
영식 중공업에서는 두 개의 섬에 공장을 세워 두고 물품을 생산하는 일을 하고 있다.
물품을 생산하다 보면 공장에서 다른 공장으로 생산 중이던 물품을 수송해야 할 일이 생기곤 한다.
그런데 각각의 다리마다 중량제한이 있기 때문에 무턱대고 물품을 옮길 순 없다. 만약 중량제한을 초과하는 양의 물품이 다리를 지나게 되면 다리가 무너지게 된다.
한 번의 이동에서 옮길 수 있는 물품들의 중량의 최댓값을 구하는 프로그램을 작성하시오.

# 접근
매개변수 탐색을 활용해서 해결했다. 임의로 물품 중량의 최댓값을 설정하고, 해당 물품이 목표 공장까지 이동할 수 있는지 조사하였다. 
만약, 가능하다면 중량의 최댓값을 좀 더 높여서 가능한지 조사하고 불가능하다면 최댓값을 줄였다. 목표 공장까지 이동할 수 있는지는 BFS를 통해서 조사하였다.

# 입력
첫째 줄에 N, M(1 ≤ M ≤ 100,000)이 주어진다. 다음 M개의 줄에는 다리에 대한 정보를 나타내는 세 정수 A, B(1 ≤ A, B ≤ N), C(1 ≤ C ≤ 1,000,000,000)가 주어진다. 이는 A번 섬과 B번 섬 사이에 중량제한이 C인 다리가 존재한다는 의미이다.
서로 같은 두 섬 사이에 여러 개의 다리가 있을 수도 있으며, 모든 다리는 양방향이다. 마지막 줄에는 공장이 위치해 있는 섬의 번호를 나타내는 서로 다른 두 정수가 주어진다. 공장이 있는 두 섬을 연결하는 경로는 항상 존재하는 데이터만 입력으로 주어진다.
# 출력
첫째 줄에 답을 출력한다.

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
typedef vector<vector<pll>> vvpll;

cll N = 10000;
ll n, m, src, dest;
vvpll edges(N);

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> n >> m;
    for (ll a, b, c, i = 0; i < m; ++i)
    {
        cin >> a >> b >> c;
        --a, --b;
        edges[a].emplace_back(make_pair(b, c));
        edges[b].emplace_back(make_pair(a, c));
    }
    cin >> src >> dest;
    --src, --dest;

    ll st = 0, en = 1e9, ans;
    while (st <= en)
    {
        ll mid = (st + en) / 2;
        bool visited[N] = {};
        qll q;
        visited[src] = true;
        q.push(src);
        while (!q.empty())
        {
            ll from = q.front();
            q.pop();
            for (auto &p : edges[from])
            {
                if (visited[p.first] || p.second < mid)
                {
                    continue;
                }

                visited[p.first] = true;
                q.push(p.first);
            }
        }

        if (visited[dest])
        {
            ans = mid, st = mid + 1;
        }
        else
        {
            en = mid - 1;
        }
    }

    cout << ans << "\n";

    return 0;
}
```
