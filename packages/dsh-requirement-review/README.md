# dsh-requirement-review

DSH Bundle that exposes portable requirement-review, business-flow modeling and test-case generation Skills. Canonical content is generated from the public `ai-test-engineer` repository's `.agents/skills/` tree; use the sync script in the monorepo instead of editing generated skill bundles by hand.

## Included Skills

- `requirement-spec-generate`
- `generate-business-assertions`
- `test-case-generate`

The bundle contains only framework workflows. It does not include any private Yizhi knowledge-base connector, Feishu credentials, business baseline or account data. A project must provide its own authoritative knowledge adapter and current business rules. A generated review is not an approved requirement until a human review is recorded.

## Install

```sh
dsh plugin --profile web add dsh-requirement-review
```

The Bundle registers the Skills with the DSH Skill service. It does not add an external writer or publish documents. External writes remain governed by the user's configured adapters and explicit task authorization.
