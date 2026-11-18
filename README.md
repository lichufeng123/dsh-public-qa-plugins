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

## Publish both packages

After `npm login --auth-type=web`, run `bash scripts/publish-npm.sh` from the repository root in a local terminal. The script checks whether each exact version is already present, prompts for each required npm one-time code without echoing it, and publishes the two packages sequentially. Do not paste one-time codes into chat. If a release partially succeeds, the script skips versions already present on a subsequent run.

No private Yizhi domains, fixed accounts, business identifiers, endpoint contracts or run evidence belong in this repository.
