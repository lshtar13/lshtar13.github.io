---
title: '12899 BOJ'
description: '데이터 구조'
pubDate: 'Feb 15 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Segment Tree"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/12899)

## 접근

세그먼트 트리를 이용해 해결하였다.

세그먼트 트리를 이용해야 한다는 점과 이분 탐색을 사용해야 하는 점을 파악하는데 시간이 오래 걸리지 않았다.
그러나, 이분 탐색을 이상하게 활용하고 말았다. 세그먼트 트리의 특성을 이용해 이분 탐색을 진행하면 시간을 많이 아낄 수 있었을텐데
여타 이분 탐색 문제와 같이, st와 en을 정해두고 범위를 좁혀가며 매번 seg query를 발생시켜 조건을 확인하는 식으로 수행하였다.
N의 크기가 커서 이런 식의 적용은 큰 오버헤드가 되었다. 다른 사람들의 풀이를 참고하며 효율적인 방법을 알 수 있었다.

세그먼트 트리의 특성을 활용해 이분 탐색을 한다면 다음과 같이 수행할 수 있다.
탐색하는 노드에서 left child의 값이 x(찾으려는 숫자의 순서)보다 크다면 right child로 옮겨가 x - (left child 값)을 탐색한다.
크지 않은 경우엔, left chil에서 x를 탐색하면 된다. 이런 식으로 범위를 좁혀나가 leaf node에 이르면 해당 노드에 해당하는 숫자가
찾던 값이 되는 것이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 2e6, X = 2e6;
ll n, segs[20 * X] = {};

ll add(ll node, ll st, ll en, ll idx) {
  if (idx < st || idx > en) {
    return segs[node];
  } else if (st == en) {
    return ++segs[node];
  }

  ll mid = (st + en) / 2;
  return segs[node] =
             add(node * 2, st, mid, idx) + add(node * 2 + 1, mid + 1, en, idx);
}

ll query(ll node, ll st, ll en, ll idx) {
  --segs[node];
  ll mid = (st + en) / 2, left = segs[node * 2], right = segs[node * 2 + 1];
  if (st == en) {
    return st;
  } else if (left < idx) {
    return query(node * 2 + 1, mid + 1, en, idx - left);
  } else {
    return query(node * 2, st, mid, idx);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll t, x, num, q = 0; q < n; ++q) {
    cin >> t >> x;
    if (t == 1) {
      add(1, 1, X, x);
    } else {
      num = query(1, 1, X, x);
      cout << num << '\n';
    }
  }

  return 0;
}
```