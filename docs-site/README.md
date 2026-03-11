# docs-site

Developer-facing Docusaurus workspace for the Backstage Kubernetes platform docs.

This site is separate from the Backstage runtime and is meant for product, workflow, architecture, and repository guidance that should be easy to browse on GitHub Pages.

## What lives here

- Developer onboarding and platform overview content
- GitOps and cluster lifecycle workflow documentation
- Repository map and template reference material
- Site-specific theme, homepage, navbar, footer, and search configuration

## What does not live here

- Backstage app code: use `packages/app` and `packages/backend`
- TechDocs content owned by Backstage entities
- Generated output: `build/` and `.docusaurus/`

## Workspace model

This directory is a Yarn workspace inside the repo. Install dependencies from the repository root, not from `docs-site` in isolation.

Useful root-level scripts:

```sh
yarn docs:start
yarn docs:typecheck
yarn build:docs
yarn docs:serve
```

Equivalent workspace commands:

```sh
yarn workspace backstage-kubernetes-platform-docs start
yarn workspace backstage-kubernetes-platform-docs typecheck
yarn workspace backstage-kubernetes-platform-docs build
yarn workspace backstage-kubernetes-platform-docs serve
```

## Local development

From the repository root:

```sh
yarn install
yarn docs:start
```

Local site URL:

```txt
http://localhost:3001/backstage-kubernetes-platform/
```

The configured base URL matches GitHub Pages, so local preview intentionally includes the repository path segment.

## Validation

Before pushing docs changes:

```sh
yarn docs:typecheck
yarn build:docs
```

Use `yarn docs:serve` to preview the production build locally.

## Directory map

```txt
docs-site/
  docs/               Markdown and MDX source content
  src/pages/          Homepage and custom pages
  src/css/            Global Docusaurus theme overrides
  static/             Images and static assets
  docusaurus.config.js Site config, navbar, footer, color mode, plugins
  sidebars.js         Docs navigation structure
  tsconfig.json       Docs workspace TypeScript config
```

## Authoring guidance

- Keep content task-first. Developers should be able to start from a workflow, not a marketing narrative.
- Prefer concrete repo references, file locations, and operating model explanations.
- Put long-form product and workflow docs in `docs/`.
- Keep homepage changes in `src/pages/index.tsx` and `src/pages/index.module.css`.
- Keep cross-site palette and typography changes in `src/css/custom.css`.
- If you add a new docs section, update `sidebars.js` so it is reachable.

## Docusaurus conventions used here

- Docusaurus version: `3.9.2`
- Local search: `@easyops-cn/docusaurus-search-local`
- Mermaid enabled through `@docusaurus/theme-mermaid`
- Default color mode is dark, but the user can switch themes
- Docs are served under `/backstage-kubernetes-platform/`

## Publishing

Publishing is handled by the repository workflow in `.github/workflows/deploy-docs.yml`.

The workflow:

- triggers on pushes affecting `docs-site/**`, the deploy workflow, or root `package.json`
- installs dependencies from the repo root
- builds the `backstage-kubernetes-platform-docs` workspace
- uploads `docs-site/build`
- deploys to GitHub Pages

Live site:

```txt
https://jaredthivener.github.io/backstage-kubernetes-platform/
```

## Common edits

Change the homepage:

- `src/pages/index.tsx`
- `src/pages/index.module.css`

Change docs navigation:

- `sidebars.js`

Change branding, color mode, navbar, footer, search, or base URL:

- `docusaurus.config.js`

Change shared theme tokens:

- `src/css/custom.css`

## Notes for contributors

- Do not commit `build/` or `.docusaurus/`.
- Keep the site aligned with the actual product surface in Backstage.
- Use links and labels that match platform terminology already used in the app and repo.
- When changing routing or deployment settings, verify both local preview and GitHub Pages behavior.