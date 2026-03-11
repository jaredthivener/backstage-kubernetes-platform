---
title: Repository Map
description: A fast guide to where the important parts of the platform live.
---

# Repository Map

Use this page when you need to orient yourself quickly.

## Root-level areas

| Path | What it contains |
| --- | --- |
| `packages/app/` | Backstage frontend, custom product pages, navigation, theme |
| `packages/backend/` | Backstage backend and plugin registration |
| `catalog/` | Backstage catalog entity definitions |
| `templates/` | Self-service scaffolder templates and skeletons |
| `gitops-repo-structure/` | Reference GitOps architecture and repo conventions |
| `examples/` | Example entities and bootstrap data |
| `docs-site/` | GitHub Pages documentation site built with Docusaurus |

## Frontend hotspots

| Path | Reason to visit |
| --- | --- |
| `packages/app/src/App.tsx` | App routes and theme setup |
| `packages/app/src/components/Root/` | Sidebar, logos, and shell behavior |
| `packages/app/src/components/docs/` | Existing in-app documentation experience |
| `packages/app/src/theme/` | Morgan Stanley light and dark theme definitions |

## Workflow hotspots

| Path | Reason to visit |
| --- | --- |
| `templates/kubernetes-cluster/` | Provisioning baseline |
| `templates/cluster-scale/` | Capacity operations |
| `templates/cluster-upgrade/` | Upgrade workflow |
| `templates/cluster-destroy/` | Safe decommissioning |
| `templates/addon-management/` | Day 2 add-on control |

## Documentation hotspots

| Path | Purpose |
| --- | --- |
| `docs-site/docs/` | Product and developer documentation |
| `templates/*/mkdocs.yml` and `catalog-info.yaml` | TechDocs configuration for template-owned docs |
| `gitops-repo-structure/README.md` | Canonical GitOps model description |

## If you only have 10 minutes

Read these in order:

1. `packages/app/src/App.tsx`
2. `packages/app/src/components/Root/Root.tsx`
3. `gitops-repo-structure/README.md`
4. `templates/kubernetes-cluster/template.yaml`
5. `docs-site/docs/intro.mdx`