# Stunning Garbanzo blog workflow

이 저장소는 `lshtar13`의 개인 기술 블로그다. 사용자가 블로그 작업을 요청하면 아래 규칙을 기본 작업 방식으로 사용한다.

## Repository map

- 실제 Astro 프로젝트: `astro/`
- 블로그 글: `astro/src/content/blog/`
- 이미지와 정적 파일: `astro/public/`
- 사이트 설정: `astro/src/consts.ts`
- 공통 SEO 메타데이터: `astro/src/components/BaseHead.astro`
- Astro 설정과 sitemap: `astro/astro.config.mjs`
- GitHub Pages workflow: `.github/workflows/deploy.yml`
- 배포 브랜치: `master`

루트의 오래된 `robots.txt`, `sitemap.xml`은 현재 GitHub Pages 배포물이 아니다. 실제 배포는 GitHub Actions가 `astro/`를 빌드한 결과를 사용한다.

## Runtime and commands

- 권장 Node.js: 20 (`.nvmrc`)
- 패키지 관리자: `pnpm@9.15.9` (`astro/package.json`)
- 설치: `cd astro && pnpm install --frozen-lockfile`
- 개발 서버: `cd astro && pnpm dev`
- 검사 및 빌드: `cd astro && pnpm build`
- 프로덕션 미리보기: `cd astro && pnpm preview`

`package.json`의 pnpm 버전과 GitHub Actions의 pnpm 버전을 동시에 다르게 지정하지 않는다. workflow에서는 별도 버전을 지정하지 않고 `packageManager` 값을 사용한다.

Codex의 번들 런타임으로 검증해야 할 때는 해당 런타임의 Node를 `PATH` 앞에 둔다. 검증을 위해 개발 서버를 실행했다면 응답 확인 후 반드시 종료하고, `lsof -nP -iTCP:4321 -sTCP:LISTEN`으로 남은 프로세스가 없는지 확인한다. 사용자가 요청하지 않은 백그라운드 서버를 남기지 않는다.

## Writing a post

1. 요청의 배경과 현재 구현 상태를 먼저 확인한다.
2. 관련된 기존 포스트 2~3개를 읽어 사용자의 문체와 frontmatter 형식을 맞춘다.
3. 사용자의 평소 문체를 따른다.
   - 1인칭 실습 기록으로 쓴다.
   - 문제를 시작한 이유, 실제로 한 일, 막힌 지점, 해결 과정, 다음 작업이 자연스럽게 이어지게 한다.
   - 지나치게 보고서 같거나 생성형 AI가 쓴 듯한 요약문을 피한다.
   - 기술 설명은 구체적으로 쓰되, 실제로 하지 않은 일을 완료한 것처럼 쓰지 않는다.
   - 사용자가 겪은 시행착오와 판단을 지우지 않는다.
4. 긴 원문을 그대로 복사하지 말고 블로그 독자가 읽기 좋은 흐름으로 재구성한다.
5. 비밀번호, 토큰, 실제 개인 전화번호, 사설 식별자와 불필요한 클라우드 리소스 ID를 글에 넣지 않는다. 예시는 `PUBLIC_IP`, `SIP_PASSWORD` 같은 변수로 치환한다.
6. 같은 프로젝트의 글은 동일한 `series` 값을 사용하고, 앞뒤 글 사이에 실제 생성되는 slug 기반 내부 링크를 둔다.

기본 frontmatter 예시:

```yaml
---
title: '글 제목'
description: '검색 결과에도 의미가 드러나는 1~2문장 설명'
pubDate: 'Jul 05 2026'
tags: ['Tag1', 'Tag2']
series: '시리즈 이름'
---
```

`description`은 비워두거나 `공부 기록`처럼 모호하게 쓰지 않는다. 글의 구체적인 기술, 문제, 결과가 드러나게 작성한다.

## Reading source material from Notion with `ntn`

사용자가 Notion 페이지를 언급하면 모델의 기억으로 내용을 추측하지 않는다. 설치된 Notion CLI를 사용한다.

1. 인증 확인:

   ```bash
   ntn whoami
   ```

2. 제목이나 핵심어로 페이지 검색:

   ```bash
   ntn api v1/search -d '{"query":"검색어","filter":{"property":"object","value":"page"},"page_size":20}'
   ```

3. 검색 결과가 하나로 명확하면 페이지 본문 조회:

   ```bash
   ntn pages get PAGE_ID
   ```

4. 결과가 여러 개이고 어느 페이지인지 판단할 근거가 없을 때만 사용자에게 확인한다.
5. Notion 내용을 읽기만 하는 작업에서 페이지를 수정하거나 새 페이지를 만들지 않는다.
6. CLI 출력의 인증 토큰, 내부 사용자 ID, workspace ID를 블로그나 최종 답변에 옮기지 않는다.

macOS 키체인과 네트워크 접근은 Codex sandbox에서 차단될 수 있다. `No auth token found`와 함께 seatbelt/keychain 안내가 나오거나 DNS/API 연결이 실패하면, 같은 read-only 명령을 필요한 범위로만 권한 상승해 다시 실행한다. 인증 실패라고 단정하기 전에 sandbox 밖에서 `ntn whoami`를 확인한다.

