---
title: '11585 BOJ'
description: '속타는 저녁 메뉴'
pubDate: 'Apr 09 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS","KMP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/11585)

## 접근

Kmp 알고리즘을 이용해 해결하였다.

두 문자열을 비교할 때, 문자열이 원형으로 배치되어 있음을 유의해야 한다.
따라서, 대상이 되는 문자열을 두배하고 마지막 문자를 배제한 문자열을 탐색 대상으로 삼는다.
마지막 문자를 배제하지 않는다면, 똑같은 경우가 두번 집계되는 오류가 발생할 수 있다.
이후 전체 경우의 수와 kmp로 구한 경우의 수를 최대공약수로 나누어 기약분수로 만들어 출력한다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e6;
ll n;
char src[2 * N + 2] = {}, tgt[N + 1] = {};

void getPi(char str[], ll pi[]) {
  for (ll i = 1, prv; i < n; ++i) {
    prv = pi[i - 1];
    while (prv && str[prv] != str[i]) {
      prv = pi[prv - 1];
    }

    if (str[prv] == str[i]) {
      pi[i] = prv + 1;
    } else {
      pi[i] = 0;
    }
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  cin.ignore();
  for (ll i = 0; i < 2; ++i) {
    ll idx = 0;
    string input;
    getline(cin, input);
    for (auto &c : input) {
      if (c == ' ' || c == '\n') {
        continue;
      }
      if (i) {
        src[idx++] = c;
      } else {
        tgt[idx++] = c;
      }
    }
  }

  ll pi[N] = {};
  getPi(tgt, pi);

  strncpy(src + n, src, n);
  ll st = 0, prv = 0, pt = 0, ans = 0, result = 0;
  while (true) {
    if (src[pt] == tgt[ans]) {
      ++pt, ++ans;
    } else if (ans) {
      ans = pi[ans - 1];
    } else {
      ++pt;
    }

    if (ans == n) {
      ++result;
      ans = pi[n - 1];
    }

    if (pt == 2 * n - 1) {
      break;
    }
  }

  ll div = gcd(result, n);
  cout << result / div << "/" << n / div << "\n";

  return 0;
}
```