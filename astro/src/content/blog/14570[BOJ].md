---
title: '14570 BOJ'
description: '나무 위의 구슬'
pubDate: 'Nov 18 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Recursion"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/14570)

이진 트리란, 위처럼 모든 노드의 자식의 수가 2개 이하인 트리이다.

각 노드에 쓰여 있는 수는 노드의 번호를 의미한다.

특히, 이 문제에서는 루트가 고정되어 있으며, 노드의 순서가 중요한(어떤 서브트리에서도 좌우를 변경할 수 없는) 이진 트리에 대해 다루기로 한다.

이진 트리의 루트에 구슬을 하나 올려놓으면 구슬은 아래와 같은 과정을 거쳐 떨어진다.

1. 현재 구슬이 놓인 노드의 자식이 없다면 그 자리에서 멈춘다.
2. 1을 만족하지 않으며, 만일 현재 구슬이 놓인 노드의 자식 노드가 한 개라면 해당 자식 노드로 떨어진다.
3. 1, 2를 만족하지 않으며, 만일 현재 구슬이 놓인 노드의 자식 노드가 두 개라면,
   1. 현재 노드의 왼쪽 서브트리에 담긴 모든 구슬의 수 <= 오른쪽 서브트리에 담긴 모든 구슬의 수일 경우, 왼쪽 자식 노드로 떨어진다.
   2. 그 외의 경우에는 오른쪽 자식 노드로 떨어진다.
4. 1~3번의 조건을 다시 체크하고 되풀이한다.

구슬은 위와 같은 과정을 거쳐 결국 단말 노드에 쌓이게 된다.

예를 들어, 위의 그림과 같은 트리에 구슬을 떨어뜨릴 경우,

첫 다섯 개의 구슬은 2번, 4번, 2번, 5번, 2번 노드에 차례대로 떨어지게 된다.

위처럼 트리가 충분히 작거나 구슬의 수가 충분히 적을 경우엔 직접 시뮬레이션을 통해

구슬이 떨어지는 순서를 유추할 수가 있다.

하지만, 우리가 관심있는 것은 큰 트리에서 많은 수의 구슬을 떨어뜨리는 과정이다.

임의의 이진 트리가 주어지고, K가 주어졌을 때

K번째 구슬이 어느 노드에서 멈추게 될 지 충분히 빠르게 계산해낼 수 있을까?

# 접근

재귀를 이용해 해결하였다. 문제 상황이 이해가 되면, 구현하는 것은 어렵지 않다.

K의 범위가 10의 18제곱까지로 방대하기 때문에, K가 주어졌을 때 1부터 K까지 모두 시뮬레이션 해보는 것은 불가능하다.
하지만 규칙을 살펴보면, K가 주어졌을 때 어느 쪽(왼쪽 혹은 오른쪽) 서브트리에서 끝이 날지 판별할 수 있다.
왼쪽 서브트리와 오른쪽 서브트리에 대하여 구슬 합의 차이는 1이하이다.
왼쪽이 오른쪽보다 1만큼 크거나 동일하다.
이를 바탕으로 루트 노드에서의 구슬의 이동을 구성하면 다음과 같다.

* 왼쪽 서브트리의 구슬 개수가 오른쪽 서브트리의 구슬 개수와 같으면 왼쪽 서브트리로 이동.
* 왼쪽 서브트리의 구슬 개수가 오른쪽 서브트리의 구슬 개수보다 1만큼 크면 오른쪽 서브트리로 이동.

이러한 이동은 루트 노드에서만 일어나는 것이 아니라, 이동한 서브 트리에서도 동일하게 이루어 진다.
이에 미루어 볼 때, K를 2로 나누었을 때 나머지 1이면, 왼쪽 서브 트리에 마지막 구슬이 위치하고,
나머지가 0이면, 오른쪽 서브 트리에 위치하는 것을 알 수 있다.
해당 서브트리 내부에서도 똑같은 일이 반복되기에, 재귀를 통해 마지막 구슬이 위치하는 단말 노드를 알 수 있다.

# 입력

첫 줄에 이진 트리의 노드의 수 N이 주어진다. (1 ≤ N ≤ 200000)

둘째 줄부터 N개의 줄에 걸쳐, U V가 주어진다.

i번째 줄에 주어지는 U, V는 각각 i번 노드의 왼쪽 자식이 U, 오른쪽 자식이 V임을 의미한다.

만약 U = -1 또는 V = -1이라면, 해당 위치에 자식 노드가 존재하지 않는다는 것이다.

그 외의 경우엔 항상 2 ≤ U, V ≤ N을 만족한다.

이어 마지막 줄에 문제에서 설명한 K가 주어진다. (1 ≤ K ≤ 10^18)

주어지는 트리는 항상 올바른 이진 트리임이 보장되며, 루트는 항상 1번 노드이다.

# 출력

K번째 구슬이 떨어지는 노드의 번호를 출력한다.

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

cll N = 2e5, root = 1;
ll n, k, childs[N + 1][2] = {{}}, bids[N + 1] = {};

ll search(ll node, ll left, ll right) {
  //   cout << node << "\n";
  if (childs[node][0] && childs[node][1]) {
    if (left > right) {
      return search(childs[node][0], left / 2 + left % 2, left / 2);
    } else {
      return search(childs[node][1], right / 2 + right % 2, right / 2);
    }
  } else if (childs[node][0]) {
    return search(childs[node][0], left, right);
  } else if (childs[node][1]) {
    return search(childs[node][1], left, right);
  } else {
    return node;
  }
}

int main(void) {
  ios::sync_with_stdio(false);
  cin.tie(NULL);
  cout.tie(NULL);
  cin >> n;
  for (ll i = 1; i <= n; ++i) {
    cin >> childs[i][0] >> childs[i][1];
    childs[i][0] = childs[i][0] < 0 ? 0 : childs[i][0];
    childs[i][1] = childs[i][1] < 0 ? 0 : childs[i][1];
  }
  cin >> k;
  cout << search(root, k / 2 + k % 2, k / 2) << "\n";

  return 0;
}
```
