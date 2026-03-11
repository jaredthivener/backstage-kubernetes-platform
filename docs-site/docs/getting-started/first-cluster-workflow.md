---
title: First Cluster Workflow
description: Understand the end-to-end developer journey for provisioning or changing a cluster.
---

# First Cluster Workflow

The repository suggests a clean product story: developers should not need to know every infrastructure detail before asking the platform to create or update a cluster.

## End-to-end journey

1. A developer enters the Backstage portal.
2. They open a scaffolder workflow such as cluster provisioning, scaling, or upgrade.
3. The template generates GitOps artifacts and metadata.
4. GitHub Actions validate the change.
5. ArgoCD reconciles the approved change onto the correct management cluster.
6. Cluster API providers create or update workload infrastructure in the target cloud.

```mermaid
flowchart LR
    A[Developer] --> B[Backstage workflow]
    B --> C[Template output]
    C --> D[GitHub PR or commit]
    D --> E[Validation and policy checks]
    E --> F[ArgoCD sync]
    F --> G[Management cluster]
    G --> H[Workload cluster change]
```

## The important abstraction

Developers interact with a platform workflow, not with raw infrastructure manifests. That abstraction is the main value of the product.

## Where the workflow lives in this repo

- Templates live in `templates/`.
- GitOps examples live in `gitops-repo-structure/`.
- Catalog data lives in `catalog/`.
- Frontend routes and pages live in `packages/app/src/`.

## What to inspect if something feels broken

| Symptom | First place to inspect |
| --- | --- |
| Workflow missing in UI | `templates/` and frontend routes |
| Generated manifest shape is wrong | template skeleton files |
| Docs page does not match behavior | Docusaurus docs and TechDocs references |
| Cluster not reconciling | GitOps flow, ArgoCD registration, management cluster inputs |

## Related docs

- [Cluster lifecycle](../core-workflows/cluster-lifecycle.md)
- [GitOps model](../core-workflows/gitops-model.md)
- [Templates reference](../reference/templates.md)