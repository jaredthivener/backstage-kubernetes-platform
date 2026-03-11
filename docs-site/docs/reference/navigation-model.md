---
title: Navigation Model
description: How the Backstage sidebar maps to the platform's product areas.
---

# Navigation Model

The sidebar in `packages/app/src/components/Root/Root.tsx` is one of the most important product artifacts in the repo because it tells developers what the platform considers first-class.

## Primary navigation groups

| Item | Meaning |
| --- | --- |
| Dashboard | Executive summary of platform health |
| Clusters | Core inventory and entry point for Kubernetes operations |
| Platforms | Cloud-provider filtered entry points |
| Security | Security and compliance workflows |
| Cost | FinOps and optimization lens |
| Monitoring | Operational visibility |
| DORA Metrics | Delivery performance |
| Tools | Utility and operational support features |
| Docs | Knowledge base and TechDocs bridge |
| Support | Human help and operational intake |
| AI Chat Bot | Assisted discovery and support |

## Why this matters for documentation

If the sidebar changes, this docs site should usually change too. The documentation should mirror the product model that developers see when they log in.

## Heuristic for future additions

Before adding a new sidebar item, ask:

1. Is this a new product area or just a subsection of an existing area?
2. Does it deserve its own top-level documentation section?
3. Does it introduce a new workflow, new ownership boundary, or new mental model?

If the answer is yes, update both the app and the docs in the same pull request.