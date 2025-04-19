---
title: '1014 BOJ'
description: '컨닝'
pubDate: 'Apr 19 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP", "Bitmask"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1014)

## 접근

비트마스크를 이용한 다이내믹 프로그래밍으로 해결하였다.
제한이 10밖에 안되는 것을 보고는 바로 bitmask를 사용해야 됨을 알아차렸다.
상당히 나이브한 구현이지만, 시간 제한을 잘 통과하였으니 그만 아니겠는가.

뒤에서부터 학생들을 채워 넣는다고 가정하면,
어떤 줄의 배치에 대하여 영향을 주는 줄은 바로 뒷줄의 배치 뿐이다.
dp[i][status]는 i+1번째 줄의 배치가 status와 같을 때,
i번째 줄 부터 배치하였을 경우 최대로 배치할 수 있는 학생의 수를 나타낸다.
나는 모든 status에 대하여 가능 여부를 조사하는 식으로 조사하였다.
다른 사람들은 가능한 status를 dfs로 미리 구하는 식으로 시간을 절약한 것 같다.
더 똑똑한 사람들은 이분 매칭 알고리즘을 사용하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 10, M = 10, STATUS = 1 << 10;
ll n, m, dp[N][STATUS] = {{}};
bool mat[N][M] = {{}};

ll calc(ll status) {
  ll result = 0;
  for (ll i = 0; i < m; ++i) {
    result += bool(status & (1 << i));
  }

  return result;
}

bool avail(ll line, ll nstatus, ll pstatus) {
  bool newStatus[M] = {}, prvStatus[M] = {};
  for (ll i = 0; i < m; ++i) {
    newStatus[i] = bool(nstatus & (1 << i));
    prvStatus[i] = bool(pstatus & (1 << i));
  }

  for (ll i = 0; i < m; ++i) {
    if (!newStatus[i]) {
      continue;
    }

    if (!mat[line][i]) {
      return false;
    }

    if (i > 0 && newStatus[i - 1]) {
      return false;
    }

    if (i < m - 1 && newStatus[i + 1]) {
      return false;
    }
  }

  for (ll i = 0; i < m; ++i) {
    if (!prvStatus[i]) {
      continue;
    }

    if (i > 0 && newStatus[i - 1]) {
      return false;
    }

    if (i < n - 1 && newStatus[i + 1]) {
      return false;
    }
  }

  return true;
}

ll find(ll line, ll pstatus) {
  if (line < 0) {
    return 0;
  } else if (dp[line][pstatus] != -1) {
    return dp[line][pstatus];
  }

  ll &result = dp[line][pstatus] = 0;
  for (ll nstatus = 0; nstatus < (1 << m); ++nstatus) {
    if (avail(line, nstatus, pstatus)) {
      result = max(result, find(line - 1, nstatus) + calc(nstatus));
    }
  }

  return result;
}

ll solve() {
  cin >> n >> m;
  for (ll i = 0; i < n; ++i) {
    cin.ignore();
    for (ll l = 0; l < m; ++l) {
      char c;
      cin >> c;
      mat[i][l] = c == '.';
    }
  }

  return find(n - 1, 0);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    memset(dp, -1, sizeof(dp));
    cout << solve() << "\n";
  }

  return 0;
}
```