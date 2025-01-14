---
title: '6209 BOJ'
description: '제자리 멀리뚜기'
pubDate: 'Oct 22 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Parametric Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/6209)
GSHS에서는 체력측정에서 제자리 멀리뛰기가 가장 중요하다. GSHS의 체육선생님께서는 학생들의 제자리 멀리뛰기 실력을 키워주게 하기 위해서 특수 훈련을 준비중이다.

특수 훈련장소는 GSHS특수 트레이닝 센터로 이 곳은 끓는 용암으로 가득 차 있다. 체육선생님께서는 이 용암으로 가득찬 방의 가운데 있는 돌섬에 학생들을 가두고 학생들이 탈출해 나오기를 기대하고 있다. 탈출할 수 있는 방법은 단 한가지 이다. 돌섬에서 탈출구까지 띄엄 띄엄 존재하는 작은 돌섬들로 점프하여 탈출구까지 가는 것이다.

돌섬에서 탈출구 사이에는 총 n개의 작은 돌섬이 있다. 선생님은 이 n개의 작은 돌섬들 중 m개를 제거하여 학생들이 최대한 멀리뛰기 연습의 효율을 높이기 위해서 학생들이 각 돌섬을 점프한 거리의 최솟값을 최대한 크게 하려고 한다. 물론 학생들은 체력이 좋기 때문에 두 돌섬이 아무리 멀더라도 점프할 수 있다. 즉, 빠지는 일은 없다.

그리고 학생들은 탈출 시 n-m개의 모든 돌섬을 밟으면서 탈출해야 한다.

학 생들이 갇힌 돌섬으로부터 탈출구까지의 거리 d가 주어지고, 각 n개의 작은 돌섬의 위치(갇힌 돌섬으로 부터의 거리)가 주어지며, 제거할 수 있는 작은 돌섬의 수 m이 주어질 때, m개를 제거한 후 학생들이 점프하는 최소거리의 최댓값을 구하는 프로그램을 작성하시오.

# 접근
매개변수 탐색을 이용하여 해결하였다. 점프하는 최소거리를 임의로 정하고, 건너뛴 돌의 개수가 많거나 출구에 제대로 도착하지 못할 경우 최소거리를 줄이고 반대의 경우 늘리는 식으로 탐색했다.</br>
전형적인 매개변수 탐색 문제였다. ~의 최대 혹은 최소값을 구하시오 류의 문제에 대해서 자연스레 매개변수 탐색 기법이 생각나게 된다. 또한, 정답의 조건이 조금 까다로울 수 있어서
 ans 변수의 활용이 중요하다.

# 입력
첫 번째 줄에는 갇힌 돌섬으로부터 탈출구까지의 거리 d(1 ≤ d ≤ 1,000,000,000), 작은 돌섬의 수 n(0 ≤ n ≤ 50,000), 제거할 수 있는 작은 돌섬의 수 m (0 ≤ m ≤ n)이 공백으로 구분되어 주어진다.
두 번째 줄부터 n줄에 걸쳐서 갇힌섬으로부터 각 작은 돌섬이 얼마나 떨어져 있는지를 나타내는 하나의 정수가 한 줄에 하나씩 주어진다. (단, 두 돌섬은 같은 위치에 있을 수 없다.)

# 출력
m개의 작은섬을 제거한 뒤 학생들이 점프할 수 있는 최소거리의 최댓값을 출력한다.

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

cll D = 1e9, N = 5e4, M = N;
ll d, n, m, stones[N + 1] = {};

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> d >> n >> m;
    for (ll i = 0; i < n; ++i)
    {
        cin >> stones[i];
    }
    stones[n] = d;
    sort(stones, stones + n + 1);

    ll st = 0, en = d, ans;
    while (st <= en)
    {
        ll mid = (st + en) / 2, prv = 0, deleted = 0;
        for (ll i = 0; i <= n; ++i)
        {
            if (stones[i] - prv < mid)
            {
                ++deleted;
                continue;
            }
            prv = stones[i];
        }

        if (prv != d || deleted > m)
        {
            en = mid - 1;
        }
        else
        {
            ans = mid, st = mid + 1;
        }
    }

    cout << ans << "\n";

    return 0;
}
```
