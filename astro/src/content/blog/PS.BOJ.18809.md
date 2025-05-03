---
title: '18809 BOJ'
description: 'Gaaaaaaaaaarden'
pubDate: 'May 03 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Breadth-First Search", "BFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/18809)

## 접근

BFS로 해결하였다.

초록색 배양액과 빨간색 배양액의 초기 배치에 대한 조합을 구하고,
해당 조합을 큐에 넣어 시작점으로 삼아 BFS를 구현하면 된다.
주의해야 할 점은, 꽃을 피우게 한 지점은 더이상 배양액을 퍼뜨리지 못하게 하는 것이다.
이 점에 대해선 BFS는 checked 배열을 순차적으로 갱신한다는 점을 이용해야 한다.
즉, n번만에 방문하는 지점들을 모두 처리한 후에야 n+1번만에 방문하는 지점들에 대한 계산을 한다는 점이다.
따라서, 만약 꽃이 핀 지점이 있다면 그 이전에 꽃이 피었을 수도 있을 가능성은 없다는 것이다.
또, 해당 지점에서 꽃이 핀다는 사실을 인지하지 못한 시점에 큐에 들어간, 해당 지점에서 파생된 지점을 걸러내기 위해선
탐색 전에 조건문을 통해 이전에 방문한 지점에서 꽃이 피었는지 확인하면 되는 것이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef queue<pll> qpll;
typedef vector<pll> vpll;
typedef vector<vpll> vvpll;

cll N = 50, M = 50, G = 5, R = 5, INF = N * M + 2,
    directions[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
ll n, m, g, r;
bool mat[N][M] = {{}};
vpll avail;

inline bool isValidCord(ll i, ll l) {
  return i >= 0 && i < n && l >= 0 && l < m && mat[i][l];
}

vvpll getN(vpll::iterator st, vpll::iterator en, ll n) {
  ll size = en - st;
  if (!n) {
    return {{}};
  }

  vvpll results;
  for (auto it = en - 1; it - st >= n - 1; --it) {
    for (auto &v : getN(st, it, n - 1)) {
      v.push_back(*it);
      results.emplace_back(v);
    }
  }

  return results;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> g >> r;
  for (ll i = 0; i < n; ++i) {
    for (ll l = 0, value; l < m; ++l) {
      cin >> value;
      mat[i][l] = value != 0;
      if (value == 2) {
        avail.emplace_back(i, l);
      }
    }
  }

  ll result = 0;
  for (auto &total : getN(avail.begin(), avail.end(), g + r)) {
    for (auto &greens : getN(total.begin(), total.end(), g)) {
      ll nflower = 0, checked[N][M] = {{}};
      bool flourished[N][M] = {{}};

      qpll q;
      set<pll> s;
      for (auto &green : greens) {
        s.insert(green);
        q.push(green);
        checked[green.first][green.second] = 1;
      }

      for (auto &red : total) {
        if (s.find(red) == s.end()) {
          q.push(red);
          checked[red.first][red.second] = -1;
        }
      }

      for (ll i, l, nvalue; !q.empty();) {
        tie(i, l) = q.front();
        q.pop();

        if (checked[i][l] == INF) {
          continue;
        }

        if (checked[i][l] > 0) {
          nvalue = checked[i][l] + 1;
        } else {
          nvalue = checked[i][l] - 1;
        }

        for (auto &d : directions) {
          ll ni = i + d[0], nl = l + d[1];
          if (!isValidCord(ni, nl)) {
            continue;
          }

          if (checked[ni][nl]) {
            if (checked[ni][nl] + nvalue == 0) {
              ++nflower, checked[ni][nl] = INF;
            }
            continue;
          }

          checked[ni][nl] = nvalue;
          q.push({ni, nl});
        }
      }

      result = max(result, nflower);
    }
  }

  cout << result << "\n";

  return 0;
}
```