---
title: '9576 BOJ'
description: '책 나눠주기'
pubDate: 'Feb 21 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bipartite Matching"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/9576)

## 접근

이분 매칭을 이용해 해결하였다.

처음 풀어본 이분 매칭 문제이다.
가장 선호도가 낮은 선택지부터 채워넣는다고 생각하면 편할 것 같다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e3, M = 1e3;
ll n, m;

bool dfs(ll book, bool visited[], ll appls[][2], ll matched[]) {
  if (visited[book]) {
    return false;
  }

  visited[book] = true;
  ll owner = matched[book];
  if (!owner) {
    return true;
  }

  for (ll nbook = book + 1; nbook <= appls[owner][1]; ++nbook) {
    if (dfs(nbook, visited, appls, matched)) {
      matched[nbook] = owner;
      return true;
    }
  }

  return false;
}

ll avail(ll idx, ll appls[][2], ll matched[]) {
  bool visited[N] = {};
  for (ll book = appls[idx][0]; book <= appls[idx][1]; ++book) {
    if (dfs(book, visited, appls, matched)) {
      matched[book] = idx;
      return 1;
    }
  }

  return 0;
}

ll solve() {
  ll appls[M + 1][2] = {{}}, matched[N] = {};

  cin >> n >> m;
  for (ll i = 1; i <= m; ++i) {
    cin >> appls[i][0] >> appls[i][1];
    --appls[i][0], --appls[i][1];
  }

  ll result = 0;
  for (ll i = 1; i <= m; ++i) {
    result += avail(i, appls, matched);
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    cout << solve() << "\n";
  }

  return 0;
}
```