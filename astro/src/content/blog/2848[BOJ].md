---
title: '2848 BOJ'
description: '알고스팟어'
pubDate: 'Dec 23 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Topological Sort"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2848)

## 접근

위상 정렬을 이용해 해결하였다. 까다로운 엣지 케이스들이 많아 예외 처리에 고생한 문제이다.

두번째 단어부터 그 이전 단어와 비교해 달라지는 지점을 포착, 해당 지점에 나타나는 알파벳 간의 순서를 mat 배열과 degree에
저장한다. 이후에 일반적인 위상 정렬 문제처럼 해결하면 된다. 사이클이 생길 경우 !를 출력하고,
여러 개의 순서가 정답이 될 때(큐에 복수의 인덱스가 담길 때)는 ?를 출력한다.

단, 다음과 같은 예외 케이스들이 존재한다.
여러 개의 순서가 가능할 경우, 해당 순서들이 정말로 "가능"해야 ?를 출력할 수 있다.
혹여나 해당 순서들이 불가능한 순서일 경우엔 !를 출력해야 한다.
이외에도 abc -> ab 순으로 나타나는, 그러니까 이전에 나타난 단어의 접두사가 다시 나타나는 경우 !를 출력해야 한다.

위와 같은 엣지 케이스들은 질문 게시판을 통해 알게 되었다. 엣지 케이스들 말고도 인덱싱을 잘못해서 조금 헤메었다.
하지만, 발상 자체는 어렵지 않은 문제였다.

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

cll N = 100, LEN = 10, NALPHA = 'z' - 'a';
ll n, nChar = 0, degree[NALPHA + 1] = {};
string words[N];
bool mat[NALPHA + 1][NALPHA + 1] = {{}}, present[NALPHA + 1] = {};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  for (ll i = 0; i < n; ++i) {
    cin >> words[i];
  }

  for (auto &word : words) {
    for (auto c : word) {
      present[c - 'a'] = true;
    }
  }

  for (ll c = 0; c <= NALPHA; ++c) {
    nChar += present[c];
  }

  for (ll minLen, cPrv, cCur, l, i = 1; i < n; ++i) {
    string &prv = words[i - 1], &cur = words[i];
    minLen = min(prv.length(), cur.length());
    for (l = 0; l < minLen; ++l) {
      if (prv[l] != cur[l]) {
        break;
      }
    }

    if (l == minLen) {
      if (prv.length() > minLen) {
        cout << "!\n";
        return 0;
      }
      continue;
    }

    cPrv = prv[l] - 'a', cCur = cur[l] - 'a';
    if (!mat[cPrv][cCur]) {
      mat[cPrv][cCur] = true;
      ++degree[cCur];
    }
  }

  char result[NALPHA + 1] = {}, nresult = 0;

  qll q;
  for (ll i = 0; i <= NALPHA; ++i) {
    if (present[i] && !degree[i]) {
      q.push(i);
    }
  }
  bool isAmbiguous = false;
  while (!q.empty()) {
    if (q.size() > 1) {
      isAmbiguous = true;
    }

    ll alpha = q.front();
    q.pop();

    result[nresult++] = alpha + 'a';

    for (ll a = 0; a <= NALPHA; ++a) {
      if (mat[alpha][a] && !--degree[a]) {
        q.push(a);
      }
    }
  }

  if (nresult < nChar) {
    cout << "!\n";
  } else if (isAmbiguous) {
    cout << "?\n";
  } else {
    cout << result << "\n";
  }
  return 0;
}
```