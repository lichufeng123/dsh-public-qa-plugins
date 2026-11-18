# Public DSH QA Plugins

Public DSH plugin packages with intentionally separated responsibilities:

- [`dsh-requirement-review`](packages/dsh-requirement-review): portable requirement and test-design Skills sourced from the public AI Test Engineer framework. Business knowledge adapters remain user supplied.
- [`dsh-fixture-console`](packages/dsh-fixture-console): bounded synthetic fixture-file generation. It does not seed business systems; application writes require a separately reviewed adapter.

Both are DSH Bundle plugins distributed as public npm packages. Source bundles under package `skills/` are generated artifacts; the canonical requirement Skills live at `https://github.com/lichufeng123/ai-test-engineer/tree/main/.agents/skills/`.

## Local validation

```sh
npm run check
npm test
(cd packages/dsh-requirement-review && npm pack --dry-run)
(cd packages/dsh-fixture-console && npm pack --dry-run)
```

No private Yizhi domains, fixed accounts, business identifiers, endpoint contracts or run evidence belong in this repository.
