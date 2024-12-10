---
title: '14289 BOJ'
description: '본대 산책 3'
pubDate: 'Dec 10 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Divide and Conquer", "Linear Algebra"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/14289)

## 접근

선형대수학과 분할 정복을 이용해 해결하였다.
처음에는 플로이드 워셜 알고리즘을 변형해 해결하려 하였으나, 얼마 지나지 않아 해당 접근법이 거듭제곱을 분할 정복으로 구하는
접근법과 동일하다는 것을 깨닫고 거듭제곱을 구하는 방식으로 해결하였다.

행렬의 거듭제곱을 나이브하게, O(N)의 시간 복잡도로 구현하면 이번 문제에서는 시간 초과를 얻기 쉽다.
거듭제곱이 이루어지는 과정을 분석해보면, 반복되는 구조가 나타나는 것을 알 수 있다.
4제곱은 2제곱을 두번 곱한 것과 동일하다. 8제곱은 4제곱을 두번 곱한 것과 동일하다.
9제곱은 4제곱을 두번 곱하고 1제곱을 곱한 것과 동일하다.
따라서 2^n의 제곱을 미리 구해놓는다면, 큰 거듭제곱도 O(log n)의 시간 복잡도로 해결 가능하다.

이러한 행렬의 거듭제곱에 길찾기라는 탈을 씌워놓은 것이 이번 문제이다.
1분 이동하여 도달할 수 있는 노드들을 나타낸 인접 행렬이 주어질 때,
이를 이용하여 2분 이동하여 도달할 수 있는 노드들을 나타낸 인접 행렬을 구할 수 있다.
2분 이동하였을 때의 인접행렬을 이용하여 4분에 대한 인접 행렬을 구할 수 있다.
이런 식으로 2^n분에 대한 인접행렬을 구할 수 있다.

D는 2의 거듭제곱의 합이다. D를 구성하는 거듭제곱에 대한 인접행렬들을 I 행렬에 차례로 곱하면 D에 대한 인접행렬도 구할 수 있다.
이를 통해 D분 후 제자리로 돌아오는 경우의 수를 구할 수 있다.

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

cll N = 50, M = 1000, INF = 1e9 + 7;
ll n, m, d, square[30][N][N] = {{{}}};

int main(void) {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

  cin >> n >> m;
  for (ll a, b, i = 0; i < m; ++i) {
    cin >> a >> b;
    --a, --b;
    square[0][a][b] = square[0][b][a] = 1;
  }

  cin >> d;
  for (ll s = 1; (1 << s) <= d; ++s) {
    for (ll a = 0; a < n; ++a) {
      for (ll b = 0; b < n; ++b) {
        for (ll mid = 0; mid < n; ++mid) {
          square[s][a][b] +=
              (square[s - 1][a][mid] * square[s - 1][mid][b]) % INF;
          square[s][a][b] %= INF;
        }
      }
    }
  }

  ll result[N][N][N] = {{{}}}, cnt = 0;
  for (ll i = 0; i < n; ++i) {
    result[cnt][i][i] = 1;
  }

  for (ll i = 0; (1 << i) <= d; ++i) {
    if (!(d & (1 << i))) {
      continue;
    }

    ++cnt;
    for (ll a = 0; a < n; ++a) {
      for (ll b = 0; b < n; ++b) {
        for (ll mid = 0; mid < n; ++mid) {
          result[cnt][a][b] +=
              (result[cnt - 1][a][mid] * square[i][mid][b]) % INF;
          result[cnt][a][b] %= INF;
        }
      }
    }
  }

  cout << result[cnt][0][0] << "\n";

  return 0;
}
```