---
title: '2211 BOJ'
description: '네트워크 복구'
pubDate: 'Oct 13 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "Dijkstra Algorithm"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2211)
N(1 ≤ N ≤ 1,000)개의 컴퓨터로 구성된 네트워크가 있다. 
이들 중 몇 개의 컴퓨터들은 서로 네트워크 연결이 되어 있어 서로 다른 두 컴퓨터 간 통신이 가능하도록 되어 있다. 
통신을 할 때에는 서로 직접 연결되어 있는 회선을 이용할 수도 있으며, 회선과 다른 컴퓨터를 거쳐서 통신을 할 수도 있다.

각 컴퓨터들과 회선은 그 성능이 차이가 날 수 있다. 따라서 각각의 직접 연결되어 있는 회선을 이용해서 통신을 하는데 걸리는 시간이 서로 다를 수 있다. 
심지어는 직접 연결되어 있는 회선이 오히려 더 느려서, 다른 컴퓨터를 통해서 통신을 하는 것이 더 유리할 수도 있다. 
직접 연결되어 있는 회선을 사용할 경우에는 그 회선을 이용해서 통신을 하는 데 드는 시간만큼이 들게 된다. 
여러 개의 회선을 거치는 경우에는 각 회선을 이용해서 통신을 하는 데 드는 시간의 합만큼의 시간이 걸리게 된다.

어느 날, 해커가 네트워크에 침입하였다. 네트워크의 관리자는 우선 모든 회선과 컴퓨터를 차단한 후, 해커의 공격을 막을 수 있었다. 
관리자는 컴퓨터에 보안 시스템을 설치하려 하였는데, 버전 문제로 보안 시스템을 한 대의 슈퍼컴퓨터에만 설치할 수 있었다. 
한 컴퓨터가 공격을 받게 되면, 네트워크를 통해 슈퍼컴퓨터에 이 사실이 전달이 되고, 그러면 슈퍼컴퓨터에서는 네트워크를 이용해서 보안 패킷을 전송하는 방식을 사용하기로 하였다. 준비를 마친 뒤, 관리자는 다시 네트워크를 복구하기로 하였다. 이때, 다음의 조건들이 만족되어야 한다.

해커가 다시 공격을 할 우려가 있기 때문에, 최소 개수의 회선만을 복구해야 한다. 물론, 그렇다면 아무 회선도 복구하지 않으면 되겠지만, 이럴 경우 네트워크의 사용에 지장이 생기게 된다. 따라서 네트워크를 복구한 후에 서로 다른 두 컴퓨터 간에 통신이 가능하도록 복구해야 한다.
네트워크를 복구해서 통신이 가능하도록 만드는 것도 중요하지만, 해커에게 공격을 받았을 때 보안 패킷을 전송하는 데 걸리는 시간도 중요한 문제가 된다. 따라서 슈퍼컴퓨터가 다른 컴퓨터들과 통신하는데 걸리는 최소 시간이, 원래의 네트워크에서 통신하는데 걸리는 최소 시간보다 커져서는 안 된다.
원래의 네트워크에 대한 정보가 주어졌을 때, 위의 조건을 만족하면서 네트워크를 복구하는 방법을 알아내는 프로그램을 작성하시오.

# 접근
다익스트라 알고리즘을 사용하고, 최다 경로를 조사하는 과정에서 경로를 추적 기록하는 방식으로 해결하였다.</br>
처음에는 최소스패닝트리로 풀어야 하는 줄 알았으나, 예제 출력도 잘 안나오고 생각을 해보니 아니란 것을 알았다.
최소스패닝트리로 풀면 전체적으로는 간선 가중치의 합이 최소가 될 수 있으나, 각 노드들과 1번 노드와의 경로를 살펴보면 최단 경로가 아닐 수 있다.</br>
각각 최단 경로를 가지려면 다익스트라 알고리즘을 통해 최단 경로를 우선 구하고 해당 최단 경로값을 갖는 경로를 추적 기록하여야 한다.

# 입력
첫째 줄에 두 정수 N, M이 주어진다. 다음 M개의 줄에는 회선의 정보를 나타내는 세 정수 A, B, C가 주어진다. 이는 A번 컴퓨터와 B번 컴퓨터가 통신 시간이 C (1 ≤ C ≤ 10)인 회선으로 연결되어 있다는 의미이다. 컴퓨터들의 번호는 1부터 N까지의 정수이며, 1번 컴퓨터는 보안 시스템을 설치할 슈퍼컴퓨터이다. 모든 통신은 완전쌍방향 방식으로 이루어지기 때문에, 한 회선으로 연결된 두 컴퓨터는 어느 방향으로도 통신할 수 있다.

# 출력
첫째 줄에 복구할 회선의 개수 K를 출력한다. 다음 K개의 줄에는 복구한 회선을 나타내는 두 정수 A, B를 출력한다. 이는 A번 컴퓨터와 B번 컴퓨터를 연결하던 회선을 복구한다는 의미이다. 출력은 임의의 순서대로 하며, 답이 여러 개 존재하는 경우에는 아무 것이나 하나만 출력하면 된다.

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

cll N = 1000, C = 10, INF = 1e4 + 1, directions[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
ll n, m;

int main(void)
{
    // ios::sync_with_stdio(false);
    // cin.tie(NULL);
    // cout.tie(NULL);

    cin >> n >> m;
    vector<vector<pll>> edges(n);
    for (ll a, b, c, i = 0; i < m; ++i)
    {
        cin >> a >> b >> c;
        --a, --b;
        edges[a].emplace_back(make_pair(b, c));
        edges[b].emplace_back(make_pair(a, c));
    }

    vll minDist(n, INF), prev(n, -1);
    priority_queue<pll, vector<pll>, greater<pll>> pq;
    minDist[0] = 0, prev[0] = -1;
    pq.push(make_pair(0, 0));
    while (!pq.empty())
    {
        ll node = pq.top().second, dist = pq.top().first;
        pq.pop();

        if (minDist[node] < dist)
        {
            continue;
        }

        for (auto &e : edges[node])
        {
            ll _node = e.first, w = e.second, newDist = dist + w;
            if (newDist < minDist[_node])
            {
                minDist[_node] = newDist, prev[_node] = node;
                pq.push(make_pair(newDist, _node));
            }
        }
    }

    cout << n - 1 << "\n";
    for (ll i = 1; i < n; ++i)
    {
        cout << prev[i] + 1 << " " << i + 1 << "\n";
    }

    return 0;
}
```
