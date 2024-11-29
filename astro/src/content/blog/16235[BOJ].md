---
title: '16235 BOJ'
description: '나무 제테크'
pubDate: 'Nov 29 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Deque","Implementation"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/16235)

## 접근

Deque를 이용해 해결하였다.

Deque는 앞뒤 모두 O(1)로 삽입이 가능하여, 별도의 정렬이 필요없다.
봄에 양분을 나이순으로 섭취하기 때문에, 자리별로 나무들이 나이순으로 정렬되어 있어야 한다.
새로 생기는 나무들의 나이가 모두 1인것을 감안하면, deque를 이용하였을 때 정렬하지 않아도 된다.

초기에 주어진 나무들은 서로 자리가 겹치지 않는다.
따라서 초기에는 정렬을 해주지 않아도 된다. 어짜피 자리에 한 그루의 나무만 존재하기 때문이다.
나무가 추가로 생기면, 정렬해줄 필요가 있다. 어린 나무부터 양분을 섭취하기 때문이다.
Deque는 vector와는 다르게 앞에 원소를 추가하는 작업과 뒤에 추가하는 작업의 시간 복잡도(O(1))가
동일하다.
Vector라면 새로 만들어진 나무의 정보를 뒤에 추가하고 정렬하는 과정 혹은 시간복잡도가 큰,
앞에 정보를 추가하는 작업을 거쳐야 했겠지만, deque의 경우엔 바로 앞에 추가하면 된다.
따라서, 시간복잡도를 크게 단축시킬 수 있었다.

이번에 deque를 처음 사용해보았는데, 익숙치 않아서 실수가 잦았다.
조금 더 최적화를 할 수 있을 것 같은데 여의치 않았다.

# 코드

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

cll N = 10, M = 100, K = 1000,
    directions[8][2] = {{-1, -1}, {-1, 0}, {-1, 1}, {0, -1},
                        {0, 1},   {1, -1}, {1, 0},  {1, 1}};
ll n, m, k, nourish[N][N] = {{}}, A[N][N] = {{}};

inline bool isValid(ll i, ll l) { return i >= 0 && i < n && l >= 0 && l < n; }

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> k;
  FOR2(i, l, n, n) {
    cin >> A[i][l];
    nourish[i][l] = 5;
  }

  typedef pair<ll, pll> info;
  deque<info> trees, dead, alive;

  for (ll x, y, z, i = 0; i < m; ++i) {
    cin >> x >> y >> z;
    trees.emplace_back(make_pair(z, make_pair(--x, --y)));
  }

  FOR1(year, k) {
    // spring
    for (auto it = trees.begin(); it < trees.end(); ++it) {
      ll x = it->second.first, y = it->second.second, z = it->first;
      if (nourish[x][y] < z) {
        dead.emplace_back(make_pair(z / 2, make_pair(x, y)));
      } else {
        nourish[x][y] -= z;
        alive.emplace_back(make_pair(z + 1, make_pair(x, y)));
      }
    }
    trees.clear();

    // summer
    for (auto &d : dead) {
      ll x = d.second.first, y = d.second.second, z = d.first;
      nourish[x][y] += z;
    }
    dead.clear();

    // autum
    for (auto &a : alive) {
      ll x = a.second.first, y = a.second.second, z = a.first;
      trees.emplace_back(a);

      if (z % 5 != 0) {
        continue;
      }

      for (auto &d : directions) {
        ll _x = x + d[0], _y = y + d[1];

        if (isValid(_x, _y)) {
          trees.emplace_front(make_pair(1, make_pair(_x, _y)));
        }
      }
    }
    alive.clear();

    // winter
    FOR2(i, l, n, n) { nourish[i][l] += A[i][l]; }
  }

  cout << trees.size() << "\n";

  return 0;
}
```