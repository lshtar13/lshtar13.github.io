---
title: '1602 BOJ'
description: '도망자 원숭이'
pubDate: 'Jul 15 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Sort", "Floyd-Warshall"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/1602)

## 접근

정렬과 플로이드-워셜 알고리즘을 이용해 해결하였다.

지연이 이루어지는 노드가 경로 중의 노드들 중 지연 시간이 가장 큰 노드이여야 하는 점이 까다로운 문제였다.
이는 정렬로 해결할 수  있다.

지연 시간을 기준으로 노드들을 정렬하고, 정렬된 노드들을 순차적으로 순회하며 플로이드-워셜 알고리즘의 중간 노드로 삼는다.
해당 중간 노드를 고려하였을 때 변화될 최소 거리 배열을 갱신한다.
이때, 갱신해야 하는 배열은 두가지 종류이다.
지연이 고려되지 않은 것과 지연이 고려된 것으로 나누어 생각해야 한다.
정렬된 노드들을 순차적으로 중간노드로 삼고 있기 때문에, 현재 전자 배열에는 지연 시간이 더 큰 노드를 거치는 경우는
고려되어 있지 않다. 따라서 후자 배열을 완성할 때 지연이 이루어지는 노드를 현재 조사 중인 중간 노드로 고정하는 것에
무리가 없다. 이러한 방식으로 조사하면 지연이 포함된 최소거리를 구할 수 있다.

정렬을 떠올리는 것이 가장 어려운 것 같다.
문제의 답이 너무 깔끔하고 신선하였다.
휴가 다녀온 이후 처음 푸는 문제인데, 말라버린 뇌에 엔진오일마냥 뇌수를 흠뻑 적시는 느낌이다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
typedef const ll cll;
#define FOR(a, A) for (ll a = 0; a < A; ++a)

cll N = 500, M = 1e4, Q = 4e4, D = 1e4, INF = 1e9;
ll n, m, q, mat[N][N] = {{}}, results[N][N] = {{}}, idxs[N] = {};
pll delayed[N];

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  memset(mat, 0x3f3f3f3f, sizeof(mat));
  memset(results, 0x3f3f3f3f, sizeof(results));
  cin >> n >> m >> q;
  FOR(i, n) {
    cin >> delayed[i].first;
    delayed[i].second = i;
  }
  sort(delayed, delayed + n);
  FOR(i, n) {
    idxs[delayed[i].second] = i;
    mat[i][i] = 0;
  }
  FOR(i, m) {
    ll a, b, d;
    cin >> a >> b >> d;
    a = idxs[a - 1], b = idxs[b - 1];
    mat[a][b] = min(mat[a][b], d), mat[b][a] = min(mat[b][a], d);
  }

  FOR(d, n) {
    FOR(a, n) FOR(b, n) { mat[a][b] = min(mat[a][b], mat[a][d] + mat[d][b]); }

    FOR(a, d + 1) FOR(b, d + 1) {
      results[a][b] =
          min(results[a][b], mat[a][d] + mat[d][b] + delayed[d].first);
    }
  }

  FOR(i, q) {
    ll s, t;
    cin >> s >> t;
    s = idxs[s - 1], t = idxs[t - 1];

    if (results[s][t] > INF) {
      cout << "-1\n";
    } else {
      cout << results[s][t] << "\n";
    }
  }

  return 0;
}
```