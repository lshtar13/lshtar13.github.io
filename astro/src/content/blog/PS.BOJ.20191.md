---
title: '20191 BOJ'
description: '줄임말'
pubDate: 'Mar 12 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Binary Search", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/20191)

## 접근

이분 탐색으로 해결하였다. 다른 사람들의 풀이를 보니, 이분 탐색외에도 다이내믹 프로그래밍으로 해결한 사람도 여럿 보였다.

S에 대하여 앞의 문자들부터 T의 문자들에 순서대로 매칭한다.
S[i-1]가 T[l]에 매칭되었다면, S[i]는 T[l]보다 뒤의 T[k]에 매칭되어야 한다.
만약 그러한 T[k]가 존재하지 않는다면, T 문자열을 하나 추가하고 다시 T의 0번 문자부터 조사한다.

위와 같은 과정을 빠르게 진행하기 위해, 각 문자(a~z)별로 어떤 위치에 나타나는지 순서대로 기록한 배열을 유지한다.
해당 배열을 이용하여 이분탐색을 진행하면 매칭되는 문자의 위치를 빠르게 알 수 있다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll LEN = 1e6;
string s, t;
deque<ll> indexes[26];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> s >> t;

  for (ll i = 0; i < t.size(); ++i) {
    indexes[t[i] - 'a'].emplace_back(i);
  }

  ll result = 0, prv = -1;
  for (ll i = 0; i < s.size(); ++i) {
    char c = s[i] - 'a';
    auto &index = indexes[c];
    if (index.empty()) {
      cout << -1 << '\n';
      goto END;
    }

  AGAIN:
    auto it = upper_bound(index.begin(), index.end(), prv);
    if (it == index.end()) {
      ++result, prv = -1;
      goto AGAIN;
    }

    prv = *it;
  }

  cout << result + 1 << '\n';

END:

  return 0;
}
```