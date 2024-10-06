---
title: '1613 BOJ'
description: '역사'
pubDate: 'Oct 05 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Floyd-Warshall", "Breadth-First Search", "BFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1613)
역사, 그 중에서도 한국사에 해박한 세준이는 많은 역사적 사건들의 전후 관계를 잘 알고 있다. 즉, 임진왜란이 병자호란보다 먼저 일어났으며, 무오사화가 기묘사화보다 먼저 일어났다는 등의 지식을 알고 있는 것이다.
세준이가 알고 있는 일부 사건들의 전후 관계들이 주어질 때, 주어진 사건들의 전후 관계도 알 수 있을까? 이를 해결하는 프로그램을 작성해 보도록 하자.

# 접근
플로이드-워셜 알고리즘을 활용해서 풀었다. 인접 행렬을 플로이드 워셜을 통해 채워넣었다. 만약 A에서 B에 접근 할 수 있다면 A는 B보다 먼저 일어난 것이다. A에서 B로, B에서 A로의 접근이 모두 불가능 할 경우 A사건과 B사건의 전후관계는 알 수 없는 것으로 간주한다.</br>
이러한 풀이를 위해 처음에 주어지는 관계 정보를 바탕으로 인접행렬을 작성한다.

## [플로이드-워셜](https://velog.io/@kimdukbae/%ED%94%8C%EB%A1%9C%EC%9D%B4%EB%93%9C-%EC%9B%8C%EC%85%9C-%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-Floyd-Warshall-Algorithm)
`n`개의 노드(사건)들을 각각 중간 지점으로 삼았을 경우, 다른 노드들 간의 접근 가능성이 달라지는 지 여부를 조사한다.
## [BFS(너비 우선 탐색, Breadth-First Search)](https://gmlwjd9405.github.io/2018/08/15/algorithm-bfs.html)
풀고 난 후 다른 사람들의 풀이를 보니, 플로이드-워셜 알고리즘을 사용하는 것보다 너비우선탐색(BFS)를 사용하는 것이 더 좋은 성능을 거두는 것을 확인했다.

# 입력
첫째 줄에 첫 줄에 사건의 개수 n(400 이하의 자연수)과 알고 있는 사건의 전후 관계의 개수 k(50,000 이하의 자연수)가 주어진다. 다음 k줄에는 전후 관계를 알고 있는 두 사건의 번호가 주어진다. 이는 앞에 있는 번호의 사건이 뒤에 있는 번호의 사건보다 먼저 일어났음을 의미한다. 물론 사건의 전후 관계가 모순인 경우는 없다. 다음에는 사건의 전후 관계를 알고 싶은 사건 쌍의 수 s(50,000 이하의 자연수)이 주어진다. 다음 s줄에는 각각 서로 다른 두 사건의 번호가 주어진다. 사건의 번호는 1보다 크거나 같고, N보다 작거나 같은 자연수이다.

# 출력
s줄에 걸쳐 물음에 답한다. 각 줄에 만일 앞에 있는 번호의 사건이 먼저 일어났으면 -1, 뒤에 있는 번호의 사건이 먼저 일어났으면 1, 어떤지 모르면(유추할 수 없으면) 0을 출력한다.

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

cll N = 400, K = 50000;
ll n, k, s;
bool mat[N][N] = {{}};

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> n >> k;
    for (ll c0, c1, i = 0; i < k; ++i)
    {
        cin >> c0 >> c1;
        --c0, --c1;
        mat[c0][c1] = true;
    }

    for (ll mid = 0; mid < n; ++mid)
    {
        for (ll i = 0; i < n; ++i)
        {
            for (ll l = 0; l < n; ++l)
            {
                mat[i][l] |= (mat[i][mid] && mat[mid][l]);
            }
        }
    }

    cin >> s;
    for (ll c0, c1, i = 0; i < s; ++i)
    {
        cin >> c0 >> c1;
        --c0, --c1;
        if (mat[c0][c1])
        {
            cout << -1 << "\n";
        }
        else if (mat[c1][c0])
        {
            cout << 1 << "\n";
        }
        else
        {
            cout << 0 << "\n";
        }
    }

    return 0;
}
```
