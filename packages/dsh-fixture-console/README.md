# dsh-fixture-console

A DSH Skill Bundle and local CLI for generating bounded synthetic fixture files. It does not connect to or write to any business system. Use it to prepare offline data fixtures; a separately reviewed domain adapter is required to seed an application.

## Install

```sh
dsh plugin --profile web add dsh-fixture-console
npm install --global dsh-fixture-console
```

## Generate a local fixture file

Create a JSON specification with a synthetic seed and supported fields, then run:

```sh
dsh-fixture-console generate --spec fixture-spec.json --output generated-fixtures.json
```

The output must not already exist. The generator supports synthetic IDs and labels, bounded integers, booleans, small enums and dates. It limits a spec to 20 entities, 1,000 rows per entity and 5,000 rows total; rejects credential/personal-data fields and phone-like or URL values; and never emits a system-write request.

See the bundled `fixture-data-generation` Skill for the specification schema. Generated files contain only local synthetic data and do not prove that any external system accepted it.
