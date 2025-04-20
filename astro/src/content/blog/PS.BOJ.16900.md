---
title: '16900 BOJ'
description: '이름 정하기'
pubDate: 'Apr 21 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "KMP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/16900)

## 접근

KMP 알고리즘의 pi배열을 이용해 해결하였다.

가장 짧게, 주어진 부분 문자열이 k번 나타나는 문자열을 만들기 위해선
주어진 부분 문자열을 중복해서 사용하는 것이다.
중복해서 사용한다는 것은 문자열의 prefix와 suffix가 일치하도록 하여 겹쳐서 나열한다는 것인데,
KMP의 pi배열이 prefix와 suffix가 최대로 겹칠수 있는 길이를 저장하고 있기에 이를 활용하였다.
pi배열의 마지막 값, 주어진 부분 문자열의 prefix와 suffix가 최대로 겹쳐질 수 있는 길이를 제외한 나머지 부분을
매번 뒤에 덧붙여주는 식으로 문자열을 구성하면 된다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 5e5, K = 1e6;
ll n, pi[N] = {}, k;
char s[N + 1] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> s >> k;
  n = strlen(s);
  pi[0] = 0;
  for (ll i = 1, prv; i < n; ++i) {
    prv = pi[i - 1];
    while (prv && s[prv] != s[i]) {
      prv = pi[prv - 1];
    }

    if (s[prv] == s[i]) {
      pi[i] = prv + 1;
    } else {
      pi[i] = 0;
    }
  }

  ll result = n;
  for (ll i = 2; i <= k; ++i) {
    result += (n - pi[n - 1]);
  }

  cout << result << "\n";

  return 0;
}
```