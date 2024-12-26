---
title: '1280 BOJ'
description: '나무 심기'
pubDate: 'Dec 26 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1280)

## 접근

세그먼트 트리를 이용해 해결하였다.
아이디어 자체는 어렵지 않게 떠올렸는데, 오버플로우에 많은 시간을 소비하였다.
오버플로우를 다루는 데 있어서, 대충 이렇게 되겠거니 하는 식의 마인드를 버리고 직접 계산해 봐야한다는 중요한 교훈을 얻었다.

좌표의 합을 보관하는 트리와 나무의 그루 수를 보관하는 트리, 총 두개의 트리를 이용하였다.
두 트리 모두 0 ~ N(200,000)까지의 인덱스를 가지고, 초기값은 전부 0이다.
나무 하나를 심을 때마다 두 트리를 최신화한다.
좌표 x에 나무를 심으면, 좌표 트리는 인덱스 x에 대하여 x만큼 더해 최신화한다.
그루수 트리는 인덱스 x에 대하여 1만큼 더해 최신화 한다.

나무의 거리를 계산할 때는, x보다 작은 좌표의 나무 수와 해당 나무들의 좌표 합을 두 트리를 이용해 구한다.
뒤에 등장할 나무들은 아직 트리에 반영되어 있지 않기 때문에 전체 구간을 상대로 합을 구하면 된다.

오버플로우를 막기 위해서 모듈러 연산을 사용하였다.
처음에는 대충 사칙연산 들어가는 곳에는 전부 모듈러 연산하면 되겠거니 하고는 덕지덕지 %를 붙여놨었다.
그런데, 계속 오답이 나오길래 딱히 필요없는 곳은 빼었더니 통과되었다.
아직 잘 모르겠는 모듈러 이다 ....

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

cll N = 2e5, INF = 1e9 + 7;
ll n, seg[N * 20] = {}, nseg[N * 20] = {};

ll search(ll tgt0, ll tgt1, ll st, ll en, ll node, ll arr[]) {
  if (tgt0 <= st && en <= tgt1) {
    return arr[node];
  } else if (en < tgt0 || tgt1 < st) {
    return 0;
  }

  ll mid = (st + en) / 2, left = search(tgt0, tgt1, st, mid, node * 2, arr),
     right = search(tgt0, tgt1, mid + 1, en, node * 2 + 1, arr);
  return left + right;
}

void update(ll idx, ll num, ll st, ll en, ll node, ll arr[]) {
  arr[node] = arr[node] + num;
  if (st == en) {
    return;
  }

  ll mid = (st + en) / 2;
  if (idx <= mid) {
    update(idx, num, st, mid, node * 2, arr);
  } else {
    update(idx, num, mid + 1, en, node * 2 + 1, arr);
  }

  return;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  ll result = 1;
  for (ll left, right, nleft, nright, dist, num, i = 0; i < n; ++i) {
    cin >> num;

    left = search(0, num, 0, N - 1, 1, seg);
    right = search(num, N - 1, 0, N - 1, 1, seg);
    nleft = search(0, num, 0, N - 1, 1, nseg);
    nright = search(num, N - 1, 0, N - 1, 1, nseg);

    ll ldist = abs(num * nleft - left), rdist = abs(right - num * nright);
    dist = (ldist + rdist) % INF;
    result = i ? (result * dist) % INF : 1;

    update(num, num, 0, N - 1, 1, seg);
    update(num, 1, 0, N - 1, 1, nseg);
  }

  cout << result << "\n";

  return 0;
}
```