---
name: Issue template
about: General issue template
title: ''
labels: ''
assignees: ''

---

## Description
<!-- What is this and why are we building it? 1-3 sentences max. -->

## Tasks
<!-- Break down into small, checkable steps. One task = one logical unit of work. -->
- [ ] 

## Acceptance Criteria
<!-- How do we know this is done? Be specific. -->

**Feature**
- [ ] Matches the behaviour described above
- [ ] Works on both `en` and `ru` locales
- [ ] No hardcoded strings — all copy goes through next-intl

**Code quality**
- [ ] No `@ts-ignore` or `any` without a comment explaining why
- [ ] No `console.log` left in code
- [ ] Follows naming conventions (files: PascalCase components, camelCase utils)
- [ ] No new files in `src/components/ui/` — wrap, don't edit

**Tests**
- [ ] Unit tests for any logic in `lib/` or `stores/`
- [ ] Component tests for UI behaviour (not snapshots)
- [ ] Coverage does not drop below 80%

**PR**
- [ ] Linked to this Issue via `Closes #N`
- [ ] Branch is rebased on `develop` before merge
- [ ] No unresolved comments

## Notes
<!-- Gotchas, constraints, decisions made, or anything the reviewer should know. -->

## Resources
<!-- Relevant docs, rubric sections, prior decisions, related Issues. -->
