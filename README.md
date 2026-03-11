# Backstage Kubernetes Platform

[![Docs Deploy](https://github.com/jaredthivener/backstage-kubernetes-platform/actions/workflows/deploy-docs.yml/badge.svg?branch=main)](https://github.com/jaredthivener/backstage-kubernetes-platform/actions/workflows/deploy-docs.yml)
[![Backstage](https://img.shields.io/badge/Backstage-1.48.4-9BF0E1?logo=backstage&logoColor=000000)](https://backstage.io)
[![Node.js](https://img.shields.io/badge/Node.js-22%20%7C%2024-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Yarn](https://img.shields.io/badge/Yarn-4.4.1-2C8EBB?logo=yarn&logoColor=white)](https://yarnpkg.com)

A Backstage-based internal platform for Kubernetes fleet management, self-service cluster operations, and platform documentation.

This repository combines four concerns that are often split across separate tools and wikis:

- A Backstage product surface for cluster inventory, workflows, docs, support, monitoring, cost, and security.
- A scaffolder-driven workflow layer for Day 1 and Day 2 cluster operations.
- A GitOps operating model built around Cluster API, ArgoCD, and cloud-specific management clusters.
- A documentation site published from the same repository for platform onboarding and operational guidance.

## What This Platform Covers

- Multi-cloud cluster workflows for AKS, EKS, and GKE.
- Backstage catalog and discoverability for platform entities.
- Scaffolder templates for provisioning, scaling, upgrading, destroying, and namespace requests.
- Docusaurus-based platform docs published to GitHub Pages.
- A repository structure that keeps product surface, workflow contracts, and GitOps conventions aligned.

## Architecture Summary

The platform is easiest to understand as four layers:

1. Product surface in Backstage.
2. Workflow engine in `templates/`.
3. GitOps operating model in `gitops-repo-structure/`.
4. Catalog and documentation metadata in `catalog/` and TechDocs-related files.

## Repository Layout

| Path | Purpose |
| --- | --- |
| `packages/app/` | Backstage frontend, routes, navigation, theming, and product pages |
| `packages/backend/` | Backstage backend and plugin registration |
| `catalog/` | Catalog entities and metadata shown in Backstage |
| `templates/` | Scaffolder templates for platform workflows |
| `gitops-repo-structure/` | Reference GitOps conventions and management-cluster topology |
| `docs-site/` | Docusaurus docs site used for GitHub Pages publishing |
| `examples/` | Sample entities and bootstrap content |

## Prerequisites

- Node.js `22` or `24`
- Corepack enabled
- Yarn `4.4.1`

## Quick Start

```sh
corepack enable
yarn install --immutable
yarn start
```

This starts the Backstage app and backend in local development mode.

## Common Commands

```sh
yarn start
yarn build:all
yarn build:docs
yarn lint
yarn test
yarn tsc
```

## Documentation

The documentation site lives in `docs-site/` and is designed to mirror the actual platform product areas and workflows.

Recommended reading order for new contributors:

1. `docs-site/docs/getting-started/local-development.md`
2. `docs-site/docs/reference/platform-architecture.md`
3. `docs-site/docs/getting-started/first-cluster-workflow.md`
4. `docs-site/docs/reference/repository-map.md`

## Key Workflow Areas

- `templates/kubernetes-cluster/` for baseline cluster provisioning
- `templates/cluster-scale/` for capacity changes
- `templates/cluster-upgrade/` for upgrade requests
- `templates/cluster-destroy/` for decommissioning
- `templates/addon-management/` for Day 2 add-on operations

## Development Notes

- The repo uses Yarn workspaces.
- The docs site is built and deployed through `.github/workflows/deploy-docs.yml`.
- The supported Node engine range is defined in `package.json` as `22 || 24`.
- A native dependency in the Backstage backend currently makes Node `22` the safer runtime for CI install steps that need a deterministic build.
