---
title: '9202 BOJ'
description: 'Boggle'
pubDate: 'Jun 08 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Depth-First Search", "Trie", "DFS"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/9202)

## 접근

트라이를 이용한 DFS로 해결하였다.

잔실수가 많아 해결하는데 애먹었다. DFS부분은 다른 사람의 풀이를 참고하여 다듬었다.

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

cll W = 3e5, Len = 8, B = 30, scores[Len + 1] = {0, 0, 0, 1, 1, 2, 3, 5, 11},
    directions[8][2] = {{0, 1}, {0, -1}, {1, 0},  {-1, 0},
                        {1, 1}, {1, -1}, {-1, 1}, {-1, -1}};
ll w, b, score;
char board[4][4] = {{}};
bool visited[4][4] = {{}};
set<string> s;

inline bool isValidCords(ll i, ll l) {
  return i >= 0 && i < 4 && l >= 0 && l < 4;
}

class Trie {
public:
  Trie *childs[26];
  bool isEnd;

  Trie() {
    memset(this->childs, 0, sizeof(this->childs));
    this->isEnd = false;
  }

  void append(string str, ll pos) {
    if (str.size() == pos) {
      this->isEnd = true;
    } else {
      ll idx = str[pos] - 'A';
      if (!this->childs[idx]) {
        this->childs[idx] = new Trie();
      }

      this->childs[idx]->append(str, pos + 1);
    }
  }

  void search(string str, ll i, ll l) {
    if (str.length() > 8) {
      return;
    }
    visited[i][l] = true;
    str += board[i][l];
    auto next = this->childs[board[i][l] - 'A'];
    if (!next) {
      visited[i][l] = false;
      return;
    }

    if (next->isEnd) {
      s.insert(str);
    }

    for (auto &d : directions) {
      ll ni = i + d[0], nl = l + d[1];
      if (!isValidCords(ni, nl) || visited[ni][nl]) {
        continue;
      }
      next->search(str, ni, nl);
    }
    visited[i][l] = false;
  }
};

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  Trie root;

  cin >> w;
  for (ll i = 0; i < w; ++i) {
    string str;
    cin >> str;
    root.append(str, 0);
  }

  cin >> b;
  for (ll g = 0; g < b; ++g) {
    for (ll i = 0; i < 4; ++i) {
      cin.ignore();
      for (ll l = 0; l < 4; ++l) {
        cin >> board[i][l];
      }
    }

    s.clear();
    for (ll i = 0; i < 4; ++i) {
      for (ll l = 0; l < 4; ++l) {
        root.search("", i, l);
      }
    }

    ll maxSize = 0, score = 0;
    string maxStr = "";
    for (auto &str : s) {
      score += scores[str.length()];
      if (str.length() > maxSize) {
        maxSize = str.length();
        maxStr = str;
      } else if (str.length() == maxSize) {
        maxStr = min(maxStr, str);
      }
    }

    cout << score << " " << maxStr << " " << s.size() << "\n";
  }

  return 0;
}
```