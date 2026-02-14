/*
 * Morgan Stanley KaaS Platform - Backend
 *
 * This is the main backend entry point for the KaaS Backstage instance.
 * It configures all plugins needed for Kubernetes as a Service operations.
 */

import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ============================================================================
// Core Plugins
// ============================================================================
backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));

// ============================================================================
// Scaffolder - Template engine for cluster provisioning & Day 2 ops
// ============================================================================
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-notifications'),
);

// ============================================================================
// TechDocs - Documentation
// ============================================================================
backend.add(import('@backstage/plugin-techdocs-backend'));

// ============================================================================
// Authentication - Microsoft Entra ID (Azure AD)
// ============================================================================
backend.add(import('@backstage/plugin-auth-backend'));
// Guest provider for local development
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
// Microsoft Entra ID provider for production SSO
backend.add(import('@backstage/plugin-auth-backend-module-microsoft-provider'));

// ============================================================================
// Catalog - Service catalog with Kubernetes cluster resources
// ============================================================================
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// ============================================================================
// Permissions - RBAC authorization
// ============================================================================
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// ============================================================================
// Search - Full-text search across catalog, techdocs
// ============================================================================
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-pg'));
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// ============================================================================
// Kubernetes - Multi-cluster visibility
// Uncomment when connecting to real clusters with proper kubeconfig
// ============================================================================
// backend.add(import('@backstage/plugin-kubernetes-backend'));

// ============================================================================
// Notifications & Signals - Real-time updates
// ============================================================================
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('@backstage/plugin-signals-backend'));

backend.start();