## Preserving project context across a series

프로젝트 개요 글과 기술 실습 글을 분리할 때는 다음 흐름을 사용한다.

- 개요 글: 왜 프로젝트를 하는가 → 현재 없는 외부 시스템은 무엇인가 → 무엇을 mock으로 대체하는가 → 전체 구조 → 이번 PoC의 검증 범위 → 첫 실습으로 연결
- 실습 글: 앞선 프로젝트 맥락 → 이번에 검증할 좁은 구간 → 설정 과정 → 실제 증상 → 원인 분석 → 해결 → 전체 프로젝트에서 다음 단계

두 글이 각각 독립적으로 읽히면서도, 첫 글의 마지막과 두 번째 글의 첫 부분이 이어지게 한다.

## SEO expectations

- 모든 페이지에 유효한 canonical URL과 description을 유지한다.
- 블로그 글은 `BlogPosting` 구조화 데이터, 발행일, 수정일, 태그를 전달한다.
- 존재하지 않는 `/og-image/{slug}.png`를 기본 이미지로 사용하지 않는다. `ogImage`, `heroImage`, 실제 기본 이미지 순으로 선택한다.
- 한국어 문서는 `lang="ko"`를 유지한다.
- 얇고 중복되는 태그 상세, 시리즈 상세, pagination 페이지는 검색 색인의 주 대상이 아니다. 현재 `noindex, follow`와 sitemap filter 정책을 보존한다.
- `astro/public/googledcaec4fc1105c823.html`은 Google Search Console 소유권 확인 파일이므로 제거하지 않는다.
- SEO 변경 후 생성된 `astro/dist/sitemap-0.xml`의 URL 수와 대표 글의 HTML meta/JSON-LD를 확인한다.

배포 후 검색 노출 문제를 다룰 때는 Google Search Console에서 다음을 안내한다.

1. `https://lshtar13.github.io/sitemap-index.xml` 제출 또는 재제출
2. 중요한 새 글을 URL 검사한 뒤 색인 생성 요청
3. `크롤링됨 - 현재 색인이 생성되지 않음`, canonical 선택, robots/noindex 상태 확인

Google 색인 요청은 노출이나 즉시 반영을 보장하지 않는다는 점을 명확히 말한다.

## Verification cycle

글 또는 SEO 코드를 수정한 뒤 다음 순서로 검증한다.

1. `git diff --check`
2. `cd astro && pnpm build`
3. 빌드 결과에서 새 글의 route와 series route 확인
4. 내부 링크의 대상 HTML이 실제로 생성되었는지 확인
5. SEO 변경이면 대표 글의 canonical, robots, description, OG image, JSON-LD 확인
6. `git status --short`로 의도하지 않은 생성물이나 기존 사용자 변경사항이 섞이지 않았는지 확인

기존 코드에서 발생하던 경고와 이번 변경으로 새로 생긴 오류를 구분한다. 가능한 경우 최종적으로 Astro 검사 결과를 오류, 경고, hint 모두 0으로 만든다.

## GitHub and deployment with `gh`

GitHub Actions 문제를 확인할 때는 GitHub CLI를 사용한다.

```bash
gh auth status
gh run list --limit 10 --json databaseId,name,displayTitle,headBranch,headSha,status,conclusion,createdAt,url
gh run view RUN_ID --json jobs,conclusion,url,headSha,event
gh run view RUN_ID --log-failed
```

`gh auth status`가 sandbox 안에서 token invalid 또는 API 연결 실패를 출력해도 곧바로 재로그인을 요구하지 않는다. macOS 키체인과 네트워크가 원인일 수 있으므로 같은 read-only 조회를 필요한 범위로만 권한 상승해 재확인한다.

Actions 실패는 마지막 에러 한 줄뿐 아니라 실패 job과 step을 확인하고, 로컬 설정과 비교해 원인을 설명한다. 예를 들어 `package.json`의 `packageManager`와 workflow의 `package-manager` 중복 지정 여부를 확인한다.

사용자가 명시적으로 요청하지 않는 한 commit, push, workflow 재실행, 배포, Search Console 제출을 수행하지 않는다. 로컬 수정과 외부 상태 변경을 구분해 보고한다.

## Safety and repository hygiene

- 기존 사용자 변경사항을 덮어쓰거나 되돌리지 않는다.
- 의존성 설치와 빌드 과정에서 추적 중인 `astro/node_modules`가 변경될 수 있으므로 작업 종료 전에 반드시 상태를 확인한다.
- 검증 과정에서 만든 임시 캐시, 임시 설정, 백그라운드 프로세스를 남기지 않는다.
- 토큰이나 키체인 인증 값을 출력하거나 문서에 저장하지 않는다.
- 구현하지 않은 기능, 배포되지 않은 수정, 완료되지 않은 외부 작업을 완료했다고 말하지 않는다.

## Final handoff

최종 답변에는 다음만 간결하게 포함한다.

- 무엇을 작성하거나 수정했는지
- 주요 파일의 링크
- 어떤 검증을 통과했는지
- 아직 사용자가 해야 하는 외부 작업이 있는지

중간 작업 로그를 길게 반복하지 않는다.
