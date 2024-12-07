---
title: '2517 BOJ'
description: '달리기'
pubDate: 'Dec 07 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2517)

## 접근

세그먼트 트리를 이용해 해결하였다. 처음에 많이 헤메어서 자료를 찾아보면서 진행했다.

선수들의 능력치가 주어지면, 자신의 앞에 자신보다 능력치가 큰 선수가 몇 명있는지 알아내야 한다.
주어지는 N의 크기가 커서 매번 정렬해가면서 해결하는 것은 적절하지 않았다.
능력치와 인덱스를 동시에 고려해야 하는 점이 까다로웠다.

밑에 태그에 세그먼트 트리가 적혀 있길래, 세그먼트 트리 관련 문제들을 살펴보았다.
여러 문제들 중, LIS를 세그먼트 트리로 해결하는 문제가 이 문제와 맞닿아 있는 것을 확인했다.
LIS를 세그먼트 트리로 해결할 때, 원소들을 원소의 값을 기준으로 재정렬 하고
값이 작은 원소부터 해당 값을 최대값으로 하는 LIS의 길이를 세그먼트 트리에 저장하였다.
인덱스는 세그먼트 트리를 저장할 때 사용한다. 
[자세한 내용](https://blog.naver.com/bagzaru/223004433092?viewType=pc).

위 해결방법을 활용하였다.
선수들의 현재 위치와 능력치를 pair로 묶어, 능력치의 내림차순으로 정렬하였다.
능력치가 높은 선수들 먼저 세그먼트 트리에 넣으면서 구간(0 ~ 현재위치)의 선수들 수를 세어 등수를 파악한다.
능력치가 높은 선수들 먼저 삽입하기 때문에 구간 안에 능력치가 현재 선수보다 낮은 선수들은 포함되어 있지 않다.

다른 블로그들도 많이 참고해가며 해결한 문제다. 조금 어려웠다.

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

cll N = 5e5;
ll n, ranks[N] = {}, seg[10 * N] = {};
vpll infos;

void insert(ll s, ll e, ll node, const ll idx) {
  ++seg[node];
  if (s < e) {
    ll mid = (s + e) / 2;
    if (idx <= mid) {
      insert(s, mid, node * 2, idx);
    } else {
      insert(mid + 1, e, node * 2 + 1, idx);
    }
  }
}

ll find(ll s, ll e, ll node, const ll tgt) {
  if (s >= 0 && e <= tgt) {
    return seg[node];
  } else if (s > tgt) {
    return 0;
  }

  ll mid = (s + e) / 2;
  return find(s, mid, node * 2, tgt) + find(mid + 1, e, node * 2 + 1, tgt);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll abil, i = 0; i < n; ++i) {
    cin >> abil;
    infos.emplace_back(make_pair(abil, i));
  }
  sort(infos.begin(), infos.end(), greater<>());

  for (auto &info : infos) {
    ranks[info.second] = find(0, n - 1, 1, info.second);
    insert(0, n - 1, 1, info.second);
  }

  for (ll i = 0; i < n; ++i) {
    cout << ranks[i] + 1 << "\n";
  }

  return 0;
}
```