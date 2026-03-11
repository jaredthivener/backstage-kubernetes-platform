---
title: Docusaurus and TechDocs
description: How the new docs site relates to the TechDocs already present in the platform.
---

# Docusaurus and TechDocs

This repository now supports two documentation layers on purpose.

## Use Docusaurus for

- product-level onboarding
- architecture and repo maps
- cross-cutting workflow documentation
- GitHub Pages publishing
- entry-point documentation for new developers

## Use TechDocs for

- entity-specific documentation
- template-local implementation detail
- generated or component-owned reference material
- docs that belong inside the Backstage catalog experience

## Decision rule

Ask one question: _Is this documentation about the platform as a whole, or about a specific owned component?_ 

If it is platform-wide, put it here. If it is component-owned, keep it in TechDocs.

## Collaboration guidance

- Keep the Docusaurus site concise and navigable.
- Link out to deeper TechDocs when detail would otherwise clutter a product guide.
- Avoid duplicating long reference sections in both places.

## Pull request expectation

If you change platform navigation, templates, or the GitOps model, update this site in the same PR.