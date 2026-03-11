---
title: Local Development
description: Run the Docusaurus docs site and the Backstage platform locally.
---

# Local Development

This repository now contains two runnable developer experiences:

- The Backstage platform itself.
- A standalone Docusaurus documentation site in `docs-site`.

## Prerequisites

- Node.js 22 or 24
- Corepack enabled
- Yarn 4.4.1 through the repository's existing Yarn configuration

## Install root dependencies

From the repository root:

```bash
yarn install
```

## Run the Backstage app

```bash
yarn start
```

## Run the docs site

Install docs-site dependencies once:

```bash
yarn docs:install
```

Start Docusaurus:

```bash
yarn docs:start
```

The docs site runs on port `3001` by default.

## Build the docs site

```bash
yarn build:docs
```

## Type-check the docs site

```bash
yarn docs:typecheck
```

## When to edit which docs system

Use Docusaurus when you are documenting the product or the repository itself:

- onboarding
- architecture
- workflow explanations
- repo maps
- deployment guidance

Use TechDocs when you are documenting an individual component, service, or generated entity inside the Backstage ecosystem.

## Recommended local workflow

1. Run Backstage if you are changing product behavior or navigation.
2. Run Docusaurus if you are refining the developer guide.
3. Keep cross-links between the two documentation surfaces explicit.

:::note
The docs site is intentionally isolated from the Backstage build so that publishing documentation does not require touching the runtime app.
:::