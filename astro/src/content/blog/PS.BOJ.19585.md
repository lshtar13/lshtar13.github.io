---
title: '19585 BOJ'
description: '전설'
pubDate: 'Apr 12 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Trie", "Hash"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/19585)

## 접근

트라이와 해쉬를 이용해 해결하였다.

문제를 보자마자 트라이가 떠올라 두개의 트라이를 만들어 적용하였다.
먼저, 색상이 담긴 트라이에서 검색을 하고 검색이 끝난 지점부터 다시 닉네임이 담긴 트라이에서 검색을 하였다.
이렇게 트라이 두개를 사용하게 되면 메모리 초과를 받기 쉽다.
또한, 트라이에 저장할 때 r, re, red 식으로 입력이 들어오게 되면 r과 re에 대하여 여기서 끝이 날 수도 있다는 점을 표시해야 한다.
이 두가지를 적절하게 고려하지 못해 많이 헤메었다.

[다른 분의 블로그](https://pill27211.tistory.com/6)를 참고하여, isEnd일 경우 이어서 닉네임에 대한 해쉬를 시도하는 식으로
수정하였더니 통과하였다.

## 코드

```c++
#include <bits/stdc++.h>
#include <cstddef>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll C = 4000, N = 4000, Q = 20000;
ll c, n, q;
unordered_set<string> names;

class node {
public:
  char c;
  map<char, node *> childs;
  bool isEnd{};

  node() { c = 0; }

  node(char alpha) { c = alpha; }

  void add(string &word, ll pos) {
    if (word.length() == pos) {
      isEnd = true;
      return;
    }

    char tgt = word[pos];
    if (!childs[tgt]) {
      childs[tgt] = new node(tgt);
    }
    childs[tgt]->add(word, ++pos);
  }

  bool search(string &word, ll pos) {
    if (pos == word.length()) {
      return false;
    } else if (isEnd && names.count(word.substr(pos))) {
      return true;
    }

    char tgt = word[pos];
    if (childs[tgt]) {
      return childs[tgt]->search(word, ++pos);
    }

    return false;
  }
};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  node *colors = new node();

  cin >> c >> n;
  for (ll i = 0; i < c; ++i) {
    string color;
    cin >> color;
    colors->add(color, 0);
  }
  for (ll i = 0; i < n; ++i) {
    string name;
    cin >> name;
    names.insert(name);
  }

  cin >> q;
  for (ll i = 0, pos, under; i < q; ++i) {
    string team;
    cin >> team;

    if (colors->search(team, 0)) {
      cout << "Yes\n";
    } else {
      cout << "No\n";
    }
  }

  return 0;
}
```