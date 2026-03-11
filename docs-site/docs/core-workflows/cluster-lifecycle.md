---
title: Cluster Lifecycle
description: The platform workflows for Day 1 and Day 2 operations.
---

# Cluster Lifecycle

The repository already models a practical cluster lifecycle through templates rather than ad hoc manual procedures.

## Supported workflow families

| Workflow | Intent | Repo path |
| --- | --- | --- |
| Provision cluster | Create a new Kubernetes cluster and its GitOps repo | `templates/kubernetes-cluster/` |
| Scale cluster | Adjust cluster capacity | `templates/cluster-scale/` |
| Upgrade cluster | Change Kubernetes version or associated platform elements | `templates/cluster-upgrade/` |
| Destroy cluster | Decommission a cluster safely | `templates/cluster-destroy/` |
| Namespace request | Create shared-tenancy capacity | `templates/namespace-request/` |
| Add-on management | Enable or disable add-ons | `templates/addon-management/` |

## Product implications

This is not just scaffolding. It is the product contract between platform engineering and application teams.

- Templates are how the platform enforces standards.
- GitOps output is how the platform preserves auditability.
- Backstage is how the platform makes infrastructure discoverable.

## What makes a workflow trustworthy

- Input schema is clear and constrained.
- Generated files reflect cloud and GitOps conventions.
- Operational ownership is obvious after the workflow runs.
- Documentation explains both the happy path and the review path.

## Suggested enhancements over time

1. Add sample request payloads or screenshots for each workflow.
2. Cross-link every workflow to its output repository structure.
3. Capture review expectations for PR-based operations such as upgrades and scale changes.

## Where this shows up in the UI

The `create` route in the Backstage app renames the standard scaffolder experience to **Platform Workflows**, which is the correct product framing for this repository.