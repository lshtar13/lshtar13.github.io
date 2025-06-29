---
title: '6850 BOJ'
description: 'Cows'
pubDate: 'Jun 29 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Convec Hull"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/6850)

## 접근

볼록 껍질을 구하고 외적을 이용해 볼록 다각형의 넓이를 구하는 방식으로 해결하였다.
외적을 이용하는 것과 신발끈 공식이 같은 의미임을 이 문제를 통해 알게 되었다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef vector<pll> vpll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 1e4;
ll n;
pll cords[N];

inline ll ccw(pll &a, pll &b, pll &c) {
  return a.first * b.second + b.first * c.second + c.first * a.second -
         b.first * a.second - c.first * b.second - a.first * c.second;
}

inline bool cmp0(pll &a, pll &b) {
  if (a.second == b.second) {
    return a.first < b.first;
  } else {
    return a.second < b.second;
  }
}

inline bool cmp1(pll &a, pll &b) {
  ll value = ccw(cords[0], a, b);
  if (value) {
    return value > 0;
  } else if (a.second == b.second) {
    return a.first < b.first;
  } else {
    return a.second < b.second;
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  FOR(i, n) { cin >> cords[i].first >> cords[i].second; }
  swap(*cords, *min_element(cords, cords + n, cmp0));
  sort(cords + 1, cords + n, cmp1);

  vpll hull;
  FOR(i, n) {
    while (hull.size() >= 2 &&
           ccw(hull[hull.size() - 2], hull[hull.size() - 1], cords[i]) <= 0) {
      hull.pop_back();
    }
    hull.push_back(cords[i]);
  }

  ll result = 0, size = hull.size();
  FOR(i, size) { result += ccw(hull[0], hull[i], hull[(i + 1) % size]); }
  cout << result / 100 << "\n";

  return 0;
}
```