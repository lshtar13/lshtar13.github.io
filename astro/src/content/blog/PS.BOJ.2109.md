---
title: '2109 BOJ'
description: '순회공연'
pubDate: 'Oct 12 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Greedy", "Priority Queue"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2109)
한 저명한 학자에게 n(0 ≤ n ≤ 10,000)개의 대학에서 강연 요청을 해 왔다. 각 대학에서는 d(1 ≤ d ≤ 10,000)일 안에 와서 강연을 해 주면 p(1 ≤ p ≤ 10,000)만큼의 강연료를 지불하겠다고 알려왔다. 각 대학에서 제시하는 d와 p값은 서로 다를 수도 있다. 이 학자는 이를 바탕으로, 가장 많은 돈을 벌 수 있도록 순회강연을 하려 한다. 강연의 특성상, 이 학자는 하루에 최대 한 곳에서만 강연을 할 수 있다.

예를 들어 네 대학에서 제시한 p값이 각각 50, 10, 20, 30이고, d값이 차례로 2, 1, 2, 1 이라고 하자. 이럴 때에는 첫째 날에 4번 대학에서 강연을 하고, 둘째 날에 1번 대학에서 강연을 하면 80만큼의 돈을 벌 수 있다.

# 접근
가장 p가 큰 강연 부터 처리하는 방식으로 해결하였다. 수행한 강연에 대하여 d를 days 배열에 저장해두고, 매번 이 배열을 순회하며 강연이 수행될 수 있는 최소한의 날짜를 구하는 방식으로 풀었다.</br>
통과는 했지만 다른 사람들과의 실행시간 차이가 많이 나 그들의 풀이를 살펴보니, d순으로 탐색을 진행하고 우선순위 큐를 이용하여 d까지의 강연 중 가장 p가 큰 강연 d개만 수행하는 방식으로 푼 것을 확인하였다.</br>
제출할 때도 시간이 좀 오래 걸리겠거니 했지만, 너무 많이 차이 났다. 이 문제와 같이, 최대 ~까지 가능한 경우의 수를 생각할 때는 앞에서부터 생각하는 것이 나은것 같다.

# 입력
첫째 줄에 정수 n이 주어진다. 다음 n개의 줄에는 각 대학에서 제시한 p값과 d값이 주어진다.


# 출력
첫째 줄에 최대로 벌 수 있는 돈을 출력한다.

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

cll N = 10000, D = 10000, P = 10000;
ll n;
pqpll pq;

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> n;
    for (ll p, d, i = 0; i < n; ++i)
    {
        cin >> p >> d;
        pq.push(make_pair(p, d));
    }
    ll result = 0, limit = 0;
    vll days;
    while (!pq.empty())
    {
        ll p = pq.top().first, d = pq.top().second;
        pq.pop();

        for (ll i = limit; i < days.size(); ++i)
        {
            if (days[i] - 1 == i)
            {
                limit = i + 1;
            }
        }
        if (limit < d)
        {
            result += p;
            days.emplace_back(d);
            sort(days.begin(), days.end());
        }
    }

    cout << result << "\n";

    return 0;
}
```
