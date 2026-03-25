---
layout: post
title: "첫 번째 글"
date: 2026-03-25 12:00:00 +0900
tags: [일상]
description: "블로그를 시작합니다."
---

안녕하세요, 블로그를 시작합니다.

## 마크다운으로 글쓰기

이 블로그는 마크다운 파일을 `_posts/` 디렉토리에 추가하면 자동으로 글이 생성됩니다.

파일명 형식은 `YYYY-MM-DD-제목.md` 입니다.

## 코드 예시

```python
def hello():
    print("Hello, world!")

hello()
```

## 새 글 작성하는 법

1. `_posts/` 디렉토리에 `YYYY-MM-DD-slug.md` 파일 생성
2. front matter에 `title`, `date`, `tags` 입력
3. `git push` 하면 자동 배포
