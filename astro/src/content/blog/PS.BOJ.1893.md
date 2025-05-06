---
title: '1893 BOJ'
description: '시저 암호'
pubDate: 'May 06 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "KMP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1893)

## 접근

KMP 알고리즘으로 해결하였다.

KMP알고리즘으로 0번 ~ (a의 길이)-1번 shift한 문자열들이 S문자열에 1번 등장하는지 여부를 조사하여 정답을 구했다.
복수번 등장하는 것에 대한 KMP알고리즘의 수정이 필요하다.

이외에도, 문자열을 구성하는 각 문자 사이의 차이들을 배열로 만들어 비교하여 후보 문자열군을 추린 후 맨 앞 문자가 유일한 문자열을
파악해 정답을 구할 수 있다. 이 방법이 가장 최적일 것이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll A = 62, W = 5e4, S = 5e5;
ll pi[W] = {}, idxs[256] = {}, nalpha;
char alpha[A] = {};

void getPi(const string &str) {
  memset(pi, 0, sizeof(pi));
  for (ll i = 1, prv; i < str.length(); ++i) {
    prv = pi[i - 1];
    while (prv && str[i] == str[prv]) {
      prv = pi[prv - 1];
    }

    if (str[i] == str[prv]) {
      pi[i] = prv + 1;
    }
  }
}

ll comp(const string &tgt, const string &src, cll n) {
  ll result = 0;
  for (ll pt = 0, i = 0; pt < src.length();) {
    char c = alpha[(idxs[tgt[i]] + n) % nalpha];
    if (c == src[pt]) {
      ++i, ++pt;
    } else if (i) {
      i = pi[i - 1];
    } else {
      ++pt;
    }

    if (i == tgt.length()) {
      ++result, i = pi[tgt.length() - 1];
    }
  }

  return result;
}

string solve() {
  string stra, strw, strs;
  cin >> stra >> strw >> strs;

  nalpha = stra.length();
  for (ll i = 0; i < stra.length(); ++i) {
    idxs[stra[i]] = i;
    alpha[i] = stra[i];
  }

  vll results;
  getPi(strw);
  for (ll n = 0; n < stra.length(); ++n) {
    if (comp(strw, strs, n) == 1) {
      results.push_back(n);
    }
  }
  sort(results.begin(), results.end());

  string result;
  if (results.size() == 0) {
    result = "no solution";
  } else if (results.size() == 1) {
    result = "unique: ";
  } else {
    result = "ambiguous: ";
  }

  for (auto &num : results) {
    result += to_string(num);
    result += " ";
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  ll t;
  cin >> t;
  while (t--) {
    cout << solve() << "\n";
  }

  return 0;
}
```