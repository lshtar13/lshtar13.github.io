---
title: '4354 BOJ'
description: '문자열 제곱'
pubDate: 'Feb 14 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "KMP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/4354)

## 접근

KMP로 해결하였다.

처음에는 문자열 길이의 약수 만큼의 길이를 가지는 부분 문자열을 모두 구해 비교하는 방식으로 해결하려고 하였다.
문자열의 길이를 생각해봤을 때, 시간 제한에 아슬아슬하게 통과하거나 아깝게 틀릴 것 같아서 다른 방식을 모색하였다.
문자열이고 어떤 부분 문자열이 반복된다는 점에서 KMP 알고리즘을 활용하면 될 것 같다는 생각이 들었다.

KMP의 pi배열을 활용하였다.
Pi의 마지막 원소는 문자열의 접미사가 접두사와 얼마나 겹치는지 나타내는 것이므로,
n번 반복될 부분 문자열(a)의 길이는 해당 원소보다 작다. 정확히는 해당 원소의 약수이다.
다르게 생각하면, 해당 원소를 pi 배열에서 역추적하였을 때 나열되는 원소들이 a의 길이가 될 수 있다.
여기서 한번 더 생각하면, 나열되는 원소 중 p 가 가능하다면 pi[p-1]에 대해서는 전체 문자열이 아니라 인덱스 p-1까지만 조사하면 된다.
뒷 부분이 반복된다는 점을 이미 조사했기 때문이다.

이런 방식으로 해결하였는데, 찾아보니 처음에 생각한 방이 정해였다. 너무 어렵게 생각하면 안되는 것 같다.
또, pi 배열을 거슬러 올라가는데 소요되는 시간을 얕보면 안된다는 점도 알게 되었다. 해당 사항 때문에 시간 초과를 많이 받았다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 1e6;

bool check(string &str, ll n, ll p) {
  if (n % p) {
    return false;
  }

  for (ll i = 0; i < n; ++i) {
    if (str[i] != str[i % p]) {
      return false;
    }
  }

  return true;
}

ll solve(string str) {
  ll n = str.length(), pi[N] = {};
  pi[0] = 0;

  for (ll i = 1, p; i < n; ++i) {
    p = pi[i - 1];
    while (p > 0 && str[p] != str[i]) {
      p = pi[p - 1];
    }

    if (str[p] == str[i]) {
      pi[i] = p + 1;
    }
  }

  ll result = n;
  for (ll p = pi[n - 1], len = n; p; p = pi[p - 1]) {
    if (p && check(str, len, p)) {
      result = len = p;
    }
  }

  return n / result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  for (string input; cin >> input && input != ".";) {
    cout << solve(input) << "\n";
  }

  return 0;
}
```