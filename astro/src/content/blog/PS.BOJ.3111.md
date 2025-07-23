---
title: '3111 BOJ'
description: '검열'
pubDate: 'Jul 23 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Deque", "Stack"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3111)

## 접근

덱과 스택을 이용해 해결하였다.

덱을 가운데에 두고 스택 두개를 양 옆에 배치하여 각각 덱의 front와 back에서 문자를 가져가며,
만약 덱이 비었다면 서로 다른 스택의 top에 위치한 문자를 가져가며 조사한다.
왼쪽 스택부터 조사하는데, 만약 문자열이 발견되면 오른쪽 스택의 조사를 시작한다.
오른쪽 스택을 조사할 때는 목표 문자열을 뒤집어 사용하여야 한다.
오른쪽 스택에서 문자열이 발견되면 왼쪽 스택의 조사를 시작한다.
더이상 왼쪽과 오른쪽 스택에서 문자열이 발견되지 않으면 스택들을 합쳐서 정답을 출력한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)
#define IFOR(i, a, A) for (ll i = a; i >= A; --i)

cll Text = 3e5, Tgt = 25;
string tgt, rtgt, text;

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  getline(cin, tgt);
  getline(cin, text);

  rtgt = tgt;
  reverse(rtgt.begin(), rtgt.end());

  string left, right;
  deque<char> dq;
  FOR(i, 0, text.length()) { dq.push_back(text[i]); }
  while (true) {
    while (true) {
      if (!dq.empty()) {
        left.push_back(dq.front());
        dq.pop_front();
      } else if (!right.empty()) {
        left.push_back(right.back());
        right.pop_back();
      } else {
        goto END;
      }

      if (tgt.length() <= left.length() &&
          left.substr(left.length() - tgt.length(), tgt.length()) == tgt) {
        FOR(i, 0, tgt.length()) { left.pop_back(); }
        break;
      }
    }

    while (true) {
      if (!dq.empty()) {
        right.push_back(dq.back());
        dq.pop_back();
      } else if (!left.empty()) {
        right.push_back(left.back());
        left.pop_back();
      } else {
        goto END;
      }

      if (tgt.length() <= right.length() &&
          right.substr(right.length() - tgt.length(), tgt.length()) == rtgt) {
        FOR(i, 0, tgt.length()) { right.pop_back(); }
        break;
      }
    }
  }

END:
  reverse(right.begin(), right.end());
  cout << left << right << "\n";

  return 0;
}
```