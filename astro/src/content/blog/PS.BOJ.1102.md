---
title: '1102 BOJ'
description: '발전소'
pubDate: 'Jan 18 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "DP", "Dynamic Programming"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1102)

## 접근

비트마스킹을 이용한 다이내믹 프로그래밍으로 해결하였다.

가동될 발전소 노드에 대한 정보를 비트마스킹으로 표현하고,
그러한 상태를 만드는데 필요한 최소 비용을 dp배열에 저장하였다.
상태 별로 최소 비용을 구할 때는, 마지막으로 연결할 발전소를 선정하고
해당 발전소를 연결함으로 인해 발생하는 전체 비용 중 최소값을 찾아 저장하였다.
마지막 발전소를 제외한 나머지 발전소를 연결하는 비용을 구해야 하는데
해당 과정에서 dp에 저장한 값을 재사용하는 식으로 실행 시간을 줄였다.

처음 문제를 읽었을 때부터 dp임을 짐작했다.
그러나, 비트 마스킹을 통한 방법은 떠올리진 못하고 bfs를 통해서 해결하려 했다.
잘 안 풀려서 문제를 다시 읽어보니 발전소의 개수가 상당히 작다는 것을 발견하고
비트마스킹을 이용하기로 하였다.
경우의 수가 충분히 작을 경우엔, 비트마스킹을 떠올리는 게 나쁘지 않은 것 같다.

## 코드

```c++
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
typedef vector<pll> vpll;
typedef vector<vll> vvll;
typedef vector<vpll> vvpll;
#define FOR1(a, A) for (ll a = 0; a < A; ++a)
#define FOR2(a, b, A, B)                                                       \
  for (ll a = 0; a < A; ++a)                                                   \
    for (ll b = 0; b < B; ++b)

cll N = 16, INF = N * 36 + 1;
ll n, p, genStatus = 0, costs[N][N] = {{}}, dp[1 << N] = {};

ll num(ll status) {
  ll result = 0;
  for (ll i = 0; i < n; ++i) {
    result += bool(status & (1 << i));
  }

  return result;
}

ll find(ll status) {
  if (dp[status] <= INF) {
    return dp[status];
  }

  ll result = INF;
  for (ll prvStatus, prvCost, station = 0; station < n; ++station) {
    if (!(status & (1 << station))) {
      continue;
    } else if (genStatus & (1 << station)) {
      continue;
    }

    prvStatus = status & ~(1 << station);
    prvCost = find(prvStatus);
    for (ll prvStation = 0; prvStation < n; ++prvStation) {
      if (!(prvStatus & (1 << prvStation))) {
        continue;
      }

      result = min(result, prvCost + costs[prvStation][station]);
    }
  }
  return dp[status] = result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  FOR2(i, l, n, n) { cin >> costs[i][l]; }
  FOR1(i, n) {
    char c;
    cin >> c;
    if (c == 'Y') {
      genStatus |= (1 << i);
    }
  }
  cin >> p;

  memset(dp, 0x3f3f3f, sizeof(dp));
  dp[genStatus] = 0;
  ll result = INF;
  for (ll status = 0; status < (1 << n); ++status) {
    if (num(status | genStatus) < p) {
      continue;
    }

    result = min(result, find(status | genStatus));
  }

  cout << (result == INF ? -1 : result) << "\n";

  return 0;
}
```