---
title: '12969 BOJ'
description: 'ABC'
pubDate: 'Feb 20 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Dynamic Programming", "DP"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/12969)

## 접근

다이내믹 프로그래밍으로 해결하였다.

현재 상태를 나타내는 배열 dp를 만들어 활용하였다.
dp[Num][A][B][C][State]는 Num(A+B+C)개의 문자를 사용하여 조건에 만족하는 순서쌍이 State개인 문자열의
맨 앞 문자를 저장한다. 만약 해당 조건이 불가능하다면 0이 저장된다.
해당 앞 문자들을 바탕으로 이전 조건이 무엇이었는지 역추적할 수 있다.  

사지방 공사 때문에 삼일 정도 PS를 못했다.
건물안에 있던 사지방을 외부 컨테이너로 옮겼는데, 아직 겨울이라 그런지 너무 춥다.
여름에는 얼마나 더울지 걱정이 한가득이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;

cll N = 30, K = N * (N - 1) / 2;
ll n, k;
char dp[N + 1][N][N][N][K + 1] = {{{{{{}}}}}};

string track(ll idx, ll a, ll b, ll c, ll s) {
  char cur = dp[idx][a][b][c][s];
  if (idx == n) {
    return "\n";
  }

  if (cur == 'A') {
    return "A" + track(idx + 1, a - 1, b, c, s - b - c);
  } else if (cur == 'B') {
    return "B" + track(idx + 1, a, b - 1, c, s - c);
  } else {
    return "C" + track(idx + 1, a, b, c - 1, s);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> k;
  dp[n][0][0][0][0] = '\n';
  for (ll i = n - 1, sum; i >= 0; --i) {
    sum = n - 1 - i;
    for (ll a = sum; a >= 0; --a) {
      for (ll b = sum - a; b >= 0; --b) {
        for (ll c = sum - a - b; c >= 0; --c) {
          for (ll s = 0; s <= k; ++s) {
            if (!dp[i + 1][a][b][c][s]) {
              continue;
            }

            dp[i][a + 1][b][c][s + b + c] = 'A';
            dp[i][a][b + 1][c][s + c] = 'B';
            dp[i][a][b][c + 1][s] = 'C';
          }
        }
      }
    }
  }

  for (ll a = n; a >= 0; --a) {
    for (ll b = n - a; b >= 0; --b) {
      for (ll c = n - a - b; c >= 0; --c) {
        if (dp[0][a][b][c][k]) {
          cout << track(0, a, b, c, k);
          goto END;
        }
      }
    }
  }

  cout << "-1\n";
END:

  return 0;
}
```