---
title: GitHub Pages Deployment
description: How the Docusaurus site publishes from GitHub Actions.
---

# GitHub Pages Deployment

The documentation site publishes through a dedicated GitHub Actions workflow.

## Publishing model

- Source branch: `main`
- Build artifact: `docs-site/build`
- Target branch managed by GitHub Pages: `gh-pages`

## Workflow behavior

On pushes to `main`, the workflow:

1. installs `docs-site` dependencies
2. builds the Docusaurus site
3. uploads the static artifact to GitHub Pages
4. deploys the Pages site

## Prerequisites in GitHub

Enable GitHub Pages for the repository and set the source to **GitHub Actions**.

You do not need to create a separate repository environment for this workflow. The deployment is driven directly by the Pages actions.

## Local validation before merge

```bash
yarn docs:install
yarn docs:typecheck
yarn build:docs
```

## Why a separate workflow exists

This keeps documentation deployment independent from Backstage runtime builds and makes doc-only changes cheap to review and publish.