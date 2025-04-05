---
title: '1306 BOJ'
description: '달려라 홍준'
pubDate: 'Apr 05 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Monotone Deque"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1306)

## 접근

모노톤 덱을 이용해 해결하였다.

[15678번 문제](https://www.acmicpc.net/problem/15678)를 풀면서 알게된 모노톤 덱을 활용해 보았다.
사실 문제를 해결하고 보니 비슷한 아이디어를 사용한 문제를 푼 적이 있다는 것을 깨닫게 되었다.
세그먼트 트리를 사용해도 해결할 수 있지만, 덱을 이용하는 편이 시간복잡도 면에서 더 효율적이다.

빛의 밝기를 기준으로 감소하는 덱을 관리하면 된다.
만약, 가장 밝은 인덱스가 범위에서 벗어나는 경우 pop_front()해서 제거하고
맨 뒤에 있는 인덱스의 밝기가 새롭게 추가되는 인덱스의 밝기보다 낮을 경우 pop_back()으로 제거한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e6, M = 1e6;
ll n, m, range, intensities[N] = {};
deque<ll> d;

void push(ll idx) {
  while (!d.empty()) {
    if (intensities[d.back()] > intensities[idx]) {
      break;
    } else {
      d.pop_back();
    }
  }
  d.push_back(idx);
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll i = 0; i < n; ++i) {
    cin >> intensities[i];
  }
  range = 2 * m - 2;

  for (ll i = 0; i < range; ++i) {
    push(i);
  }

  for (ll i = 0; i + range < n; ++i) {
    push(i + range);
    while (d.front() < i) {
      d.pop_front();
    }

    cout << intensities[d.front()] << " ";
  }
  cout << "\n";

  return 0;
}
```