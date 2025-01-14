---
title: '2233 BOJ'
description: '사과 나무'
pubDate: 'Oct 14 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Stack", "Lowest Common Ancestor", "LCA"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2233)
사과나무는 나무(tree)의 일종으로, 각각의 정점에 정확히 한 개의 사과가 있고, 모든 내부 정점(자식이 있는 정점)이 최소 두 개의 자식을 갖는 나무이다. 예를 들면 아래의 그림은 사과나무의 예이다. 나무같이 보이기 위해서 그림은 루트를 아래에 그린다.
![image](https://github.com/user-attachments/assets/abc8a0c7-631f-4a0d-a17d-bb8aeaf9eb18)
이러한 사과나무에 서식하는 벌레를 생각해 보자. 이 벌레는 이 사과나무의 루트에서 DFS 순서로 탐색을 하게 된다. 자식이 여러 개인 경우에는 (뒤집혀진 그림에서) 왼쪽을 먼저 방문하게 된다. 이러한 탐색을 하면서, 새로운 노드를 방문할 때 0을, 모든 자식 노드를 방문하고 리턴할 때 1을 나열하면 하나의 이진 수열이 된다. 위의 그림으로 이진 수열을 만들면 다음과 같다.
0	0	0	1	0	1	1	0	1	1
a	b	c	 	d	 	 	e	 	 
 	 	 	c	 	d	b	 	e	a
이진수의 각 숫자들은 그 숫자가 0이든 1이든 하나의 정점에 대응되게 된다. 즉 0의 경우에는 새로 방문되는 정점에 대응되고, 1의 경우에는 리턴하기 전에 있었던 정점에 대응된다. 위의 표에서는 각 숫자에 대응되는 정점도 표시하였다.
이러한 사과나무에서 썩은 사과가 발견된 경우에는 가지를 잘라 내어야 한다. 만약 우리가 어떤 정점을 제거하면, 그 정점과 그 자손 정점들이 모두 제거되게 된다. 위의 예에서 b를 제거하면 b, c, d가 모두 제거되게 된다.
만약 한 개의 사과가 썩은 경우라면 그 사과를 제거하면 되지만, 두 개의 사과가 썩은 경우라면 문제가 복잡해진다. 사과나무의 성질을 유지하기 위해서, 우리는 오직 한 개의 사과만 제거할 수 있다. 이 경우 루트를 제거하면 되지만, 루트를 제거하게 되면 멀쩡한 사과들을 많이 잃게 된다(제거되는 것은 잃는 것). 따라서 우리는 한 개의 사과를 제거하되, 이를 통해 두 개(이하)의 썩은 사과를 함께 제거하고, 그러면서도 가장 적은 개수의 멀쩡한 사과를 잃도록 잘라야 한다. 위의 예에서 c, d의 사과가 썩은 경우에는 b를 제거하면 된다.
사과나무에 대한 정보가 주어졌을 때, 제거해야 하는 사과를 알아내는 프로그램을 작성하시오.

# 접근
최소공통조상 개념을 이용하여 해결하였다. 결국 잘라야 하는 지점이 두 노드의 공통 조상이기 때문이다. 
트리의 구조를 파악하기 위해서 스택을 사용하였고, 이러한 접근은 전중후위표현식 문제나 괄호 문제를 해결할 때 사용한 아이디어를 차용한 것이다.
최소공통조상을 빠르게 찾기 위해서 sparse table을 사용하였고, query를 처리하는 과정에서도 다른 최소공통조상 문제를 해결하는 과정에서 알게된 최저화 기법을 사용하였다.</br>
다른 사람들의 풀이를 보니 dp를 사용할 수 있을 것 같았다. Top-down 형식으로 중복되는 구조를 파악하기 용이할 것 같다.

# 입력
첫째 줄에 정점의 개수 N(1 ≤ N ≤ 2,000)이 주어진다. 둘째 줄에는 벌레가 만드는 2×N자리의 이진수가 주어진다. 셋째 줄에는 썩은 사과의 위치를 나타내는 두 정수 X, Y가 주어진다. 이는 2×N자리의 이진수에서 X번째의 숫자에 대응되는 정점과, Y번째 숫자에 대응되는 정점에 있는 사과가 썩었다는 의미이다. 이때 두 정점이 서로 같을 수도 있다.
# 출력
첫째 줄에 제거해야 할 사과를 나타내는 두 정수 i, j를 출력한다. 제거해야 할 사과를 Z라고 했을 때, 이는 Z를 방문할 때의 0의 위치와 Z에서 리턴될 때의 1의 위치가 이진수에서 각각 i, j 번째임을 나타낸다.

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

cll N = 2000;
ll n, x, y, same[2 * N + 1] = {}, parents[2 * N + 1][11] = {{}};

ll query(ll idx, ll k)
{
    for (ll i = 10; i >= 0; --i)
    {
        if (k & (1 << i))
        {
            idx = parents[idx][i];
        }
    }

    return idx;
}

ll depth(ll i)
{
    ll st = 0, en = 2000, ans;
    while (st <= en)
    {
        ll mid = (st + en) / 2;
        if (query(i, mid) <= 1)
        {
            ans = mid, en = mid - 1;
        }
        else
        {
            st = mid + 1;
        }
    }

    return ans;
}

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> n;
    cin.ignore();
    stack<ll> s;
    s.push(0);
    for (ll t, i = 1; i <= 2 * n; ++i)
    {
        char c;
        cin >> c;
        if (c == '0')
        {
            s.push(i);
        }
        else
        {
            t = s.top();
            same[t] = i, same[i] = t;
            s.pop();
            parents[t][0] = s.top();
        }
    }
    cin.ignore();
    cin >> x >> y;
    x = min(x, same[x]), y = min(y, same[y]);

    for (ll i = 1; i <= n; ++i)
    {
        for (ll l = 1; l < 11; ++l)
        {
            parents[i][l] = parents[parents[i][l - 1]][l - 1];
        }
    }

    ll depthX = depth(x), depthY = depth(y), minDepth = min(depthX, depthY),
       dx = depthX - minDepth, dy = depthY - minDepth;
    ll st = 0, en = minDepth, ans, ansDepth;
    while (st <= en)
    {
        ll mid = (st + en) / 2, _depthX = dx + mid, _depthY = dy + mid,
           _x = query(x, _depthX), _y = query(y, _depthY);
        if (_x == _y)
        {
            ansDepth = mid, en = mid - 1;
        }
        else
        {
            st = mid + 1;
        }
    }
    ans = query(x, dx + ansDepth);

    cout << min(ans, same[ans]) << " " << max(ans, same[ans]);

    return 0;
}
```
