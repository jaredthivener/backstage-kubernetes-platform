---
title: Templates Reference
description: What templates exist in this repository and how to reason about them.
---

# Templates Reference

The `templates/` directory is the platform's workflow library.

## Current template inventory

| Template | Purpose |
| --- | --- |
| `addon-management` | Enable or disable supported cluster add-ons |
| `cluster-destroy` | Decommission a cluster with an explicit request flow |
| `cluster-scale` | Adjust cluster size or topology |
| `cluster-upgrade` | Upgrade cluster versions and related assets |
| `kubernetes-cluster` | Provision a new cluster and its baseline GitOps output |
| `namespace-request` | Request namespace creation in shared environments |

## What good template docs should include

- business intent
- required inputs
- generated artifacts
- approval expectations
- rollback or failure considerations
- links to TechDocs and GitOps output

## Recommended structure for future template docs

1. Goal
2. Inputs
3. Output files
4. Review path
5. Runtime ownership

## Why template docs belong in this site too

TechDocs is useful for template-local details, but this Docusaurus site is where you explain how templates fit together as a product portfolio.

That distinction matters. It keeps local docs focused while preserving a coherent top-level story for developers.