---
title: '14601 BOJ'
description: '샤워실 바닥 깔기 (Large)'
pubDate: 'Nov 19 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Implementation",
        "Divide and Conquer"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/14601)

오늘은 민규가 훈련소에 입소하는 날이다. 모든 행사를 마치고 생활관으로 돌아와서 쉬려는데 갑자기 교관이 들어오더니 민규의 이름을 부르는 것이 아닌가. 당황한 채로 따라갔더니 이번엔 김준서를 아느냐고 물어보았다. 그 녀석이 샤워실 바닥을 깔았는데, 배수구 위치까지 막아버렸다면서 같은 학교 출신인 민규가 다시 깔라는 것이었다.

어떻게 타일을 깔지 고민하던 민규는 샤워실의 구조가 정사각형이면서 한 변의 길이가 2의 제곱수라는 사실을 알아냈다. 준서는 여기까지만 고려해서 2x2 크기의 타일로 바닥을 전부 채운 것 같은데, 문제는 이렇게 하면 배수구가 있어야 할 위치를 비울 수가 없다는 것이다. 이런저런 방법을 생각하다가 4칸을 차지하는 정사각형 타일 대신 3칸을 차지하는 ㄱ자 모양의 타일을 사용하면 될 것 같다는 느낌을 받았다.

그런데 ㄱ자 타일을 어떻게 채워야 할까? 생각하다 지친 민규는 여러분에게 이 방법을 찾아달라고 부탁했다. 첫날부터 생활관에서 밤을 새우는 일이 없도록 여러분이 도와주자.

# 접근

분할 정복 알고리즘으로 해결하였다.

예제가 큰 힌트가 되었다. 채워야 하는 바닥의 크기가 2의 제곱인 것을 고려하였을
때, 4등분이 가능하다. 사분면 중 하나의 사분면에 구멍이 존재하고,
나머지 사분면은 빈틈없이 채워야 한다. 그런데 이러한 구성은 k가 1일 때의 경우와
똑같다!

즉 바닥에 구멍이 하나 있는 정사각형 모양의 바닥을 채우는 것은(A),
해당 바닥을 사등분하고 3개의 사분면이 이루는
기역 모양의 바닥을 빈틈없이 채우고(B) 나머지 정사각형 모양의 구멍이 하나 있는
바닥을 채우는 것(A')으로 환원된다. 전자는 두번째와 세번째 예제와 같이 처리하면
되고, 후자는 기존의 목표와 동일한 것이니 다시 반복하면 되는 것이다.
아래 이미지는 두번째와 세번째 예제이다.

![image](http://onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/problem/14600/3.png)
![image](http://onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/problem/14600/2.png)

이런식으로 문제를 분할하여 해결하면 바닥을 채우는 경우를 구할 수 있다.
2의 거듭제곱에 1을 뺀 값은 무조건 3의 배수이므로 불가능한 경우는 생각하지
않아도 된다.

# 입력

첫 번째 줄에는 바닥의 한 변의 길이를 표현하는 자연수 K(1 ≤ K ≤ 7) 가 주어진다. 이때 바닥의 크기는 2K 가 됨에 유의하라. 두 번째 줄에는 배수구의 위치를 나타내는 자연수 x, y (1 ≤ x, y ≤ 2K)가 공백으로 분리돼서 주어진다. 이때 가장 왼쪽 아래가 (1, 1), 가장 오른쪽 위가 (2K, 2K)이다.

# 출력

각 타일마다 고유한 번호를 매긴 타일의 배치도를 출력한다. 각 타일의 번호에는 19000 이하의 자연수만을 사용해야 한다. 배수구가 있는 위치는 -1로 표시한다. 가능한 답 중 하나만 출력하면 된다.

만약 알맞게 타일을 배치하는 방법이 존재하지 않는다면 -1을 출력한다.

# 코드

```cpp
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

/*
0 1
2 3
*/

cll K = 256;
ll d, k, x, y, mat[K][K] = {}, id = 0;

void fill0(ll dimension, ll st0, ll st1, ll quad) {
  ll en0 = st0 + pow(2, dimension), en1 = st1 + pow(2, dimension),
     mean0 = (st0 + en0) / 2, mean1 = (st1 + en1) / 2, reserve;
  ll pt0_0 = st0, pt0_1 = st1, pt1_0 = st0, pt1_1 = mean1, pt2_0 = mean0,
     pt2_1 = st1, pt3_0 = mean0, pt3_1 = mean1,
     pt0 = st0 + pow(2, dimension - 2), pt1 = st1 + pow(2, dimension - 2);

//   cout << dimension << " " << st0 << " " << st1 << " " << quad << "\n";

  if (dimension == 1) {
    reserve = mat[st0 + quad / 2][st1 + quad % 2];
    mat[st0][st1] = mat[st0][en1 - 1] = mat[en0 - 1][st1] =
        mat[en0 - 1][en1 - 1] = ++id;
    mat[st0 + quad / 2][st1 + quad % 2] = reserve;
    return;
  }

  switch (quad) {
  case 0:
    fill0(dimension - 1, pt0, pt1, 0);
    fill0(dimension - 1, pt1_0, pt1_1, 2);
    fill0(dimension - 1, pt2_0, pt2_1, 1);
    fill0(dimension - 1, pt3_0, pt3_1, 0);
    return;
  case 1:
    fill0(dimension - 1, pt0, pt1, 1);
    fill0(dimension - 1, pt0_0, pt0_1, 3);
    fill0(dimension - 1, pt2_0, pt2_1, 1);
    fill0(dimension - 1, pt3_0, pt3_1, 0);
    return;
  case 2:
    fill0(dimension - 1, pt0, pt1, 2);
    fill0(dimension - 1, pt0_0, pt0_1, 3);
    fill0(dimension - 1, pt1_0, pt1_1, 2);
    fill0(dimension - 1, pt3_0, pt3_1, 0);
    return;
  default:
    fill0(dimension - 1, pt0, pt1, 3);
    fill0(dimension - 1, pt0_0, pt0_1, 3);
    fill0(dimension - 1, pt1_0, pt1_1, 2);
    fill0(dimension - 1, pt2_0, pt2_1, 1);
    return;
  }
}

void fill1(ll dimension, ll st0, ll st1) {
  ll en0 = st0 + pow(2, dimension), en1 = st1 + pow(2, dimension),
     mean0 = (st0 + en0) / 2, mean1 = (st1 + en1) / 2;

  if (!dimension) {
    mat[st0][st1] = -1;
    return;
  }

  if (x < mean0 && y < mean1) {
    fill1(dimension - 1, st0, st1);
    fill0(dimension, st0, st1, 0);
  } else if (x < mean0 && y >= mean1) {
    fill1(dimension - 1, st0, mean1);
    fill0(dimension, st0, st1, 1);
  } else if (x >= mean0 && y < mean1) {
    fill1(dimension - 1, mean0, st1);
    fill0(dimension, st0, st1, 2);
  } else {
    fill1(dimension - 1, mean0, mean1);
    fill0(dimension, st0, st1, 3);
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);

  cin >> k >> x >> y;
  d = pow(2, k);
  y = d - y, --x;
  swap(x, y);
  fill1(k, 0, 0);

//   cout << "-----------\n";

  for (ll i = 0; i < d; ++i) {
    for (ll l = 0; l < d; ++l) {
      cout << mat[i][l] << " ";
    }
    cout << "\n";
  }

  return 0;
}
```
