---
title: '1948 BOJ'
description: '임계경로'
pubDate: 'Oct 10 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Topological Sort", "Depth-First Search", "DFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1948)
월드 나라는 모든 도로가 일방통행인 도로이고, 싸이클이 없다. 
그런데 어떤 무수히 많은 사람들이 월드 나라의 지도를 그리기 위해서, 어떤 시작 도시로부터 도착 도시까지 출발을 하여 가능한 모든 경로를 탐색한다고 한다.
이 지도를 그리는 사람들은 사이가 너무 좋아서 지도를 그리는 일을 다 마치고 도착 도시에서 모두 다 만나기로 하였다. 
그렇다고 하였을 때 이들이 만나는 시간은 출발 도시로부터 출발한 후 최소 몇 시간 후에 만날 수 있는가? 즉, 마지막에 도착하는 사람까지 도착을 하는 시간을 의미한다.
어떤 사람은 이 시간에 만나기 위하여 1분도 쉬지 않고 달려야 한다. 이런 사람들이 지나는 도로의 수를 카운트 하여라.
출발 도시는 들어오는 도로가 0개이고, 도착 도시는 나가는 도로가 0개이다.

# 접근
위상 정렬과 역추적을 통해 풀었다.

## [위상정렬](https://yoongrammer.tistory.com/86)
노드들의 전후 관계가 주어졌을 때, 이를 고려하여 정렬하는 알고리즘이다.
위상정렬은 각 edge들을 하나씩 소거해가며 그래프를 조사하는데, 이 과정에서 (시작점 -> 현재 노드) 구간의 최대 경로값을 갱신한다.
1. `degree`가 0인 노드의 edge들 조사.
2. 각 edge를 소거(조사)할 때, 해당 edge를 고려하여 각 노드들의 최대 경로값 수정.
3. Destination의 최대 경로값이 정답.
## 역추적
Destination 노드에서 시작하여 최대 경로값을 만드는 edge들을 조사한다. 중복이 되지 않게 방문 배열을 만들어 활용한다.
1. Destination의 edge(source -> destination)들 조사.
2. 해당 edge의 가중치와 source의 최대 경로값의 합이 destination의 최대 경로값이 되면, 해당 edge를 방문 처리하고 result에 1을 가한다.
3. source를 새 destination으로 삼아 위 절차대로 조사한다.
## Others
DFS나 데이크스트라 알고리즘을 활용한 풀이도 보았다. 최적화만 잘하면 위상정렬을 사용하지 않고도 풀 수 있을 것 같다.

# 입력
첫째 줄에 도시의 개수 n(1 ≤ n ≤ 10,000)이 주어지고 둘째 줄에는 도로의 개수 m(1 ≤ m ≤ 100,000)이 주어진다. 
그리고 셋째 줄부터 m+2줄까지 다음과 같은 도로의 정보가 주어진다. 처음에는 도로의 출발 도시의 번호가 주어지고 그 다음에는 도착 도시의 번호, 그리고 마지막에는 이 도로를 지나는데 걸리는 시간이 주어진다. 
도로를 지나가는 시간은 10,000보다 작거나 같은 자연수이다.
그리고 m+3째 줄에는 지도를 그리는 사람들이 출발하는 출발 도시와 도착 도시가 주어진다.
모든 도시는 출발 도시로부터 도달이 가능하고, 모든 도시로부터 도착 도시에 도달이 가능하다.

# 출력
첫째 줄에는 이들이 만나는 시간을, 둘째 줄에는 1분도 쉬지 않고 달려야 하는 도로의 수가 몇 개인지 출력하여라.

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

cll N = 10000, M = 100000;
ll n, m, src, dest, degree[N] = {};
bool checked[N][N] = {{}};
vector<pll> edges[N];
vector<pll> rev[N];

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
        rev[b].emplace_back(make_pair(a, c));
        ++degree[b];
    }
    cin >> src >> dest;
    --src, --dest;

    ll maxDur[N] = {}, maxPrev[N] = {};
    pqpll pq;
    pq.push(make_pair(0, src));
    while (!pq.empty())
    {
        ll idx = pq.top().second, w = pq.top().first;
        pq.pop();
        if (w != maxDur[idx])
        {
            continue;
        }
        for (auto &p : edges[idx])
        {
            ll _idx = p.first, _w = p.second;
            if (maxDur[_idx] < w + _w)
            {
                maxDur[_idx] = w + _w;
            }
            if (!--degree[_idx])
            {
                pq.push(make_pair(maxDur[_idx], _idx));
            }
        }
    }

    cout << maxDur[dest] << "\n";

    ll result = 0;
    qll q;
    q.push(dest);
    while (!q.empty())
    {
        ll idx = q.front(), tgt = maxDur[idx];
        q.pop();
        for (auto &p : rev[idx])
        {
            if (!checked[idx][p.first] && maxDur[p.first] + p.second == tgt)
            {
                ++result;
                q.push(p.first);
                checked[idx][p.first] = true;
            }
        }
    }

    cout << result << "\n";

    return 0;
}
```
