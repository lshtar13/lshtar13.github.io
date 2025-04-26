---
title: '3356 BOJ'
description: '라디오 전송'
pubDate: 'Apr 24 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "KMP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/3356)

## 접근

KMP를 이용해 해결하였다.

어떤 문자열의 반복의 부분 문자열이 된다는 것은,
prefix가 반복된다는 것으로 받아들일 수 있다.
따라서 반복 될 수 있는 가장 길이가 작은 prefix를 골라야 하는데,
이를 위해서 전체 길이에 pi[l-1]한 값을 골랐다.
이는 [1305번 문제](https://solved.ac/contribute/1305)와 동일하다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll L = 1e6;
ll length, pi[L] = {};
char tgt[L + 1] = {};

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> length >> tgt;
    for (ll i = 1, prv; i < length; ++i)
    {
        prv = pi[i - 1];
        while (prv && tgt[i] != tgt[prv])
        {
            prv = pi[prv - 1];
        }

        if (tgt[i] == tgt[prv])
        {
            pi[i] = prv + 1;
        }
    }

    cout << length - pi[length - 1] << "\n";

    return 0;
}
```