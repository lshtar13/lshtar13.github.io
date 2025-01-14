---
title: '9466 BOJ'
description: '텀 프로젝트'
pubDate: 'Oct 25 2024'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Baekjoon", "BOJ", "Problem Solving", "PS", "DFS", "Depth-First Search", "Cycle"]
series: "PS"
---

# [문제](https://www.acmicpc.net/problem/9466)
이번 가을학기에 '문제 해결' 강의를 신청한 학생들은 텀 프로젝트를 수행해야 한다. 프로젝트 팀원 수에는 제한이 없다. 심지어 모든 학생들이 동일한 팀의 팀원인 경우와 같이 한 팀만 있을 수도 있다. 프로젝트 팀을 구성하기 위해, 모든 학생들은 프로젝트를 함께하고 싶은 학생을 선택해야 한다. (단, 단 한 명만 선택할 수 있다.) 혼자 하고 싶어하는 학생은 자기 자신을 선택하는 것도 가능하다.

학생들이(s1, s2, ..., sr)이라 할 때, r=1이고 s1이 s1을 선택하는 경우나, s1이 s2를 선택하고, s2가 s3를 선택하고,..., sr-1이 sr을 선택하고, sr이 s1을 선택하는 경우에만 한 팀이 될 수 있다.

예를 들어, 한 반에 7명의 학생이 있다고 하자. 학생들을 1번부터 7번으로 표현할 때, 선택의 결과는 다음과 같다.

1	2	3	4	5	6	7
3	1	3	7	3	4	6
위의 결과를 통해 (3)과 (4, 7, 6)이 팀을 이룰 수 있다. 1, 2, 5는 어느 팀에도 속하지 않는다.

주어진 선택의 결과를 보고 어느 프로젝트 팀에도 속하지 않는 학생들의 수를 계산하는 프로그램을 작성하라.

# 접근
깊이 우선 탐색을 이용하여 해결하였다. 사이클을 검출해야 하는데, 이를 위해선 각 노드들을 두번 방문해야 한다는 점에 있어서 어려움이 있었다. </br>
한번 방문한다고 그 노드에 대한 탐색이 종료되는 것이 아니라 두번 방문해야 해당 노드가 사이클 안에 위치해 있다는 점을 확신할 수 있다. 
따라서 방문배열을 만들 때 '탐색 중', '탐색 전', '탐색 완료', 총 세가지 상태로 나누어 기록하였다. 자신의 자식노드가 탐색 완료가 되었을 때, 자신이 아직도 '탐색 중'이라면 해당 노드는 사이클에 포함되지 않는 것이다.
반면에, 두번 방문한 노드는 사이클에 포함된다.

# 입력
첫째 줄에 테스트 케이스의 개수 T가 주어진다. 각 테스트 케이스의 첫 줄에는 학생의 수가 정수 n (2 ≤ n ≤ 100,000)으로 주어진다. 각 테스트 케이스의 둘째 줄에는 선택된 학생들의 번호가 주어진다. (모든 학생들은 1부터 n까지 번호가 부여된다.)

# 출력
각 테스트 케이스마다 한 줄에 출력하고, 각 줄에는 프로젝트 팀에 속하지 못한 학생들의 수를 나타내면 된다.

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
typedef vector<vll> vvll;

cll N = 1e5;
ll n, students[N] = {};

bool search(ll student, short visited[])
{
    if (visited[student] == 2 || visited[student] == -1)
    {
        goto END;
    }

    ++visited[student];
    search(students[student], visited);
    if (visited[student] != 2)
    {
        visited[student] = -1;
    }

END:
    return visited[student] > 0;
}

void solve(void)
{
    cin >> n;
    for (ll to, i = 0; i < n; ++i)
    {
        cin >> to;
        students[i] = --to;
    }

    ll result = 0;
    short visited[N] = {};
    for (ll i = 0; i < n; ++i)
    {
        result += search(i, visited);
    }

    cout << n - result << "\n";
}

int main(void)
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    cout.tie(NULL);

    ll t;
    cin >> t;
    while (t--)
    {
        solve();
    }

    return 0;
}
```
