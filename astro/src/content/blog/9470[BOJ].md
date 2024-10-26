---
title: '9470 BOJ'
description: 'Strahler 순서'
pubDate: 'Oct 26 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Topological Sort"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/9470)
지질학에서 하천계는 유향그래프로 나타낼 수 있다. 
강은 간선으로 나타내며, 물이 흐르는 방향이 간선의 방향이 된다. 노드는 호수나 샘처럼 강이 시작하는 곳, 강이 합쳐지거나 나누어지는 곳, 바다와 만나는 곳이다.

![image](https://github.com/user-attachments/assets/ee10704d-505a-42e2-827c-b925d37caeb4)


네모 안의 숫자는 순서를 나타내고, 동그라미 안의 숫자는 노드 번호를 나타낸다.

하천계의 Strahler 순서는 다음과 같이 구할 수 있다.

강의 근원인 노드의 순서는 1이다.
나머지 노드는 그 노드로 들어오는 강의 순서 중 가장 큰 값을 i라고 했을 때, 들어오는 모든 강 중에서 Strahler 순서가 i인 강이 1개이면 순서는 i, 2개 이상이면 순서는 i+1이다.
하천계의 순서는 바다와 만나는 노드의 순서와 같다. 바다와 만나는 노드는 항상 1개이며, 위의 그림의 Strahler 순서는 3이다.

하천계의 정보가 주어졌을 때, Strahler 순서를 구하는 프로그램을 작성하시오.

실제 강 중에서 Strahler 순서가 가장 큰 강은 아마존 강(12)이며, 미국에서 가장 큰 값을 갖는 강은 미시시피 강(10)이다.

# 접근
위상정렬을 이용해서 풀었다. 간선 정보를 입력받을 때 degree를 체크하고, 다시 한번 degree가 0인 노드들을 확인하여 위상정렬을 시작한다. degree가 0인 노드들의 order은 1로 설정한다.
이후 간선을 지워나가면서, order와 degree를 최신화한다. 간선을 지울 때, 가리켜지는 노드(A)에 대하여 다음 두 동작을 수행한다.
* 가리키는 노드의 order와 현재 A의 order를 비교하여, 같으면 1만큼 증가시키고 다르면 더 큰 order를 갖는다.
* degree를 1만큼 감소시킨다. 만약, degree가 1이 되면 A를 큐에 집어넣고 A의 order에 대하여 가리키는 최대 order의 개수에 따라 최신화한다.

Strahelr 순서는 order을 1000으로 나눈 몫이다. 나머지는 해당 노드를 가리키는 노드들의 최대 strahelr순서의 개수이다.

# 입력
첫째 줄에 테스트 케이스의 수 T (1 ≤ T ≤ 1000)가 주어진다.

각 테스트 케이스의 첫째 줄에는 K, M, P가 주어진다. K는 테스트 케이스 번호, M은 노드의 수, P는 간선의 수이다. (2 ≤ M ≤ 1000) 다음 P개 줄에는 간선의 정보를 나타내는 A, B가 주어지며, A에서 B로 물이 흐른다는 뜻이다. (1 ≤ A, B ≤ M) M은 항상 바다와 만나는 노드이며, 밖으로 향하는 간선은 존재하지 않는다.

# 출력
각 테스트 케이스마다 테스트 케이스 번호와 입력으로 주어진 하천계의 Strahler 순서를 한 줄에 하나씩 출력한다.

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

cll M = 1000;

void solve(void)
{
    ll k, m, p, degree[M] = {}, order[M] = {};
    cin >> k >> m >> p;
    vvll edges(m);
    for (ll a, b, i = 0; i < p; ++i)
    {
        cin >> a >> b;
        edges[--a].emplace_back(--b);
        ++degree[b];
    }

    qll q;
    for (ll i = 0; i < m; ++i)
    {
        if (!degree[i])
        {
            order[i] = 1001;
            q.push(i);
        }
    }

    ll result;
    while (!q.empty())
    {
        ll node = q.front();
        q.pop();

        for (auto &av : edges[node])
        {
            if (order[av] / 1000 == order[node] / 1000)
            {
                ++order[av];
            }
            else
            {
                order[av] = max(order[av], order[node]);
            }

            if (!--degree[av])
            {
                order[av] = (order[av] / 1000 + (order[av] % 1000 > 1)) * 1000 + 1;
                q.push(av);
                result = order[av];
            }
        }
    }

    cout << k << " " << result / 1000 << "\n";
}

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    ll t;
    cin >> t;
    while (t--)
    {
        solve();
    }

    return 0;
}
```
