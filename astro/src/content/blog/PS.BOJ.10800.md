---
title: '10800 BOJ'
description: '컬러볼'
pubDate: 'Mar 27 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Prefix Sum"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/10800)

## 접근

누적합으로 해결하였다.

전체 누적합을 구하고, 색별로 누적합을 구해서 어떤 컬러볼에 대하여 색을 고려하지 않은 누적합에 같은 색의 누적합을 빼어
답을 구했다.
다만, 너무 경직되어 사고하는 바람에 효율적이지 못한 코드를 생산하였다.
현명한 사람들은 누적합을 미리 계산하고 구하지 않고, 정렬한 후 누적합을 순차적으로 계산하는 동시에 답을 구하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
typedef vector<pll> vpll;

cll N = 2e5, C = N, S = 2000;
ll n;
vll colors, sizes, sums, colorSize[N + 1], colorSum[N + 1];
vpll inputs;

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0, color, size; i < n; ++i) {
    cin >> color >> size;
    colors.push_back(color);

    sizes.push_back(size);
    sums.push_back(size);

    colorSize[color].push_back(sizes[i]);
    colorSum[color].push_back(sizes[i]);

    inputs.push_back({color, size});
  }

  sort(sizes.begin(), sizes.end());
  sort(sums.begin(), sums.end());
  for (ll i = 1; i < n; ++i) {
    sums[i] += sums[i - 1];
  }

  sort(colors.begin(), colors.end());
  colors.erase(unique(colors.begin(), colors.end()), colors.end());

  for (auto &c : colors) {
    sort(colorSize[c].begin(), colorSize[c].end());
    sort(colorSum[c].begin(), colorSum[c].end());
    for (ll i = 1; i < colorSum[c].size(); ++i) {
      colorSum[c][i] += colorSum[c][i - 1];
    }
  }

  ll color, size, pos0, pos1;
  for (auto &p : inputs) {
    tie(color, size) = p;
    pos0 = lower_bound(sizes.begin(), sizes.end(), size) - sizes.begin();
    pos1 = lower_bound(colorSize[color].begin(), colorSize[color].end(), size) -
           colorSize[color].begin();
    cout << sums[pos0] - colorSum[color][pos1] << "\n";
  }

  return 0;
}
```