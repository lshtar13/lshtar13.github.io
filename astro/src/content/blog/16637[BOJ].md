---
title: '16637 BOJ'
description: '괄호 추가하기'
pubDate: 'Dec 04 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS",]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/16637)

## 접근

브루트포스 알고리즘을 이용해 해결하였다.

완전 탐색을 통해 모든 경우의 수를 비교해 정답을 도출하였다.
주의해야할 점은, 특정 부분에서의 최대값이 전체에서의 최대값을 이루는데
사용되지 않을 수 있다는 점이다.

뒤에서부터 탐색해 가장 큰 값을 가지는 경우를 찾았는데,
처음에는 뒤의 원소를 소모하고 재귀적으로 앞의 원소를 소모하게
풀이했다.
이러한 경우, 음수 곱하기 음수 같은 케이스를 고려할 수 없게 된다.
늘 부분적으로 최대값을 가지로 조합만 이끌어내기 때문이다.
따라서 최대값을 구하는 함수 외에도 최소값을 구하는 함수도
추가로 만들어 모든 경우의 수를 고려하게 하였다.


## 코드

```c++
#include <bits/stdc++.h>
#include <climits>

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

cll N = 19;
ll n;
string form;
ll minFind(string &form, ll idx);
ll maxFind(string &form, ll idx);

ll minFind(string &form, ll idx) {
  ll num = form[idx] - '0', nextNum, _result, result;
  if (idx == 0) {
    return num;
  }

  switch (form[idx - 1]) {
  case '+':
    result = num + minFind(form, idx - 2);
    break;
  case '-':
    result = minFind(form, idx - 2) - num;
    break;
  case '*':
    result = num * maxFind(form, idx - 2);
    result = min(result, num * minFind(form, idx - 2));
    break;
  }

  if (idx < 4) {
    goto END;
  }

  nextNum = form[idx - 2] - '0';
  switch (form[idx - 1]) {
  case '+':
    _result = num + nextNum;
    break;
  case '-':
    _result = nextNum - num;
    break;
  case '*':
    _result = num * nextNum;
    break;
  }

  switch (form[idx - 3]) {
  case '+':
    result = min(result, _result + minFind(form, idx - 4));
    break;
  case '-':
    result = min(result, minFind(form, idx - 4) - _result);
    break;
  case '*':
    result = min(result, _result * minFind(form, idx - 4));
    result = min(result, _result * maxFind(form, idx - 4));
    break;
  }

END:
  return result;
}

ll maxFind(string &form, ll idx) {
  ll num = form[idx] - '0', nextNum, _result, result;
  if (idx == 0) {
    return num;
  }

  switch (form[idx - 1]) {
  case '+':
    result = num + maxFind(form, idx - 2);
    break;
  case '-':
    result = maxFind(form, idx - 2) - num;
    break;
  case '*':
    result = num * maxFind(form, idx - 2);
    result = max(result, num * minFind(form, idx - 2));
    break;
  }

  if (idx < 4) {
    goto END;
  }

  nextNum = form[idx - 2] - '0';
  switch (form[idx - 1]) {
  case '+':
    _result = num + nextNum;
    break;
  case '-':
    _result = nextNum - num;
    break;
  case '*':
    _result = num * nextNum;
    break;
  }

  switch (form[idx - 3]) {
  case '+':
    result = max(result, _result + maxFind(form, idx - 4));
    break;
  case '-':
    result = max(result, maxFind(form, idx - 4) - _result);
    break;
  case '*':
    result = max(result, _result * minFind(form, idx - 4));
    result = max(result, _result * maxFind(form, idx - 4));
    break;
  }

END:
  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n;
  cin >> form;

  ll result = maxFind(form, form.size() - 1);
  cout << result << "\n";

  return 0;
}
```