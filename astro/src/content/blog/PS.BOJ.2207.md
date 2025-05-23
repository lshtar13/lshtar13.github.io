---
title: '2207 BOJ'
description: '가위바위보'
pubDate: 'May 23 2025'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Bipartite Matching"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2207)

## 접근

이분 매칭으로 해결하였다.

매칭할 대상은 각 가위바위보 게임과 그 결과이다.
만약, 해당 게임에 대한 매칭이 없다면 탐색 중인 결과를 바로 매칭 시킨다.
만약 매칭이 존재한다면, 해당 매칭을 예상한 학생들의 두번째 예상(존재한다면)이 가능한지 조사한다.
만약 예상한 모든 학생들에 대하여 두번째 예상이 가능하다면 조사중인 매칭을 기록한다.
조사중인 매칭과 같은 매칭이 이미 존재할 경우엔 예상한 학생의 인덱스를 해당 매칭에 추가하여 기록한다.
불가능한 경우 OTL을 출력한다.

solved.ac 코멘트를 보니 대부분의 사람들이 SCC로 해결한 듯 하다.
그래서 그런지 이분매칭으로 탐색하였을 때의 발생할 수 있는 엣지 케이스를 고려하지 않고 채점 데이터를 만든 느낌이 든다.
처음에는, 매칭을 예상한 학생을 누적하여 기록하지 않았다. 그냥 인덱스가 빠른 학생만 기록하는 방식으로 구성하였다.
AC를 받았지만 생각해보니, 같은 매칭을 예상한 학생 중 두번째 예상이 가능하지 않은 학생이 존재하는 경우가 있을 수 있게다 싶었다.
이를 보완해서 제출하였고 해당 코드가 밑의 코드이다. 이 코드도 AC를 받았다.

## 코드

```c++
#include <bits/stdc++.h>

using namespace std;
typedef long long ll;
typedef const ll cll;
typedef vector<ll> vll;

cll N = 1e4, M = 1e4;
ll n, m, spares[N + 1];
bool visited[M + 1];
vll choices[M + 1];

bool find(ll choice, ll student) {
  ll idx = abs(choice), sign = choice / idx, owner;
  visited[idx] = true;
  if (!choices[idx].empty()) {
    ll prvSign = choices[idx].front() / abs(choices[idx].front());
    if (prvSign == sign) {
      return true;
    } else {
      for (auto &_owner : choices[idx]) {
        ll owner = _owner * prvSign;
        if (!visited[idx] && spares[owner] && find(spares[owner], owner)) {
        } else {
          return false;
        }
      }
      choices[idx].clear();
      choices[idx].emplace_back(sign * student);
      return true;
    }
  } else {
    choices[idx].emplace_back(sign * student);
    return true;
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  for (ll student = 1, x, y; student <= n; ++student) {
    cin >> x >> y;
    memset(visited, 0, sizeof(visited));
    if (find(x, student)) {
      spares[student] = y;
    } else if (find(y, student)) {
      spares[student] = 0;
    } else {
      cout << "OTL\n";
      goto END;
    }
  }
  cout << "^_^\n";

END:

  return 0;
}
```