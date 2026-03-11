---
title: Monitoring, Cost, and Security
description: How to think about the platform's operational surfaces as a coherent developer experience.
---

# Monitoring, Cost, and Security

The Backstage app exposes monitoring, cost, and security as separate pages, but developers experience them as one operational loop.

## Recommended mental model

- Monitoring tells you whether the platform is healthy.
- Security tells you whether it is safe.
- Cost tells you whether it is sustainable.

## Why this matters for docs

Documentation should not describe these areas as isolated plugin pages. It should show how they support release and runtime decisions.

## Example cross-functional questions developers actually ask

- Can I scale this cluster without blowing through cost targets?
- Does this upgrade change our compliance posture?
- Which dashboards should I check after enabling a new add-on?
- How do I prove a cluster configuration is both observable and policy-compliant?

## Suggested doc pattern for operational features

For every operational feature page, document:

1. Primary user persona
2. Key signals shown in the UI
3. Expected actions a user can take
4. Related workflows or templates
5. Common escalation paths

## Product opportunity

This repo has enough surface area to support richer operational playbooks in future iterations. If you expand this docs site, this section is the right place for runbooks, triage matrices, and signal interpretation guides.