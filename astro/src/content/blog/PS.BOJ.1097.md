---
title: '1097 BOJ'
description: '마법의 문자열'
pubDate: 'Jul 28 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Permutation", "KMP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1097)

## 접근

순열 알고리즘과 kmp 알고리즘을 혼합한 방법으로 해결하였다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
#define FOR(i, a, A) for (ll i = a; i < A; ++i)

cll N = 8, K = 20, Length = 20;
ll n, k;
string words[N];

bool check(string &word) {
  ll pi[N * Length] = {}, length = word.length();
  FOR(i, 1, length) {
    ll prv = pi[i - 1];
    while (prv && word[prv] != word[i]) {
      prv = pi[prv - 1];
    }

    if (word[prv] == word[i]) {
      pi[i] = prv + 1;
    } else {
      pi[i] = 0;
    }
  }

  string tgt = word + word;
  ll pos = 0, idx = 0, result = 0;
  while (pos < tgt.length() - 1) {
    if (tgt[pos] == word[idx]) {
      ++pos, ++idx;
    } else if (idx > 0) {
      idx = pi[idx - 1];
    } else {
      ++pos;
    }

    if (idx == length) {
      ++result;
      idx = pi[idx - 1];
    }
  }

  return result == k;
}

ll permute(ll level) {
  static string word;
  static bool selected[N] = {};
  if (level == n) {
    return check(word);
  }

  ll result = 0;
  FOR(i, 0, n) {
    if (selected[i]) {
      continue;
    }

    selected[i] = true;
    word += words[i];
    result += permute(level + 1);
    word.erase(word.end() - words[i].length(), word.end());
    selected[i] = false;
  }

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  cin.ignore();
  FOR(i, 0, n) { getline(cin, words[i]); }
  cin >> k;
  cout << permute(0) << "\n";

  return 0;
}
```