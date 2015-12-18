---
title: Internal Coding Guidelines
type: topic
tags:
    - advanced
---

#### app, renderer, glx and gl properties

Various notes and coding hints to make your life easier.

- **app** or **glx** can be cached for later usage
- but *never* cache **renderer** or **gl** as instance properties

