---
title: Add-ons and Day 2 Operations
description: How the repo models add-ons, operational overlays, and controlled change after provisioning.
---

# Add-ons and Day 2 Operations

The repository treats add-ons as first-class operating assets rather than post-install drift.

## Why that matters

Teams usually lose consistency after cluster creation. This repo avoids that by preserving Day 2 change paths in templates and GitOps artifacts.

## Where add-ons appear

- Template output in `templates/kubernetes-cluster/skeleton/addons/`
- Add-on management workflow in `templates/addon-management/`
- GitOps reference structure in `gitops-repo-structure/README.md`

## Current add-on examples in the repo

- `kube-prometheus-stack.yaml`
- `namespace-operator.yaml`
- `network-policies.yaml`
- `vault-config.yaml`

## Documentation expectations

For each add-on, good documentation should answer four questions:

1. Why would a platform team enable it?
2. What repo artifact changes when it is enabled?
3. What cloud, policy, or operational dependencies exist?
4. How should a developer verify that it is working?

## Good next-step docs to add later

- per add-on capability pages
- rollout guardrails
- failure modes and rollback procedures
- ownership boundaries between platform and application teams