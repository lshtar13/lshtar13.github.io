---
title: '12764 BOJ'
description: '싸지방에 간 준하'
pubDate: 'Nov 12 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Priority-queue", "Greedy"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/12764)

현재 대한민국 해군에 소속되어있는 준하는 문제를 풀기 위해 매일같이 사이버 지식 정보방 통칭 싸지방에 다닌다. 그러나 최근 문제가 생겼다. 싸지방에 사람이 몰려 컴퓨터 수가 모자라게 된 것이다. 이런 사태를 도저히 용납할 수 없었던 준하는 곧 전역하는 선임을 설득해 민원을 넣도록 하는 데 성공했다.

마침내 부대에서는 민원을 받아들이기로 하였고, 컴퓨터를 증설하기로 했다. 또한, 컴퓨터 간의 사용률에 따라 다른 성능의 컴퓨터를 설치하고자 한다.

하지만 예산이 부족해 사람 수 만큼 컴퓨터를 살 수가 없었다. 고심에 고심을 거듭한 준하는 모든 사람이 항상 정해진 시간에 싸지방을 이용한다는 사실을 발견했다.

컴퓨터가 있는 자리에는 1번부터 순서대로 번호가 매겨져 있다. 모든 사람은 싸지방에 들어왔을 때 비어있는 자리 중에서 번호가 가장 작은 자리에 앉는 것이 규칙이다.

준하가 발견한 사실과 이용 규칙을 가지고, 모든 사람이 기다리지 않고 싸지방을 이용할 수 있는 컴퓨터의 최소 개수와 자리별로 몇 명의 사람이 사용했는가를 구하시오.

# 접근

우선순위 큐를 세개 이용하여 해결하였다. 
사용자에 대하여 먼저 온 순서대로 처리하기 위해, 아직 사용 중인 컴퓨터 중 사용가능한 것을 추리기 위해,
사용가능한 것들 중 가장 빠른 번호의 것을 선택하기 위해 우선순위 큐가 필요했다.

입력으로 주어지는 사용 정보가 정렬되어 들어오는 것이 아니기 때문에, 우선순위큐를 이용하여 빨리 입장하는 순서대로 처리하게 해준다.

아직 사용 중인 컴퓨터 중 현재 들어온 사용자의 입장 시간보단, 사용 종료 시간이 느린 컴퓨터도 있을 수 있다.
이러한 컴퓨터들을 사용가능한 컴퓨터들의 집합으로 옮겨주어야 한다. 사용 종료 시간 순으로 정렬되어 있어야
옮기는 작업이 빠르게 끝나기 때문에 우선순위 큐를 하나 생성해 사용한다.

사용 가능한 컴퓨터들 중 번호가 빠른 컴퓨터를 먼저 사용해야 한다. 번호가 빠른 컴퓨터를 고르기 위한
우선순위 큐를 하나 생성해 사용한다.

# 입력

첫째 줄에 사람의 수를 나타내는 \(N\)이 주어진다. \((1 \le N \le 100,000)\) 둘째 줄부터 \(N\)개의 줄에 걸쳐서 각 사람의 컴퓨터 이용 시작 시각 \(P\)와 종료 시각 \(Q\)가 주어진다. \((0 \le P \lt Q \le 1,000,000)\) 

시작 시각이나 종료 시각이 다른 사람과 겹치는 경우는 없다.

# 출력

첫째 줄에 사람이 모든 사람이 기다리지 않아도 되는 컴퓨터의 최소 개수 \(X\)를 출력한다.

둘째 줄에는 1번 자리부터 \(X\)번 자리까지 순서대로 각 자리를 사용한 사람의 수를 띄어쓰기 간격으로 출력한다.

# 코드

```cpp
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef unsigned long long ull;
typedef pair<ll, ll> pll;
typedef pair<ull, ull> pull;
typedef const ll cll;
typedef vector<ll> vll;
typedef vector<pll> vpll;
typedef vector<vll> vvll;
typedef vector<vpll> vvpll;
typedef queue<ll> qll;
typedef queue<pll> qpll;
typedef priority_queue<ll> pqll;
typedef priority_queue<pll> pqpll;
typedef priority_queue<ll, vll, greater<ll>> pqgll;
typedef priority_queue<pll, vpll, greater<pll>> pqgpll;
#define FOR1(a, A) for (ll a = 0; a < A; ++a)
#define FOR2(a, b, A, B)                                                       \
  for (ll a = 0; a < A; ++a)                                                   \
    for (ll b = 0; b < B; ++b)

cll N = 1e5;
ll n, nseats[N] = {}, nseat = 1;
pqgpll users, nonavail;
pqgll avail;

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll p, q, i = 0; i < n; ++i) {
    cin >> p >> q;
    users.push(make_pair(p, q));
  }

  avail.push(0);
  while (!users.empty()) {
    ll p = users.top().first, q = users.top().second;
    users.pop();
    while (!nonavail.empty() && nonavail.top().first <= p) {
      avail.push(nonavail.top().second);
      nonavail.pop();
    }

    if (avail.empty()) {
      avail.push(nseat++);
    }

    ++nseats[avail.top()];
    nonavail.push(make_pair(q, avail.top()));
    avail.pop();
  }

  cout << nseat << "\n";
  for (ll i = 0; i < nseat; ++i) {
    cout << nseats[i] << " ";
  }

  return 0;
}
```
