{#- ── DNS suffix mapping (same as cluster-definition.yaml) ────────────── -#}
{%- if values.cloudProvider == "azure" %}
  {%- if values.environment == "dev" %}
    {%- set dnsSuffix = "az-dev.ms.com" %}
  {%- elif values.environment == "qa" %}
    {%- set dnsSuffix = "az-qa.ms.com" %}
  {%- else %}
    {%- set dnsSuffix = "az.ms.com" %}
  {%- endif %}
  {%- set capiProvider = "CAPZ (AKS)" %}
{%- elif values.cloudProvider == "aws" %}
  {%- if values.environment == "dev" %}
    {%- set dnsSuffix = "aws-dev.ms.com" %}
  {%- elif values.environment == "qa" %}
    {%- set dnsSuffix = "aws-qa.ms.com" %}
  {%- else %}
    {%- set dnsSuffix = "aws.ms.com" %}
  {%- endif %}
  {%- set capiProvider = "CAPA (EKS)" %}
{%- elif values.cloudProvider == "gcp" %}
  {%- if values.environment == "dev" %}
    {%- set dnsSuffix = "gcp-dev.ms.com" %}
  {%- elif values.environment == "qa" %}
    {%- set dnsSuffix = "gcp-qa.ms.com" %}
  {%- else %}
    {%- set dnsSuffix = "gcp.ms.com" %}
  {%- endif %}
  {%- set capiProvider = "CAPG (GKE)" %}
{%- endif %}
# Kubernetes Cluster: ${{ values.environment }}-${{ values.clusterName }}

> **GitOps-managed Kubernetes cluster** provisioned via [Backstage](https://backstage.internal.ms.com) and Cluster API.
> All changes to this repository are reconciled automatically by ArgoCD.

---

## Cluster Details

| Property | Value |
|---|---|
| **Cluster Name** | `${{ values.environment }}-${{ values.clusterName }}` |
| **Cloud Provider** | ${{ values.cloudProvider | upper }} ({{ capiProvider }}) |
| **Environment** | ${{ values.environment | upper }} |
| **Region** | `${{ values.region }}` |
| **Kubernetes Version** | `v${{ values.kubernetesVersion }}` |
| **Node Pool Size** | ${{ values.nodePoolSize }} |
| **Autoscaling** | ${{ values.enableAutoScaling | default(true) }} |
| **Owner** | ${{ values.ownerTeam }} |
| **Cost Center** | `${{ values.costCenter | default("UNASSIGNED") }}` |
| **DNS Suffix** | `{{ dnsSuffix }}` |
| **API Server** | `https://api.${{ values.clusterName }}.{{ dnsSuffix }}:6443` |
| **Compliance** | PCI-DSS |

---

## Architecture

```mermaid
graph TB
    subgraph "GitOps Flow"
        GH["GitHub Repository<br/>${{ values.environment }}-${{ values.clusterName }}"]
        ARGO["ArgoCD<br/>Management Cluster"]
        GH -->|"sync"| ARGO
    end

    subgraph "Management Cluster (${{ values.cloudProvider | upper }})"
        ARGO -->|"reconcile"| CAPI["Cluster API Controller<br/>{{ capiProvider }}"]
    end

    subgraph "Workload Cluster"
        CAPI -->|"provisions"| CP["Control Plane<br/>v${{ values.kubernetesVersion }}"]
        CAPI -->|"provisions"| NP["Node Pool<br/>${{ values.nodePoolSize }}"]

        CP --- NP

{%- if values.enableMonitoring %}
        NP --- MON["Prometheus Stack"]
{%- endif %}
{%- if values.enableIngress %}
        NP --- ING["NGINX Ingress"]
{%- endif %}
{%- if values.enableServiceMesh %}
        NP --- MESH["Istio Service Mesh"]
{%- endif %}
{%- if values.enableVaultIntegration %}
        NP --- VAULT["Vault Agent"]
{%- endif %}
{%- if values.enableNetworkPolicies %}
        NP --- NETPOL["Network Policies<br/>PCI-DSS"]
{%- endif %}
    end

    subgraph "Observability"
{%- if values.enableMonitoring %}
        MON -->|"remote-write"| PROM["Central Prometheus"]
{%- endif %}
        GRAFANA["Grafana"]
        KIBANA["Kibana"]
    end

    subgraph "Security"
{%- if values.enableVaultIntegration %}
        VAULT -->|"secrets"| HV["HashiCorp Vault"]
{%- endif %}
        AAD["Azure AD / Entra ID"]
    end
```

---

## Getting Started

### Prerequisites

- `kubectl` v1.28+
- Access granted via Azure AD / Entra ID group membership
- VPN connected to Morgan Stanley network

### Obtain Kubeconfig

{%- if values.cloudProvider == "azure" %}

```bash
# Azure (AKS)
az login --tenant <MS_TENANT_ID>
az aks get-credentials \
  --resource-group rg-${{ values.environment }}-${{ values.clusterName }} \
  --name ${{ values.environment }}-${{ values.clusterName }} \
  --overwrite-existing
```

{%- elif values.cloudProvider == "aws" %}

```bash
# AWS (EKS)
aws sso login --profile ms-${{ values.environment }}
aws eks update-kubeconfig \
  --name ${{ values.environment }}-${{ values.clusterName }} \
  --region ${{ values.region }} \
  --alias ${{ values.environment }}-${{ values.clusterName }}
```

{%- elif values.cloudProvider == "gcp" %}

```bash
# GCP (GKE)
gcloud auth login
gcloud container clusters get-credentials ${{ values.environment }}-${{ values.clusterName }} \
  --region ${{ values.region }} \
  --project ms-${{ values.environment }}-platform
```

{%- endif %}

### Verify Connectivity

```bash
kubectl cluster-info
kubectl get nodes
```

---

## Day 2 Operations

| Operation | Link |
|---|---|
| **Scale Cluster** | [Backstage Template](https://backstage.internal.ms.com/create/templates/default/cluster-scale) |
| **Upgrade Kubernetes** | [Backstage Template](https://backstage.internal.ms.com/create/templates/default/cluster-upgrade) |
| **Manage Add-ons** | [Backstage Template](https://backstage.internal.ms.com/create/templates/default/addon-management) |
| **Request Namespace** | [Backstage Template](https://backstage.internal.ms.com/create/templates/default/namespace-request) |
| **Destroy Cluster** | [Backstage Template](https://backstage.internal.ms.com/create/templates/default/cluster-destroy) |

> **⚠️ Do not modify cluster resources manually.** All changes must go through GitOps (this repository) or Backstage self-service templates.

---

## Monitoring & Observability

| Tool | URL |
|---|---|
| **Grafana Dashboard** | [Cluster Overview](https://grafana.internal.ms.com/d/cluster-overview?var-cluster=${{ values.environment }}-${{ values.clusterName }}) |
| **Prometheus** | [Metrics](https://prometheus.internal.ms.com/graph?g0.expr=up{cluster="${{ values.environment }}-${{ values.clusterName }}"}) |
| **Kibana Logs** | [Cluster Logs](https://kibana.internal.ms.com/app/discover?cluster=${{ values.environment }}-${{ values.clusterName }}) |
| **ArgoCD** | [Application](https://argocd.internal.ms.com/applications/cluster-${{ values.environment }}-${{ values.clusterName }}) |
| **PagerDuty** | [Service](https://morganstanley.pagerduty.com/services/${{ values.environment }}-${{ values.clusterName }}) |

### Key Alerts

| Alert | Severity | Description |
|---|---|---|
| `KubeNodeNotReady` | Critical | One or more nodes not in Ready state |
| `KubePodCrashLooping` | Warning | Pod restarting repeatedly |
| `ClusterAutoscalerUnschedulable` | Warning | Pods pending due to insufficient resources |
| `CertificateExpiringSoon` | Critical | TLS certificate expiring within 30 days |
| `VaultSealedAlert` | Critical | Vault agent unable to access secrets |

---

## Compliance

### PCI-DSS Controls

This cluster enforces the following PCI-DSS controls:

| Control | Implementation |
|---|---|
| **Network Segmentation** | Default-deny NetworkPolicies; namespace isolation |
| **Encryption in Transit** | mTLS via {% if values.enableServiceMesh %}Istio{% else %}Kubernetes internal{% endif %}; TLS ingress termination |
| **Encryption at Rest** | CSP-managed encryption for etcd and persistent volumes |
| **Access Control** | Azure AD / Entra ID RBAC; no static credentials |
| **Audit Logging** | Kubernetes audit logs shipped to SIEM |
| **Vulnerability Scanning** | Trivy admission controller; image signing verification |
| **Secrets Management** | {% if values.enableVaultIntegration %}HashiCorp Vault (no plain-text secrets in manifests){% else %}Kubernetes Secrets (encrypted at rest){% endif %} |

### Automated Policy Enforcement

- **OPA/Conftest** policies run on every PR and push
- **Kyverno** cluster policies enforce runtime compliance
- **Falco** monitors runtime security anomalies

---

## Repository Structure

```
.
├── .github/
│   └── workflows/
│       ├── cluster-provision.yaml     # Provision workflow (push to main)
│       ├── cluster-validate.yaml      # PR validation workflow
│       └── cluster-drift-detection.yaml # Drift detection (every 6h)
├── addons/
│   ├── kube-prometheus-stack.yaml     # Monitoring
│   ├── namespace-operator.yaml        # RBAC operator
│   ├── network-policies.yaml          # PCI-DSS network policies
│   └── vault-config.yaml             # Vault integration
├── argocd-app.yaml                    # ArgoCD Application manifest
├── catalog-info.yaml                  # Backstage catalog registration
├── cluster-definition.yaml            # CAPI cluster definition
└── README.md                          # This file
```

---

## Ownership & Support

| Role | Team |
|---|---|
| **Cluster Owner** | ${{ values.ownerTeam }} |
| **Platform Team** | platform-engineering |
| **On-Call** | [PagerDuty Rotation](https://morganstanley.pagerduty.com) |

### Support Channels

- **Slack**: `#platform-kubernetes-support`
- **Email**: platform-engineering@morganstanley.com
- **Runbook**: [Platform Kubernetes Runbook](https://docs.internal.ms.com/platform/kubernetes/runbook)
- **Backstage**: [Cluster Entity](https://backstage.internal.ms.com/catalog/default/resource/${{ values.environment }}-${{ values.clusterName }})

---

*This repository was generated by the [Kubernetes Cluster Provisioner](https://backstage.internal.ms.com/create/templates/default/kubernetes-cluster-provisioner) Backstage template.*
