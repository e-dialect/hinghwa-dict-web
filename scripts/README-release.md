# Immutable package contract

Production source is the current `master` commit of `e-dialect/hinghwa-dict-web`.
`ci.yml` aggregates production lint/build, source/API/entry-asset checks, release-safety tests,
and a real `linux/amd64` Nginx runtime smoke into `CI gate`. This master has no Kinship
engine/data-contract workflow; no unmerged feature or develop source is imported.

`release.yml` accepts only the latest successful trusted exact-SHA CI run and its aggregate gate.
It checks the current branch before registry login and immediately before publication.
A known `sha-<40 character SHA>` tag is verified and reused without a rebuild or overwrite;
unknown/denied registry access fails closed except a first-page new-package 404.
Missing images are loaded locally, smoke-tested, and only then pushed. The resulting manifest
binds source, branch, CI run, `image@sha256:digest`, raw config digest/image ID, platform,
revision, API policy and runtime receipt. Existing tags are smoke-tested again.

The dedicated `Dockerfile.release` and its context allowlist exclude environment files, Git
metadata and COS configuration. Only compiled assets enter the final image. It serves port
8080 as numeric non-root `10001:10001`, with a read-only root filesystem, dropped capabilities,
no-new-privileges, bounded memory/CPU/PIDs and a bounded `/tmp` tmpfs. Runtime smoke requests
only its own loopback-published disposable container: it fetches every emitted JS/CSS asset,
checks production API selection, rejects external entry JS/CSS and missing assets, and checks
sensitive paths are unavailable. It does not call a backend or establish browser/user acceptance.

The receipt claims only `sameOriginEntryAssets`: the HTML entry scripts and stylesheets
are local, and emitted JS/CSS files are fetched and scanned. It does not execute browser
JavaScript or prove that dynamic loaders, content, images, fonts, or API calls are same-origin.
`browserAcceptance` is explicitly unverified; `scripts/browser-acceptance.json` records a
non-exhaustive dependency inventory and pending browser paths. Empty known dependencies
mean none were recorded, not that external runtime dependencies are absent.

The unchanged master Markdown editor/viewer uses mavon-editor with its default external
loading enabled: cdnjs supplies highlight.js (including selected languages/themes), KaTeX,
and github-markdown CSS. Their exact URLs/templates are recorded in the contract. These
resources are not fetched by CI smoke. Article/word editing and Markdown previews still
require real browser verification before production deployment; package CI does not approve
those user paths. This change preserves the existing product behavior.

The old Dockerfile, Compose, API rewrite script and COS workflows remain legacy paths.
**A push to master still triggers `master-deploy-cos.yml`, which builds in development mode
and writes the public `/hinghwa-dict-web-master/` COS prefix.** That deployment side effect is not a CI gate;
review its authorization/routing separately before pushing/merging. This change neither runs
nor disables that workflow, enables the deployment registry, or deploys this application.

Local checks:

```sh
node --test scripts/release.test.mjs
python3 -m unittest discover -s scripts -p 'test_*.py'
yarn run lint --no-fix --max-warnings=0
yarn run build
python3 scripts/check-assets.py --root dist
```

Local unit tests use synthetic Docker/HTTP responses and are not proof of a real Docker
or remote CI pass.
