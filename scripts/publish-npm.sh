#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGES=(dsh-requirement-review dsh-fixture-console)

for package in "${PACKAGES[@]}"; do
  package_dir="$ROOT/packages/$package"
  name="$(node -p "require('$package_dir/package.json').name")"
  version="$(node -p "require('$package_dir/package.json').version")"
  if npm view "$name@$version" version >/dev/null 2>&1; then
    printf '%s@%s is already published; skipping.\n' "$name" "$version"
    continue
  fi

  otp=''
  printf 'Enter npm one-time code for %s@%s: ' "$name" "$version"
  IFS= read -r -s otp
  printf '\n'
  (
    cd "$package_dir"
    NPM_CONFIG_OTP="$otp" npm publish --access public
  )
  unset otp
  printf 'Published %s@%s.\n' "$name" "$version"
done
