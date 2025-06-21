---
title: '2254 BOJ'
description: '감옥 건설'
pubDate: 'Jun 21 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Convex Hull"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2254)

## 접근

볼록 껍질을 찾는 알고리즘을 활용해 해결하였다.

볼록 껍질을 찾는 과정을, 더 이상 감옥을 감싸는 볼록 껍질이 나타나지 않을 때까지 반복하는 식으로 해결하였다.
감옥을 감싸는지 여부는 감옥의 좌표도 볼록 껍질을 이룰 수 있는 좌표 집합에 포함 시켜 계산함으로써 조사하였다.
만들어낸 볼록껍질이 감옥을 포함하면 더 이상 감옥을 감싸는 볼록껍질을 만들어 낼 수 없는 것으로 판단할 수 있다.
이 방법은 불필요한 O(N)의 백트래킹 탐색과정을 생략할 수 있게 한다.

처음으로 풀어 본 볼록 껍질 문제이다.
생각보다 볼록 껍질을 구하는 알고리즘 자체는 쉬웠으나, 해당 과정을 여러번 하는 것을 구현하기가 까다로웠다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 1000, P = 1e5;
ll n, start;
pll prison, points[N + 1];
bool isIncluded[N + 1] = {};

inline ll ccw(pll cord0, pll cord1, pll cord2) {
  return cord0.first * cord1.second + cord1.first * cord2.second +
         cord2.first * cord0.second - cord1.first * cord0.second -
         cord2.first * cord1.second - cord0.first * cord2.second;
}

inline bool cmp0(ll a, ll b) {
  if (points[a].second == points[b].second) {
    return points[a].first < points[b].first;
  }
  return points[a].second < points[b].second;
}

inline bool cmp1(ll a, ll b) {
  return ccw(points[start], points[a], points[b]) >= 0;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> prison.first >> prison.second;
  FOR(i, n) { cin >> points[i].first >> points[i].second; }
  points[n] = prison;

  ll result = 0;
  while (true) {
    deque<ll> candidates, ans;
    FOR(i, n + 1) {
      if (!isIncluded[i]) {
        candidates.emplace_back(i);
      }
    }

    if (candidates.size() < 4) {
      goto End;
    }

    sort(candidates.begin(), candidates.end(), cmp0);
    start = candidates[0];
    sort(candidates.begin() + 1, candidates.end(), cmp1);

    isIncluded[candidates[0]] = true;
    ans.emplace_back(candidates[0]);
    candidates.pop_front();
    isIncluded[candidates[0]] = true;
    ans.emplace_back(candidates[0]);
    candidates.pop_front();
    for (auto &idx : candidates) {
      while (ans.size() >= 2 &&
             ccw(points[ans[ans.size() - 2]], points[ans[ans.size() - 1]],
                 points[idx]) <= 0) {
        isIncluded[ans.back()] = false;
        ans.pop_back();
      }
      isIncluded[idx] = true;
      ans.emplace_back(idx);
    }

    if (isIncluded[n]) {
      goto End;
    }

    ++result;
  }

End:
  cout << result << "\n";

  return 0;
}
```