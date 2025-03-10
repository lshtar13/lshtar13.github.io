---
title: '15683 BOJ'
description: '감시'
pubDate: 'Nov 23 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Brute-Force", "Backtracking"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/15683)

## 접근

백트래킹을 이용한 브루트포스 알고리즘을 이용하여 해결하였다.

모든 경우의 수를 확인하여, 카메라가 감시할 수 있는 구역의 개수를 세었다.
구현 난이도가 좀 높았다. 4진법을 이용해서 경우의 수를 표현한 방법도 보았지만,
백트래킹을 이용한 풀이랑 다른 점이 많지 않은 것 같았다.

# 코드

```cpp
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

ll find(ll);
ll find1(ll);
ll find2(ll);
ll find3(ll);
ll find4(ll);
ll find5(ll);

cll N = 8, M = 8;
ll n, m, mat[N][M] = {{}}, cctv[9][2] = {{}}, ncctv = 1, nblock = 0;

ll setSight(ll i, ll l, ll idx) {
  if (i < 0 || i >= n || l < 0 || l >= m) {
    return -1;
  } else if (mat[i][l] == 6) {
    return -1;
  } else if (!mat[i][l]) {
    mat[i][l] = -idx;
    return 1;
  } else {
    return 0;
  }
}

bool unsetSight(ll i, ll l, ll idx) {
  if (i < 0 || i >= n || l < 0 || l >= m) {
    return false;
  } else if (mat[i][l] == 6) {
    return false;
  } else if (mat[i][l] == -idx) {
    mat[i][l] = 0;
    return true;
  } else {
    return true;
  }
}

ll find(ll idx) {
  if (idx == ncctv) {
    return 0;
  }

  switch (mat[cctv[idx][0]][cctv[idx][1]]) {
  case 1:
    return find1(idx);
  case 2:
    return find2(idx);
  case 3:
    return find3(idx);
  case 4:
    return find4(idx);
  case 5:
    return find5(idx);
  }
  return 0;
}

ll find1(ll idx) {
  ll i = cctv[idx][0], l = cctv[idx][1], result = 0,
     directions[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
  FOR1(dir, 4) {
    ll _result = 0, di = directions[dir][0], dl = directions[dir][1];
    for (ll v, _i = i + di, _l = l + dl; (v = setSight(_i, _l, idx)) >= 0;
         _i += di, _l += dl, _result += v)
      ;

    _result += find(idx + 1);
    result = max(_result, result);

    for (ll _i = i + di, _l = l + dl; unsetSight(_i, _l, idx);
         _i += di, _l += dl)
      ;
  }
  //   cout << 1 << " " << result << "\n";
  return result;
}

ll find2(ll idx) {
  ll i = cctv[idx][0], l = cctv[idx][1], result = 0,
     directions[2][2][2] = {{{0, 1}, {0, -1}}, {{1, 0}, {-1, 0}}};
  for (ll _result, dir0 = 0; dir0 < 2; ++dir0) {
    _result = 0;
    for (ll di, dl, dir1 = 0; dir1 < 2; ++dir1) {
      di = directions[dir0][dir1][0], dl = directions[dir0][dir1][1];
      for (ll v, _i = i + di, _l = l + dl; (v = setSight(_i, _l, idx)) >= 0;
           _i += di, _l += dl, _result += v)
        ;
    }

    _result += find(idx + 1);
    result = max(_result, result);

    for (ll di, dl, dir1 = 0; dir1 < 2; ++dir1) {
      di = directions[dir0][dir1][0], dl = directions[dir0][dir1][1];
      for (ll _i = i + di, _l = l + dl; unsetSight(_i, _l, idx);
           _i += di, _l += dl)
        ;
    }
  }

  //   cout << 2 << " " << result << "\n";

  return result;
}

ll find3(ll idx) {
  ll i = cctv[idx][0], l = cctv[idx][1], result = 0,
     directions[4][2][2] = {{{0, 1}, {-1, 0}},
                            {{0, 1}, {1, 0}},
                            {{0, -1}, {1, 0}},
                            {{0, -1}, {-1, 0}}};
  for (ll _result, dir0 = 0; dir0 < 4; ++dir0) {
    _result = 0;
    for (ll di, dl, dir1 = 0; dir1 < 2; ++dir1) {
      di = directions[dir0][dir1][0], dl = directions[dir0][dir1][1];
      for (ll v, _i = i + di, _l = l + dl; (v = setSight(_i, _l, idx)) >= 0;
           _i += di, _l += dl, _result += v)
        ;
    }

    _result += find(idx + 1);
    result = max(_result, result);

    for (ll di, dl, dir1 = 0; dir1 < 2; ++dir1) {
      di = directions[dir0][dir1][0], dl = directions[dir0][dir1][1];
      for (ll _i = i + di, _l = l + dl; unsetSight(_i, _l, idx);
           _i += di, _l += dl)
        ;
    }
  }

  //   cout << 3 << " " << result << "\n";

  return result;
}

ll find4(ll idx) {
  ll i = cctv[idx][0], l = cctv[idx][1], result = 0,
     directions[4][3][2] = {
         {
             {0, -1},
             {1, 0},
             {-1, 0},
         },
         {
             {0, 1},
             {1, 0},
             {-1, 0},
         },
         {
             {0, 1},
             {0, -1},
             {-1, 0},
         },
         {
             {0, 1},
             {0, -1},
             {1, 0},
         },
     };
  for (ll _result, dir0 = 0; dir0 < 4; ++dir0) {
    _result = 0;
    for (ll di, dl, dir1 = 0; dir1 < 3; ++dir1) {
      di = directions[dir0][dir1][0], dl = directions[dir0][dir1][1];
      for (ll v, _i = i + di, _l = l + dl; (v = setSight(_i, _l, idx)) >= 0;
           _i += di, _l += dl, _result += v)
        ;
    }

    _result += find(idx + 1);
    result = max(_result, result);

    for (ll di, dl, dir1 = 0; dir1 < 3; ++dir1) {
      di = directions[dir0][dir1][0], dl = directions[dir0][dir1][1];
      for (ll _i = i + di, _l = l + dl; unsetSight(_i, _l, idx);
           _i += di, _l += dl)
        ;
    }
  }

  //   cout << 4 << " " << result << "\n";

  return result;
}

ll find5(ll idx) {
  ll i = cctv[idx][0], l = cctv[idx][1], result = 0,
     directions[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
  FOR1(dir, 4) {
    ll di = directions[dir][0], dl = directions[dir][1];
    for (ll v, _i = i + di, _l = l + dl; (v = setSight(_i, _l, idx)) >= 0;
         _i += di, _l += dl, result += v)
      ;
  }

  result += find(idx + 1);

  FOR1(dir, 4) {
    ll _result = 0, di = directions[dir][0], dl = directions[dir][1];
    for (ll _i = i + di, _l = l + dl; unsetSight(_i, _l, idx);
         _i += di, _l += dl)
      ;
  }
  //   cout << 5 << " " << result << "\n";

  return result;
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> n >> m;
  FOR2(i, l, n, m) {
    cin >> mat[i][l];
    if (mat[i][l] < 6 && 0 < mat[i][l]) {
      cctv[ncctv][0] = i, cctv[ncctv][1] = l, ++ncctv;
    } else if (mat[i][l] == 6) {
      ++nblock;
    }
  }
  ll nset = find(1);

  cout << n * m - nblock - ncctv + 1 - nset << "\n";

  return 0;
}
```