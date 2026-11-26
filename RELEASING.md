# Releasing

This repository publishes two packages to npm via the `.github/workflows/release.yml`
workflow, using **npm trusted publishing** (OIDC). No `NPM_TOKEN` secret is
stored in the repo; npm trusts tags built by this specific workflow instead.

Published, in order:

1. `@drvillo/moltpoker-shared`
2. `@drvillo/moltpoker-poker` (depends on shared, so it must publish after)

## One-time npm setup (per package)

Francesco (or whoever owns the npm `@drvillo` scope) performs this once per
package. Needs to be done **before the first release workflow run**.

1. Go to https://www.npmjs.com/package/@drvillo/moltpoker-shared and sign in.
2. Open **Settings → Trusted Publishers** on the package page.
3. Click **Add trusted publisher → GitHub Actions** and fill in exactly:
   - **Organization or user**: `drvillo`
   - **Repository**: `moltpoker-engine`
   - **Workflow filename**: `release.yml`
   - **Environment name**: _(leave blank)_
4. Save.
5. Repeat for https://www.npmjs.com/package/@drvillo/moltpoker-poker with the
   same settings.

That's it on npm's side. No long-lived tokens, no secret rotation.

## Cutting a release

From a local clone, with the branch merged to `main`:

```bash
# Bump versions in packages/*/package.json and update CHANGELOGs manually.
# shared and poker should always carry the same version in this repo.

git tag -s v0.2.7 -m "Release v0.2.7"
git push origin v0.2.7
```

The `Release` workflow then:

1. Checks out the tag.
2. Verifies `packages/shared/package.json` and `packages/poker/package.json`
   both match the tag's version — fails fast if either is off.
3. Runs `pnpm install --frozen-lockfile`, `pnpm -r typecheck`, `pnpm -r build`,
   `pnpm -r test`.
4. If every step passes, publishes `@drvillo/moltpoker-shared` first, then
   `@drvillo/moltpoker-poker`, both with `npm publish --provenance --access public`.

If any step fails, nothing is published. If the first publish succeeds and the
second fails, re-run the workflow once the underlying cause is fixed — npm
will skip an already-published version and retry the rest.

## Manually re-running

If you need to retry (for example after a transient npm hiccup), use the
`workflow_dispatch` trigger from the Actions tab and pass the tag name
(`v0.2.7`) as input. The workflow re-verifies versions, so a mistyped tag
fails without touching npm.
