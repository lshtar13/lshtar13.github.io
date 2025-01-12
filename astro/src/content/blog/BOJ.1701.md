---
title: '1701 BOJ'
description: 'Cubeditor'
pubDate: 'Dec 18 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "KMP", "String"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1701)

## 접근

KMP 알고리즘을 이용해 해결하였다.

부분문자열 중 두번 이상 나오는 가장 큰 것의 길이를 출력해야 한다.
두번 이상이라는 조건에 KMP의 pi 배열을 떠올렸는데,
pi 배열은 맨 앞자리부터 시작하는 부분 배열만 검사하기 때문에 아닌 듯 싶었다.
시작 자리를 바꿔가면 pi 배열을 구할까 생각을 해봤는데 시간 초과가 염려되었다.

그래도 다른 방법이 생각나지 않아 위 방법으로 제출해봤는데,
아니나 다를까 시간초과가 떴다. 그래서 블로그들을 찾아 봤는데, 방법 자체가 틀린 것은 아니었다.
알고보니 pi 배열을 구하는 과정에서 오타를 냈었고, 해당 오타가 무한루프를 생성한 것이었다.

KMP는 아직도 어렵다 ...

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef unsigned long long ull;
typedef pair<ll, ll> pll;
typedef pair<ull, ull> pull;
typedef const ll cll;
typedef queue<ll> qll;
typedef queue<pll> qpll;
typedef priority_queue<ll> pqll;
typedef priority_queue<pll> pqpll;
typedef vector<ll> vll;
typedef vector<pll> vpll;
typedef vector<vll> vvll;
typedef vector<vpll> vvpll;
#define FOR1(a, A) for (ll a = 0; a < A; ++a)
#define FOR2(a, b, A, B)                                                       \
  for (ll a = 0; a < A; ++a)                                                   \
    for (ll b = 0; b < B; ++b)
cll MAX_LEN = 5000;
string str;
ll pi[MAX_LEN + 1] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> str;

  ll len = str.length(), result = 0;
  for (ll st = 0; st < len; ++st) {
    string subStr = str.substr(st);
    memset(pi, 0, sizeof(pi));
    for (ll _pi, i = 1; i < subStr.length(); ++i) {
      _pi = pi[i - 1];
      while (subStr[_pi] != subStr[i] && _pi) {
        _pi = pi[_pi - 1];
      }

      pi[i] = subStr[_pi] == subStr[i] ? _pi + 1 : 0;
      result = max(result, pi[i]);
    }
  }

  cout << result << "\n";

  return 0;
}
```