---
title: '22866 BOJ'
description: '탑 보기'
pubDate: 'Mar 05 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Stack"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/22866)

## 접근

스택을 이용해 해결하였다.

정렬되어 있는 스택, 모노톤(단조) 스택을 이용해 해결하였다.
오른쪽을 바라봤을 경우와 왼쪽을 바라봤을 경우로 나누어 조사해야 한다.
스택에 현재 높이보다 큰 값들만 들어가게끔 스택을 조정하면,
조정된 스택의 크기가 현재 위치에서 바라볼 수 있는 건물의 개수이다.
현재 건물의 높이를 스택에 넣어주고 다음 건물에서 바라볼 수 있는 건물의 개수를 조사하면 된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;

cll N = 1e5, L = 1e5;
ll n, heights[N] = {}, avail[N][2] = {{}}, near[N][2] = {{}};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> heights[i];
  }

  stack<pll> s0;
  for (ll i = n - 1; i >= 0; --i) {
    while (!s0.empty()) {
      if (s0.top().first <= heights[i]) {
        s0.pop();
      } else {
        break;
      }
    }

    avail[i][0] = s0.size();
    near[i][0] = s0.empty() ? -1 : s0.top().second;

    s0.push({heights[i], i});
  }

  stack<pll> s1;
  for (ll i = 0; i < n; ++i) {
    while (!s1.empty()) {
      if (s1.top().first <= heights[i]) {
        s1.pop();
      } else {
        break;
      }
    }

    avail[i][1] = s1.size();
    near[i][1] = s1.empty() ? -1 : s1.top().second;
    s1.push({heights[i], i});
  }

  for (ll i = 0, navail; i < n; ++i) {
    navail = avail[i][0] + avail[i][1];
    cout << navail << " ";
    if (near[i][0] != -1 && near[i][1] != -1) {
      ll dist0 = near[i][0] - i, dist1 = i - near[i][1];
      if (dist1 <= dist0) {
        cout << near[i][1] + 1;
      } else {
        cout << near[i][0] + 1;
      }
    } else if (near[i][0] != -1) {
      cout << near[i][0] + 1;
    } else if (near[i][1] != -1) {
      cout << near[i][1] + 1;
    }
    cout << "\n";
  }

  return 0;
}
```