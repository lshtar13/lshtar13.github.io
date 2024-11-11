---
title: '12757 BOJ'
description: '전설의 JBNU'
pubDate: 'Nov 11 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Binary Search"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/12757)

전설의 프로그래머 윤준하는 독자적인 데이터베이스 시스템 JBNU(Jeong Bo Neoh Um)를 만들었다.

준하가 생각한 데이터베이스의 기본 골자는 데이터에 접근하기 위한 Key와 그 데이터를 나타내는 Value로 구성되어 있다. 사용자는 Key를 알고 있어야만 원하는 데이터에 접근할 수 있다.

하지만 준하는 건망증이 심해 Key를 매번 잊어버리기 일쑤였다. 따라서 준하는 JBNU를 개조하여 잘못된 Key를 입력하더라도 그 잘못된 Key와 제일 근접한 Key를 찾아주는 메커니즘을 도입하였다.

Key와 Value는 항상 정수로 되어있다. 가장 근접한 Key란 두 수의 차이가 가장 작은 Key를 의미한다. 또한, 정보의 정확성을 위해 두 수의 차이가 K보다 큰 경우는 Key로 인정하지 않기로 하였다.

프로젝트 베끼기의 달인 승균이는 데이터베이스 시간에 JBNU를 모방하기로 했다. 그러나 준하는 전설이기 때문에 그가 만든 프로그램은 찾을 방법이 없었고, 하는 수 없이 같은 조원인 당신에게 맡기려고 한다.

JBNU의 초기 데이터 상태가 주어질 때, 데이터 추가, 수정 및 검색을 지원하는 프로그램을 작성해보자.

# 접근

맵을 이용한 이분탐색으로 풀었다. 여러가지 경우의 수를 고려해야 해서 구현의 어려움을 겪었다.
특히 맵도 lower_bound를 적용할 수 있는지, 이터레이터에 대한 사칙연산이 가능한지 이번 문제를 풀면서 처음 알았다.

# 입력

첫 줄에는 초기 데이터의 개수인 
N(1 \le N \le 100,000) 과 명령 횟수인 
\(M(1 \le M \le 100,000)\), 가장 근접한 Key까지의 거리의 제한인 
\(K(1 \le K \le 10,000)\)가 주어진다. 

입력의 둘째 줄부터 N개의 줄에는 초기 데이터인 Key와 Value 값이 주어진다. 모든 Key와 Value는 
\(1,000,000,000\) 이하의 음이 아닌 정수이다. 같은 Key를 갖는 데이터는 없다.

다음 M개의 줄에는 아래와 같은 명령이 주어진다.

1 Key Value : 해당 Key와 Value를 가진 데이터를 추가한다. Key가 이미 존재하는 입력은 주어지지 않는다.
2 Key Value : 해당 Key로 검색된 데이터를 Value로 변경한다. 조건을 만족하는 유일한 Key가 없는 경우 무시한다.
3 Key : 해당 Key로 검색된 데이터를 출력한다. 조건을 만족하는 Key가 없는 경우 -1을 출력한다. 만약 해당하는 Key가 두 개 이상 존재한다면 ?를 출력한다. 모든 출력은 개행을 포함해야 한다.

# 출력

각 줄에 걸쳐 3번 명령에 대한 결과를 출력한다.

# 코드

```cpp
#include <algorithm>
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

cll N = 1e5, M = 1e5, K = 1e5, INF = 1e9 + 1;
ll n, m, limit;
map<ll, ll> db;

ll find(ll k) {
  auto it = db.lower_bound(k);
  if (it == db.end()) {
    --it;
    if (it->first < k && k - it->first > limit)
      return -2;
  } else if (it == db.begin()) {
    if (it->first > k && it->first - k > limit)
      return -2;
  } else {
    auto lower = prev(it);
    if (it->first - k > limit && k - lower->first > limit)
      return -2;
    if (k - lower->first < it->first - k)
      it = lower;
    else if (k - lower->first == it->first - k)
      return -1;
  }

  return it->first;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> limit;
  for (ll k, v, i = 0; i < n; ++i) {
    cin >> k >> v;
    db[k] = v;
  }

  for (ll cmd, k, v, key, i = 0; i < m; ++i) {
    cin >> cmd >> k;
    if (cmd == 1) {
      cin >> v;
      db[k] = v;
    }
    if (cmd == 2) {
      cin >> v;
      key = find(k);
      if (key >= 0) {
        db[key] = v;
      }
    }
    if (cmd == 3) {
      key = find(k);
      if (key >= 0) {
        cout << db[key] << "\n";
      } else if (key == -1) {
        cout << "?" << "\n";
      } else {
        cout << "-1" << "\n";
      }
    }
  }

  return 0;
}
```
