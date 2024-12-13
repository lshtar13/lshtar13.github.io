---
title: '17822 BOJ'
description: '원판 돌리기'
pubDate: 'Dec 13 2024'
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Implementation"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/17822)

## 접근

특별한 최적화 기법 없이, 설명 그대로 구현하면 되는 문제이다.

설명을 이해하기 조금 힘들었다.
연속되는 예제가 제시되어 있어 큰 도움이 되었다.

환(丸)형태로 인덱싱하는 문제에서 인덱스가 n-1에서 0으로 넘어가는 연산에 대한 실수를 했다.
이전에도 이런 적이 있었는데, 단순히 (prev_idx + move)%max_idx로 처리하니 음수가 나와
바람직하지 못한 상황이 벌어졌다.
모듈러 연산의 특성을 활용하여 (prev_idx + move + max_idx)%max_idx로 처리하여 해결하였다.
기억해야 할 실수 지점이다.

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

cll N = 50, M = 50, directions[4][2] = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
ll n, m, t, disks[N][M] = {{}};

void move(ll disk, ll k) {
  ll _disk[M] = {};
  FOR1(j, m) { _disk[(j + k) % m] = disks[disk][j]; }
  FOR1(j, m) { disks[disk][j] = _disk[j]; }
}

ll find(ll disk, ll idx, bool visited[][M], vpll &changed) {
  qpll q;
  ll num = disks[disk][idx];
  if (!num) {
    goto END;
  }

  q.push(make_pair(disk, idx));
  visited[disk][idx] = true;
  changed.emplace_back(make_pair(disk, idx));
  while (!q.empty()) {
    ll i = q.front().first, l = q.front().second;
    q.pop();

    for (auto &d : directions) {
      ll _i = i + d[0], _l = (l + d[1] + m) % m;
      if (_i < 0 || _i >= n || visited[_i][_l] || disks[_i][_l] != num) {
        continue;
      }

      visited[_i][_l] = true;
      changed.emplace_back(make_pair(_i, _l));
      q.push(make_pair(_i, _l));
    }
  }

END:
  return num;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m >> t;
  ll x, d, k, nNum = n * m, sum = 0;
  FOR2(i, j, n, m) {
    cin >> disks[i][j];
    sum += disks[i][j];
  }

  while (t--) {
    cin >> x >> d >> k;
    if (d) {
      k = m - k, d = !d;
    }
    for (ll i = x; i <= n; i += x) {
      move(i - 1, k);
    }

    ll nchanged = 0, num;
    bool visited[N][M] = {{}};
    FOR2(i, j, n, m) {
      if (visited[i][j] || disks[i][j] == 0) {
        continue;
      }
      vpll changed;
      num = find(i, j, visited, changed);

      if (changed.size() > 1 && num) {
        sum -= num * changed.size(), nchanged += changed.size();
        for (auto &p : changed) {
          disks[p.first][p.second] = 0;
        }
      }
    }

    if (!nNum) {
      continue;
    } else if (nchanged) {
      nNum -= nchanged;
    } else {
      ll mean = sum / nNum, rest = sum % nNum;
      FOR2(i, j, n, m) {
        if (!disks[i][j]) {
          continue;
        } else if (disks[i][j] > mean) {
          --sum;
          if (--disks[i][j] == 0) {
            --nNum;
          }
        } else if (disks[i][j] < mean) {
          ++disks[i][j], ++sum;
        } else if (rest) {
          ++disks[i][j], ++sum;
        }
      }
    }
  }

  cout << sum << "\n";

  return 0;
}
```