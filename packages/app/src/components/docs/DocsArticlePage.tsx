import { useEffect, useMemo, useState } from 'react';
import {
  makeStyles,
  Box,
  Typography,
  Chip,
  Paper,
  Grid,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  Link as MuiLink,
} from '@material-ui/core';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import LinkIcon from '@material-ui/icons/Link';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ContentCopyIcon from '@material-ui/icons/FileCopyOutlined';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Header, Page, Content } from '@backstage/core-components';
import { Link, useParams } from 'react-router-dom';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';

const useStyles = makeStyles(theme => ({
  hero: {
    borderRadius: 16,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    color: '#fff',
    background: 'linear-gradient(135deg, #1A237E 0%, #283593 40%, #3949AB 70%, #E8EAF6 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  heroArt: {
    position: 'absolute',
    right: theme.spacing(6),
    bottom: theme.spacing(1),
    height: 170,
    width: 'auto',
    opacity: 1,
    pointerEvents: 'none',
    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.22))',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
  },
  section: {
    borderRadius: 12,
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    background: `linear-gradient(120deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  sectionIndex: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 700,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    flexShrink: 0,
  },
  codeBlock: {
    background: '#0f172a',
    color: '#e2e8f0',
    borderRadius: 10,
    padding: theme.spacing(2),
    overflowX: 'auto',
    fontSize: '0.82rem',
  },
  metaRow: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginTop: theme.spacing(1.5),
  },
  articleLayout: {
    alignItems: 'flex-start',
  },
  sidebarCard: {
    borderRadius: 12,
    position: 'sticky',
    top: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  tocList: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  tocItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  tocLink: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    fontSize: '0.82rem',
    borderRadius: 6,
    padding: theme.spacing(0.5, 1),
    display: 'inline-flex',
    width: '100%',
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.action.hover,
      textDecoration: 'none',
    },
  },
  tocLinkActive: {
    color: theme.palette.primary.main,
    fontWeight: 700,
    backgroundColor: theme.palette.action.hover,
  },
  bulletLine: {
    marginBottom: theme.spacing(1.2),
    lineHeight: 1.6,
  },
  referencesList: {
    margin: 0,
    paddingLeft: theme.spacing(2),
  },
  referenceItem: {
    marginBottom: theme.spacing(1),
  },
  breadcrumbWrap: {
    marginBottom: theme.spacing(1.5),
  },
  quickFacts: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  factLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: theme.palette.text.secondary,
  },
  factValue: {
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  codeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.75),
  },
  codeLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: theme.palette.text.secondary,
    fontWeight: 700,
  },
}));

type Article = {
  title: string;
  category: string;
  readTime: string;
  updated: string;
  summary: string;
  sections: { heading: string; body: string[]; code?: string }[];
  references: { label: string; url: string }[];
};

const articleMap: Record<string, Article> = {
  'cilium-networking': {
    title: 'Multi-cluster Networking with Cilium',
    category: 'Networking',
    readTime: '16 min',
    updated: 'Today',
    summary:
      'Design and operate secure east-west traffic across clusters with identity-aware policy, segmented egress, and auditable telemetry.',
    sections: [
      {
        heading: 'Target Architecture',
        body: [
          'Use hub-and-spoke multi-cluster topology with explicit trust boundaries between environments.',
          'Prefer identity and label-based policy over static CIDR allow-lists to reduce drift and policy sprawl.',
          'Treat control-plane and pod egress as separate security domains with independent policy controls.',
        ],
      },
      {
        heading: 'Cloud-Specific Guidance (AWS, Azure, GCP)',
        body: [
          'AWS EKS: combine network policy with security groups for pods and private endpoint patterns for API access.',
          'Azure AKS: align with zero-trust microsegmentation and advanced policies (L7 and FQDN filtering where required).',
          'GCP GKE: prefer DNS-based control-plane access, private nodes, and network-policy logging to validate rule intent.',
          'Across all clouds: enforce default-deny at namespace level, then add explicit service-to-service allows.',
        ],
        code: `apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: allow-checkout-to-payments-only
  namespace: checkout
spec:
  endpointSelector:
    matchLabels:
      app: checkout
  egress:
    - toEndpoints:
        - matchLabels:
            app: payments`,
      },
      {
        heading: 'Rollout Checklist',
        body: [
          'Start in audit/observe mode and baseline flow logs for at least one release cycle.',
          'Promote to enforce mode per namespace, starting with low-criticality services.',
          'Require policy tests in CI to validate allowed and denied paths before deployment.',
          'Track deny counters and failed connection retries as guardrail metrics during rollout.',
        ],
      },
    ],
    references: [
      { label: 'AKS network policy best practices', url: 'https://learn.microsoft.com/azure/aks/network-policy-best-practices' },
      { label: 'AKS architecture best practices (security)', url: 'https://learn.microsoft.com/azure/well-architected/service-guides/azure-kubernetes-service#security' },
      { label: 'GKE harden your cluster', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster' },
      { label: 'EKS best practices (network security)', url: 'https://docs.aws.amazon.com/eks/latest/best-practices/network-security.html' },
    ],
  },
  'cost-optimization': {
    title: 'Cost Optimization: Right-sizing Node Pools',
    category: 'Operations',
    readTime: '15 min',
    updated: 'Today',
    summary:
      'Reduce waste by combining FinOps telemetry, right-sizing, and autoscaling controls across providers.',
    sections: [
      {
        heading: 'FinOps Baseline',
        body: [
          'Create shared ownership between platform, finance, and application teams for monthly cost reviews.',
          'Track waste metrics by namespace: idle CPU, idle memory, over-request ratio, and non-production runtime.',
          'Set budget alerts and anomaly detection before optimization to measure impact and avoid regressions.',
        ],
      },
      {
        heading: 'Cloud-Specific Optimization Tactics',
        body: [
          'AWS EKS: run Cluster Autoscaler and HPA together, right-size requests, and use Spot for interruption-tolerant workloads.',
          'Azure AKS: enable AKS Cost Analysis, use reservations/savings plans where predictable, and adopt spot node pools for elastic tiers.',
          'GCP GKE: use Autopilot where fit, adopt Spot Pods for batch, and monitor recommender outputs for rightsizing actions.',
          'Across all clouds: separate system, latency-critical, and batch node pools to avoid mixed-priority overprovisioning.',
        ],
      },
      {
        heading: 'Execution Plan (30/60/90 Days)',
        body: [
          '30 days: instrument cost by cluster/namespace/workload and define optimization SLOs.',
          '60 days: enforce requests/limits policies and migrate eligible jobs to spot/preemptible capacity.',
          '90 days: tune autoscaler thresholds and commit predictable baseline capacity to discounted plans.',
        ],
      },
    ],
    references: [
      { label: 'AKS cost optimization best practices', url: 'https://learn.microsoft.com/azure/aks/best-practices-cost' },
      { label: 'AKS architecture cost optimization', url: 'https://learn.microsoft.com/azure/well-architected/service-guides/azure-kubernetes-service#cost-optimization' },
      { label: 'GKE cost-effective Kubernetes architecture', url: 'https://docs.cloud.google.com/architecture/best-practices-for-running-cost-effective-kubernetes-applications-on-gke' },
      { label: 'Cost optimization for Kubernetes on AWS', url: 'https://aws.amazon.com/blogs/containers/cost-optimization-for-kubernetes-on-aws/' },
    ],
  },
  'migration-eks-aks': {
    title: 'Migrating from EKS to AKS',
    category: 'Migration',
    readTime: '20 min',
    updated: 'Today',
    summary:
      'Practical migration blueprint from EKS to AKS with identity, networking, storage, and rollout guardrails.',
    sections: [
      {
        heading: 'Discovery and Mapping',
        body: [
          'Inventory EKS dependencies: IAM roles for service accounts, ingress model, storage classes, and observability stack.',
          'Define AKS target mappings early: Microsoft Entra Workload ID, Key Vault CSI, Azure CNI strategy, and logging/metrics model.',
          'Classify workloads by migration risk (stateless first, data-plane critical later).',
        ],
      },
      {
        heading: 'Migration Waves',
        body: [
          'Wave 1: platform services and internal stateless apps; validate baseline SLOs.',
          'Wave 2: stateful services after storage and backup/restore rehearsals.',
          'Wave 3: regulated and high-criticality services with dual-run and controlled traffic shifts.',
          'Use canary or weighted DNS cutovers with rollback criteria defined before each move.',
        ],
      },
      {
        heading: 'Cutover Readiness Criteria',
        body: [
          'Security controls equivalent or stronger than source cluster (identity, secrets, network segmentation).',
          'Observability parity: golden signals, audit logs, and on-call runbooks validated in AKS.',
          'Performance and cost within agreed tolerance bands for two consecutive release windows.',
        ],
      },
    ],
    references: [
      { label: 'EKS to AKS architecture guidance', url: 'https://learn.microsoft.com/azure/architecture/aws-professional/eks-to-aks/' },
      { label: 'AKS service guide (well-architected)', url: 'https://learn.microsoft.com/azure/well-architected/service-guides/azure-kubernetes-service' },
      { label: 'GKE migration and workload transition references', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/archive/migrate-workloads' },
      { label: 'Amazon EKS best practices', url: 'https://docs.aws.amazon.com/eks/latest/best-practices/' },
    ],
  },
  'pci-dss': {
    title: 'PCI-DSS Compliance for Kubernetes',
    category: 'Security',
    readTime: '18 min',
    updated: 'Today',
    summary:
      'Control-oriented blueprint for PCI-DSS alignment: segmentation, identity, logging, and evidence automation.',
    sections: [
      {
        heading: 'Control Domains to Implement',
        body: [
          'Network segmentation: enforce default-deny and explicit service allow-lists for cardholder data paths.',
          'Identity and access: least privilege for humans and workloads; no shared credentials.',
          'Logging and evidence: immutable audit history with retention and searchability for investigations.',
          'Vulnerability management: image and runtime controls integrated in build and deploy pipelines.',
        ],
      },
      {
        heading: 'Cloud Implementation Notes',
        body: [
          'AWS EKS: combine IAM + RBAC controls and enforce node/workload isolation for scoped access.',
          'Azure AKS: use Defender for Containers, Key Vault integrations, and policy enforcement at scale.',
          'GCP GKE: use Workload Identity Federation, Policy Controller, and security posture monitoring.',
        ],
      },
      {
        heading: 'Evidence Package Checklist',
        body: [
          'Policy manifests and exemptions with approver trail.',
          'Monthly access review exports for platform and namespace roles.',
          'Audit log retention policy, incident timelines, and remediation records.',
        ],
      },
    ],
    references: [
      { label: 'AKS architecture best practices (security)', url: 'https://learn.microsoft.com/azure/well-architected/service-guides/azure-kubernetes-service#security' },
      { label: 'GKE hardening best practices', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster' },
      { label: 'Amazon EKS security best practices', url: 'https://docs.aws.amazon.com/eks/latest/best-practices/security.html' },
    ],
  },
  'canary-deployments': {
    title: 'Canary Deployments with ArgoCD Rollouts',
    category: 'GitOps',
    readTime: '14 min',
    updated: 'Today',
    summary:
      'Progressive delivery pattern using objective SLO checks, automated promotion, and safe rollback criteria.',
    sections: [
      {
        heading: 'Progressive Delivery Strategy',
        body: [
          'Use fixed rollout steps (for example 5% → 25% → 50% → 100%) with pause windows per stage.',
          'Define promotion gates on error rate, latency percentile, and saturation thresholds.',
          'Require automatic rollback when metrics breach predefined guardrails for two consecutive windows.',
        ],
      },
      {
        heading: 'Metrics Backends by Cloud',
        body: [
          'AWS: integrate managed Prometheus/Grafana for rollout analysis queries.',
          'Azure: use managed Prometheus and Azure Monitor dashboards for promotion checks.',
          'GCP: use Cloud Monitoring or managed Prometheus with stable service-level queries.',
        ],
        code: `apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: checkout
spec:
  strategy:
    canary:
      steps:
      - setWeight: 5
      - pause: { duration: 5m }
      - setWeight: 25
      - pause: { duration: 10m }`,
      },
      {
        heading: 'Operational Guardrails',
        body: [
          'Pin rollback ownership in on-call rotations and codify response playbooks.',
          'Test analysis templates in pre-production with synthetic failures every sprint.',
        ],
      },
    ],
    references: [
      { label: 'AKS monitoring best practices (cost and telemetry)', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/best-practices-containers#cost-optimization' },
      { label: 'Enable AKS managed Prometheus and Grafana', url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/containers/kubernetes-monitoring-enable#enable-prometheus-and-grafana' },
      { label: 'GKE observability', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/observability' },
      { label: 'AWS monitoring Amazon EKS with managed Prometheus/Grafana', url: 'https://aws.amazon.com/blogs/containers/' },
    ],
  },
  'gpu-pools': {
    title: 'GPU Node Pools for ML Workloads',
    category: 'AI/ML',
    readTime: '15 min',
    updated: 'Today',
    summary:
      'Capacity and scheduling guidance for efficient GPU usage across inference and training workloads.',
    sections: [
      {
        heading: 'Design for Mixed GPU Workloads',
        body: [
          'Separate inference and training pools to avoid contention and noisy-neighbor latency impact.',
          'Use taints/tolerations, node affinity, and priority classes to guarantee critical inference capacity.',
          'Enforce per-team quotas and preemption policies for shared accelerator fleets.',
        ],
      },
      {
        heading: 'Cloud-Specific Patterns',
        body: [
          'AWS EKS: isolate GPU node groups and reserve on-demand baseline with optional spot expansion for batch.',
          'Azure AKS: use AI toolchain/operator workflows and dedicated pools for model serving vs training jobs.',
          'GCP GKE: align accelerator scheduling with node auto-provisioning and managed observability for GPU saturation.',
        ],
      },
      {
        heading: 'Efficiency Checklist',
        body: [
          'Track GPU utilization, memory utilization, queue wait time, and cost per successful inference/training job.',
          'Scale to zero non-critical pools outside business windows where latency SLOs allow.',
        ],
      },
    ],
    references: [
      { label: 'AKS AI toolchain operator', url: 'https://learn.microsoft.com/en-us/azure/aks/ai-toolchain-operator' },
      { label: 'GKE AI/ML infrastructure guidance', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/integrations/ai-infra' },
      { label: 'Amazon EKS documentation', url: 'https://docs.aws.amazon.com/eks/' },
    ],
  },
  'etcd-troubleshooting': {
    title: 'Troubleshooting etcd Performance',
    category: 'Operations',
    readTime: '16 min',
    updated: '2 weeks ago',
    summary:
      'Structured runbook for etcd latency incidents, including detection, containment, and prevention actions.',
    sections: [
      {
        heading: 'Symptoms and First Response',
        body: [
          'Symptoms: API server timeouts, elevated admission latency, and control-plane instability during write bursts.',
          'Immediately reduce high-churn write sources (noisy controllers/webhooks) and capture control-plane metrics.',
          'Correlate request latency spikes with storage IOPS and leader-election churn.',
        ],
      },
      {
        heading: 'Cloud Platform Notes',
        body: [
          'Managed control planes (EKS/AKS/GKE) abstract direct etcd operations, so focus on workload pressure, API usage, and webhook behavior.',
          'Use provider-native observability and audit streams to identify abusive clients and high-cardinality object churn.',
          'Tune workload behavior (batching, backoff, watch patterns) rather than relying on direct etcd flags in managed environments.',
        ],
      },
      {
        heading: 'Prevention',
        body: [
          'Define SLOs for API server latency and alert on sustained percentile degradation.',
          'Add policy checks for webhook timeout budgets and unbounded reconciliation loops.',
        ],
      },
    ],
    references: [
      { label: 'GKE cluster management and upgrades', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/how-to/managing-clusters' },
      { label: 'AKS monitoring and logs guidance', url: 'https://learn.microsoft.com/azure/aks/monitor-aks' },
      { label: 'Amazon EKS best practices', url: 'https://docs.aws.amazon.com/eks/latest/best-practices/' },
    ],
  },
};

export const DocsArticlePage = () => {
  const classes = useStyles();
  const { articleId = '' } = useParams<{ articleId: string }>();
  const article = articleMap[articleId];
  const sectionAnchor = (heading: string) =>
    heading
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  const sectionsWithIds = useMemo(
    () => article?.sections.map(section => ({ ...section, id: sectionAnchor(section.heading) })) ?? [],
    [article],
  );
  const [activeSectionId, setActiveSectionId] = useState<string>(sectionsWithIds[0]?.id ?? '');
  const [copiedCodeId, setCopiedCodeId] = useState<string>('');

  useEffect(() => {
    setActiveSectionId(sectionsWithIds[0]?.id ?? '');
  }, [articleId, sectionsWithIds]);

  useEffect(() => {
    if (!sectionsWithIds.length) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target?.id) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 1],
      },
    );

    sectionsWithIds.forEach(section => {
      const node = document.getElementById(section.id);
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [sectionsWithIds]);

  const handleCopyCode = async (code: string, sectionId: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      }
      setCopiedCodeId(sectionId);
      window.setTimeout(() => setCopiedCodeId(''), 1800);
    } catch {
      setCopiedCodeId('');
    }
  };

  const handleTocClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const node = document.getElementById(sectionId);
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(sectionId);
    }
  };

  if (!article) {
    return (
      <Page themeId="documentation">
        <Header
          title="Documentation"
          subtitle={<HeaderBannerLogos layout="docs" text="Article not found" />}
        />
        <Content>
          <Typography variant="h6" gutterBottom>
            Article not found
          </Typography>
          <Button
            component={Link}
            to="/docs"
            color="primary"
            startIcon={<ArrowBackIcon />}
          >
            Back to Docs
          </Button>
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="documentation">
      <Header
        title={article.title}
        subtitle={<HeaderBannerLogos layout="docs" text="Demo documentation article" />}
      />
      <Content>
        <Box className={classes.breadcrumbWrap}>
          <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />} aria-label="breadcrumb">
            <MuiLink component={Link} color="inherit" to="/docs" style={{ fontSize: '0.8rem' }}>
              Documentation
            </MuiLink>
            <Typography color="textPrimary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
              {article.title}
            </Typography>
          </Breadcrumbs>
        </Box>

        <Paper className={classes.hero} elevation={0}>
          <img src="/logos/docs-banner-hiclipart-transparent.png" alt="" className={classes.heroArt} />
          <Box className={classes.heroContent}>
            <Box display="flex" alignItems="center" gridGap={8}>
              <MenuBookIcon />
              <Typography variant="h6" style={{ fontWeight: 700 }}>
                {article.title}
              </Typography>
            </Box>
            <Typography variant="body2" style={{ opacity: 0.9, marginTop: 8 }}>
              {article.summary}
            </Typography>
            <Box className={classes.metaRow}>
              <Chip size="small" label={article.category} />
              <Chip size="small" label={article.readTime} />
              <Chip size="small" label={`Updated ${article.updated}`} />
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={2} className={classes.articleLayout}>
          <Grid item xs={12} md={8}>
            {sectionsWithIds.map((section, index) => (
              <Paper className={classes.section} key={section.heading} id={section.id}>
                <Box p={2.5}>
                  <Box className={classes.sectionHeader}>
                    <Box className={classes.sectionIndex}>{index + 1}</Box>
                    <Typography variant="h6" style={{ fontWeight: 700 }}>
                      {section.heading}
                    </Typography>
                  </Box>
                  <Divider style={{ margin: '10px 0 14px 0' }} />
                  {section.body.map(line => (
                    <Typography key={line} variant="body2" className={classes.bulletLine}>
                      {line}
                    </Typography>
                  ))}
                  {section.code && (
                    <>
                      <Box className={classes.codeHeader}>
                        <Typography className={classes.codeLabel}>Example</Typography>
                        <Button
                          size="small"
                          color="primary"
                          startIcon={copiedCodeId === section.id ? <CheckCircleOutlineIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                          onClick={() => handleCopyCode(section.code!, section.id)}
                        >
                          {copiedCodeId === section.id ? 'Copied' : 'Copy'}
                        </Button>
                      </Box>
                      <pre className={classes.codeBlock}>{section.code}</pre>
                    </>
                  )}
                </Box>
              </Paper>
            ))}

            <Paper className={classes.section}>
              <Box p={2.5}>
                <Box className={classes.sectionHeader}>
                  <LinkIcon fontSize="small" color="primary" />
                  <Typography variant="h6" style={{ fontWeight: 700 }}>
                    References
                  </Typography>
                </Box>
                <Divider style={{ margin: '10px 0 14px 0' }} />
                <ul className={classes.referencesList}>
                  {article.references.map(ref => (
                    <li key={ref.url} className={classes.referenceItem}>
                      <MuiLink href={ref.url} target="_blank" rel="noreferrer" color="primary">
                        {ref.label}
                      </MuiLink>
                    </li>
                  ))}
                </ul>
              </Box>
            </Paper>

            <Box mt={2}>
              <Button
                component={Link}
                to="/docs"
                color="primary"
                startIcon={<ArrowBackIcon />}
              >
                Back to Docs
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className={classes.sidebarCard}>
              <Box p={2.5}>
                <Box className={classes.sectionHeader} mb={1}>
                  <DescriptionOutlinedIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
                    On this page
                  </Typography>
                </Box>
                <List disablePadding className={classes.tocList}>
                  {sectionsWithIds.map(section => (
                    <ListItem key={section.heading} className={classes.tocItem} disableGutters>
                      <ListItemText
                        primary={
                          <a
                            href={`#${section.id}`}
                            className={`${classes.tocLink} ${activeSectionId === section.id ? classes.tocLinkActive : ''}`}
                            onClick={event => handleTocClick(event, section.id)}
                          >
                            {section.heading}
                          </a>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider style={{ margin: '12px 0' }} />

                <Box className={classes.quickFacts}>
                  <Box>
                    <Typography className={classes.factLabel}>Category</Typography>
                    <Typography className={classes.factValue}>{article.category}</Typography>
                  </Box>
                  <Box>
                    <Typography className={classes.factLabel}>Read time</Typography>
                    <Typography className={classes.factValue}>{article.readTime}</Typography>
                  </Box>
                  <Box>
                    <Typography className={classes.factLabel}>Updated</Typography>
                    <Typography className={classes.factValue}>{article.updated}</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
