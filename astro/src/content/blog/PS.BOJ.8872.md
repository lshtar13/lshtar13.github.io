---
title: '8872 BOJ'
description: '빌라봉'
pubDate: 'Aug 06 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Depth First Search", "DFS", "Diameter of Tree", "Greedy"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/8872)

## 접근

트리의 지름과 중점 그리고 그리디 알고리즘을 이용해 해결하였다.

가장 반지름이 긴 트리의 중점에 나머지 트리들의 중점끼리 연결해야 한다.
이같이 연결하면 가장 긴 트리의 지름,
혹은 가장 긴 트리의 반지름과 두번째로 긴 트리의 반지름 그리고 새로 추가되는 간선의 길이의 합,
혹은 두번째로 긴 트리의 반지름과 세번째로 긴 트리의 반지름 그리고 새로 추가되는 간선의 길이의 두배의 합 중
가장 큰 값이 정답이 된다.

트리의 지름, 그리고 그것의 중점을 활용한다는 발상이 떠올리기 어려운 것 같다.
이 문제를 해결함으로써 solved.ac 티어가 플래티넘 1로 올라갔다.
사실 solved.ac 티어는 실력이 아니라 공부한 만큼 꾸준한 만큼 올라가는 것이기 때문에 큰 의미가 있다고 보긴 힘들지만,
지난 1년 4개월간의 군생활동안 꾸준히 공부했다는 것을 나타내는 방증이기에 개인적으로 기뻤다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)

typedef tuple<ll, ll, ll> info_t;

cll N = 1e5, M = N - 1, A = N - 1, B = N - 1, T = 1e4, L = 1e4;
ll n, m, nt, gidx = 0, prvs[N] = {}, lengths[N] = {};
vpll edges[N];
bool visited[N] = {}, finished[N] = {};

pll dfs(ll node, vector<bool> &visited) {
  visited[node] = true, finished[node] = true;
  pll result(node, 0);
  for (auto &p : edges[node]) {
    ll av = p.first, w = p.second;
    if (visited[av]) {
      continue;
    }

    prvs[av] = node, lengths[av] = w;
    pll nresult = dfs(av, visited);
    if (nresult.second + w > result.second) {
      result = {nresult.first, nresult.second + w};
    }
  }

  return result;
}

info_t findRoot(ll node) {
  vector<bool> visited0(N), visited1(N);
  ll end0 = dfs(node, visited0).first, end1, diameter;
  prvs[end0] = end0;
  tie(end1, diameter) = dfs(end0, visited1);

  ll half = 0;
  for (ll cur = end1; cur != end0; cur = prvs[cur]) {
    ll pdiff = abs(diameter - half * 2), nhalf = half + lengths[cur], ndiff;
    ndiff = abs(diameter - nhalf * 2);
    if (pdiff < ndiff) {
      return {cur, max(half, diameter - half), diameter};
    } else {
      half = nhalf;
    }
  }

  return {end0, diameter, diameter};
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> nt;
  FOR(i, 0, m) {
    ll a, b, t;
    cin >> a >> b >> t;
    edges[a].emplace_back(b, t);
    edges[b].emplace_back(a, t);
  }

  ll result = 0;
  vll lens, diameters;
  FOR(node, 0, n) {
    if (finished[node]) {
      continue;
    }

    ll root, maxLen, diameter;
    tie(root, maxLen, diameter) = findRoot(node);
    lens.emplace_back(maxLen);
    result = max(result, diameter);
  }
  sort(lens.begin(), lens.end(), greater<ll>());

  if (lens.size() >= 2) {
    result = max(result, lens[0] + lens[1] + nt);
  }
  if (lens.size() >= 3) {
    result = max(result, lens[1] + lens[2] + 2 * nt);
  }

  cout << result << "\n";

  return 0;
}
```