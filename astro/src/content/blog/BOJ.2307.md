---
title: '2307 BOJ'
description: '도로검문'
pubDate: 'Oct 16 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dijkstra"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2307)
아래 그림은 어떤 도시의 주요 지점과 그 지점들 간의 이동시간을 나타낸 그래프이다. 그래프의 노드는 주요 지점을 나타내고 두 지점을 연결한 도로(에지)에 표시된 수는 그 도로로 이동할 때 걸리는 분 단위의 시간을 나타낸다. 두 지점 a와 b를 연결하는 도로는 도로(a,b)로 표시한다.</br>

![image](https://github.com/user-attachments/assets/ffe93105-d9db-4bb5-8e69-cc1ddca08a7a)</br>

예를 들어 도로(1,2)와 도로(2,3)를 통하여 지점1에서 지점3으로 갈 때 걸리는 시간은 3분이다. 도로는 모두 양방향이라고 가정하므로 도로(a,b)와 도로(b,a)를 지날 때 걸리는 시간은 항상 같다고 한다.

어떤 범죄용의자가 입력 데이터에 표시된 도시로 진입하여 이 도시를 가장 빠른 시간 내에 빠져나가고자 한다. 그런데 이 사실을 알고 있는 경찰이 어떤 하나의 도로(에지)를 선택하여 이 도로에서 검문을 하려고 한다. 
따라서 용의자는 이 도로를 피해서 가장 빠르게 도시를 탈출하고자 한다. 이 경우 경찰이 검문을 위하여 선택하는 도로에 따라서 용의자의 가장 빠른 탈출시간은 검문이 없을 때에 비하여 더 늘어날 수 있다.

문제는 도로검문을 통하여 얻을 수 있는 탈출의 최대 지연시간을 계산하는 것이다. 추가설명은 다음과 같다.

두 개의 지점을 직접 연결하는 도로가 있는 경우, 그 도로는 유일하다.
도시의 지점(노드)은 1에서 N번까지 N개의 연속된 정수로 표시된다.
용의자가 도시에 진입하는 지점은 항상 1번이고 도시를 빠져 나가기 위하여 최종적으로 도달해야하는 지점은 항상 N번 지점이다.
용의자는 검문을 피해서 가장 빨리 도시를 빠져나가고자 하고, 경찰은 적절한 도로를 선택하여 이 용이자들의 탈출시간을 최대한 지연시키고자 한다.
각 도시 지점 간을 이동하는 시간은 항상 양의 정수이다.
입력 도시의 도로망에 따라서 경찰이 어떤 도로를 막으면 용의자는 도시를 탈출하지 못할 수도 있다. 이 경우 검문으로 인하여 지연시킬 수 있는 탈출시간은 무한대이다. 이 경우에는 -1을 출력해야 한다.

그림 1에서 볼 때 검문이 없을 경우 용의자가 도시를 탈출하는데 걸리는 시간은 4분이다. 만일 경찰이 도로(4,3)을 막으면 그 탈출시간을 지연시킬 수 없으므로 지연시간은 0이다. 
만일 도로(2,3)을 막으면, 용의자들이 가장 빠르게 탈출할 수 있는 시간은 5분이므로 탈출지연시간은 1분이고, 도로(3,6)을 막으면 탈출지연시간은 2분이다.

여러분은 입력 데이터에 표시된 도로망을 읽고, 경찰이 한 도로를 막고 검문함으로써 지연시킬 수 있는 최대시간을 정수로 출력하여야한다. 
만일 지연효과가 없으면 0을 출력해야하고, 도시를 빠져나가지 못하게 만들 수 있으면(지연시간이 무한대) -1을 출력해야 한다.

# 접근
다익스트라 알고리즘을 활용하여 풀었다. 최단 경로를 구하고, 해당 경로를 역추적해가며 경로상의 각 노드들을 제외하여 경로를 재탐색하는 식으로 구성하였다.</br>
이러한 풀이를 하기 위해선 몇가지 의문점을 해결하여야 한다.
* 거쳐간 노드는 같은데 경로가 다를 가능성 --> 두 노드를 잇는 경로는 유일하므로 고려하지 않아도 된다.
* 처음에 구한 최단 경로외의 경로가 있을 가능성 --> 두개 이상의 최단 거리 경로가 존재할때는 경로 역추적이 의미가 없기 때문에 고려하지 않아도 된다.

# 입력
첫 줄에는 지점의 수를 나타내는 정수 N(6 ≤ N ≤ 1000)과 도로의 수 M(6 ≤ M ≤ 5000)이 주어진다. 그 다음 이어 나오는 M개의 각 줄에는 도로(a, b)와 그 통과시간 t가 a b t 로 표시된다. 단 이 경우 a < b 이고 1 ≤ t ≤ 10000이다.

# 출력
경찰이 하나의 도로를 막음으로써 지연시킬 수 있는 최대 시간을 정수로 출력한다. (단, 그 지연시간이 무한대이면 -1을 출력해야 한다.)

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

cll N = 1000, M = 5000, INF = 1e10;
ll n, m, prevNode[N] = {};
vector<vector<pll>> edges(N);

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> n >> m;
    for (ll a, b, t, i = 0; i < m; ++i)
    {
        cin >> a >> b >> t;
        --a, --b;
        edges[a].emplace_back(make_pair(b, t));
        edges[b].emplace_back(make_pair(a, t));
    }

    ll minDist[N] = {}, visited[N] = {};
    priority_queue<pll, vector<pll>, greater<pll>> pq;
    pq.push(make_pair(0, 0));
    minDist[0] = 0, visited[0] = 1;
    while (!pq.empty())
    {
        ll w = pq.top().first, idx = pq.top().second;
        pq.pop();

        if (visited[idx] && w > minDist[idx])
        {
            continue;
        }

        for (auto &p : edges[idx])
        {
            ll _idx = p.first, _w = p.second;
            if (visited[_idx] && minDist[_idx] <= w + _w)
            {
                continue;
            }
            visited[_idx] = 1, minDist[_idx] = w + _w, prevNode[_idx] = idx;
            pq.push(make_pair(w + _w, _idx));
        }
    }

    ll result = 0;
    if (!visited[n - 1])
    {
        cout << 0;
        goto END;
    }

    for (ll from = prevNode[n - 1]; from; from = prevNode[from])
    {
        ll temp, dist[N] = {}, _visited[N] = {};
        pq.push(make_pair(0, 0));
        dist[0] = 0, visited[0] = 1, dist[from] = 0, _visited[from] = 1;
        while (!pq.empty())
        {
            ll w = pq.top().first, idx = pq.top().second;
            pq.pop();

            if (visited[idx] && w > dist[idx])
            {
                continue;
            }

            for (auto &p : edges[idx])
            {
                ll _idx = p.first, _w = p.second;
                if ((_visited[_idx] && w + _w >= dist[_idx]) || _idx == from)
                {
                    continue;
                }

                _visited[_idx] = 1, dist[_idx] = w + _w;
                pq.push(make_pair(w + _w, _idx));
            }
        }

        if (!_visited[n - 1])
        {
            cout << -1 << "\n";
            goto END;
        }
        result = max(result, dist[n - 1] - minDist[n - 1]);
    }

    cout << result << "\n";

END:
    return 0;
}
```
