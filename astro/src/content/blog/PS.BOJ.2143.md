---
title: '2143 BOJ'
description: '두 배열의 합'
pubDate: 'Oct 12 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "Prefix Sum", "Binary Search", "Two Pointer"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/2143)
한 배열 A[1], A[2], …, A[n]에 대해서, 부 배열은 A[i], A[i+1], …, A[j-1], A[j] (단, 1 ≤ i ≤ j ≤ n)을 말한다. 
이러한 부 배열의 합은 A[i]+…+A[j]를 의미한다. 각 원소가 정수인 두 배열 A[1], …, A[n]과 B[1], …, B[m]이 주어졌을 때, 
A의 부 배열의 합에 B의 부 배열의 합을 더해서 T가 되는 모든 부 배열 쌍의 개수를 구하는 프로그램을 작성하시오.
예를 들어 A = {1, 3, 1, 2}, B = {1, 3, 2}, T=5인 경우, 부 배열 쌍의 개수는 다음의 7가지 경우가 있다.</br>
```
T(=5) = A[1] + B[1] + B[2]
      = A[1] + A[2] + B[1]
      = A[2] + B[3]
      = A[2] + A[3] + B[1]
      = A[3] + B[1] + B[2]
      = A[3] + A[4] + B[3]
      = A[4] + B[2] 
```

# 접근
A 의 부배열 합들 조합과 B의 그것들을 미리 구하고, 이들 간의 조합을 조사함으로써 해결하였다. 이분탐색을 통하여 빠르게 구하였다.

## 이분탐색
A의 부분합 배열 sumA의 한 원소(i)를 택해 t-sumA[i]값이 sumB에 몇개 존재하는지 확인한다. 부분합 배열에는 같은 수가 여러 개가 포함되어 있을 수 있기에, upper_bound, lower_bound를 사용해서 그 개수를 구한다.
## 투포인터
풀고 난 후 다른 사람들의 풀이를 보니, 투포인터를 사용해서 합이 t가 되는 경우의 수를 계산하는 것이 낫다는 것을 확인했다. 정렬된 sumA와 sumB에 대하여 sumA는 오름차순으로 sumB는 내림차순으로 조사한다.

# 입력
첫째 줄에 T(-1,000,000,000 ≤ T ≤ 1,000,000,000)가 주어진다. 다음 줄에는 n(1 ≤ n ≤ 1,000)이 주어지고, 그 다음 줄에 n개의 정수로 A[1], …, A[n]이 주어진다. 다음 줄에는 m(1 ≤ m ≤ 1,000)이 주어지고, 그 다음 줄에 m개의 정수로 B[1], …, B[m]이 주어진다. 각각의 배열 원소는 절댓값이 1,000,000을 넘지 않는 정수이다.
# 출력
첫째 줄에 답을 출력한다. 가능한 경우가 한 가지도 없을 경우에는 0을 출력한다.

# 코드
```
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
typedef vector<vll> vvll;

cll N = 1000, M = 1000;
ll t, n, m, sumA[N + 1] = {}, sumB[M + 1] = {};

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    cin >> t;
    cin >> n;
    for (ll i = 1; i <= n; ++i)
    {
        cin >> sumA[i];
        sumA[i] += sumA[i - 1];
    }

    cin >> m;
    for (ll i = 1; i <= m; ++i)
    {
        cin >> sumB[i];
        sumB[i] += sumB[i - 1];
    }

    vll colA;
    map<ll, ll> colB;
    for (ll i = 0; i < n; ++i)
    {
        for (ll l = i + 1; l <= n; ++l)
        {
            colA.emplace_back(sumA[l] - sumA[i]);
        }
    }
    for (ll i = 0; i < m; ++i)
    {
        for (ll l = i + 1; l <= m; ++l)
        {
            ++colB[sumB[l] - sumB[i]];
        }
    }

    ll result = 0;
    for (auto &sum : colA)
    {
        result += colB[t - sum];
    }
    cout << result << "\n";

    return 0;
}
```
