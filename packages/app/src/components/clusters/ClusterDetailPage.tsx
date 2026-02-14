import { useState, useEffect } from 'react';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  makeStyles,
  Box,
  Tabs,
  Tab,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Avatar,
  Tooltip,
} from '@material-ui/core';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { useParams, Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import SecurityIcon from '@material-ui/icons/Security';
import SettingsIcon from '@material-ui/icons/Settings';
import MemoryIcon from '@material-ui/icons/Memory';
import StorageIcon from '@material-ui/icons/Storage';
import UpdateIcon from '@material-ui/icons/Update';
import DnsIcon from '@material-ui/icons/Dns';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import InfoIcon from '@material-ui/icons/Info';
import BugReportIcon from '@material-ui/icons/BugReport';
import SpeedIcon from '@material-ui/icons/Speed';
import ScheduleIcon from '@material-ui/icons/Schedule';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useStyles = makeStyles(theme => ({
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    marginBottom: theme.spacing(2),
    fontSize: '0.9rem',
    '&:hover': { color: theme.palette.primary.main },
  },
  tabBar: {
    marginBottom: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRadius: 10,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  tabItem: {
    minHeight: 46,
    fontWeight: 600,
    textTransform: 'none' as const,
    fontSize: '0.82rem',
    letterSpacing: 0.2,
  },
  metricCard: {
    textAlign: 'center' as const,
    height: '100%',
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  metricLabel: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginTop: 4,
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  healthDot: {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 6,
  },
  gaugeContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  nodeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 0',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
  },
  severityChip: {
    fontWeight: 600,
    fontSize: '0.7rem',
    minWidth: 70,
  },
  costBar: {
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  insightCard: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing(1),
  },
  cspAvatar: {
    width: 36,
    height: 36,
    fontSize: '0.7rem',
    fontWeight: 700,
  },
  azureAvatar: { backgroundColor: '#0078D4' },
  awsAvatar: { backgroundColor: '#FF9900', color: '#232F3E' },
  gcpAvatar: { backgroundColor: '#34A853' },
  alertRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 0',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
  },
  gitopsTimelineItem: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
    borderRadius: '0 4px 4px 0',
  },
  gitopsMiniCard: {
    height: '100%',
    border: `1px solid ${theme.palette.divider}`,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
  },
}));

// ---------------------------------------------------------------------------
// SVG Gauge Component
// ---------------------------------------------------------------------------
const GaugeChart = ({ value, label, size = 120, color }: { value: number; label: string; size?: number; color?: string }) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (value / 100) * circumference;
  const gaugeColor = color || (value > 80 ? '#F44336' : value > 60 ? '#FF9800' : '#4CAF50');

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e0e0e0" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={gaugeColor} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fontSize="20" fontWeight="700" fill={gaugeColor}>
          {value}%
        </text>
        <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fontSize="10" fill="#999">
          {label}
        </text>
      </svg>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------
const Sparkline = ({ data, color, height = 30, width = 120 }: { data: number[]; color: string; height?: number; width?: number }) => {
  const max = Math.max(...data);
  const barW = width / data.length - 1;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((v, i) => {
        const h = (v / max) * height;
        return (
          <rect
            key={i}
            x={i * (barW + 1)}
            y={height - h}
            width={barW}
            height={h}
            fill={color}
            opacity={0.7}
            rx={1}
          />
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------
interface ClusterDetail {
  cpu: number; memory: number; pods: number; podCapacity: number; nodeCount: number;
  networkIn: number; networkOut: number; apiLatency: number; etcdLatency: number;
  securityScore: number; monthlyCost: number; costTrend: number; dailyCostHistory: number[];
  cpuHistory: number[]; memHistory: number[]; podHistory: number[];
  vulnerabilities: { severity: string; id: string; title: string; namespace: string; source: string; status: string; age: string }[];
  complianceChecks: { name: string; status: string; details: string }[];
  costByNamespace: { namespace: string; cost: number; percentage: number }[];
  nodes: { name: string; status: string; cpu: number; memory: number; pods: number; role: string }[];
  components: { name: string; status: string; latency: string }[];
  alerts: { severity: string; message: string; time: string; source: string }[];
  events: { type: string; message: string; time: string; source: string }[];
  addons: string[];
  insights: { type: string; title: string; description: string; priority: string }[];
}

const clusterDetailsData: Record<string, ClusterDetail> = {
  'prod-trading-aks': {
    cpu: 72, memory: 68, pods: 156, podCapacity: 220, nodeCount: 12,
    networkIn: 2.4, networkOut: 1.8, apiLatency: 12, etcdLatency: 4.2,
    securityScore: 92, monthlyCost: 8420, costTrend: 3.2,
    dailyCostHistory: [265, 278, 290, 275, 285, 292, 280, 288, 295, 270, 282, 290, 276, 284],
    cpuHistory: [65, 68, 72, 70, 75, 73, 71, 69, 74, 72, 68, 70, 73, 72],
    memHistory: [62, 64, 68, 66, 70, 69, 67, 65, 68, 67, 66, 68, 69, 68],
    podHistory: [140, 142, 148, 145, 152, 155, 150, 148, 154, 156, 152, 150, 153, 156],
    vulnerabilities: [
      { severity: 'HIGH', id: 'CVE-2024-6387', title: 'OpenSSH RegreSSHion RCE', namespace: 'trading-engine', source: 'Trivy', status: 'In Progress', age: '3d' },
      { severity: 'MEDIUM', id: 'CVE-2024-3094', title: 'XZ Utils backdoor detection', namespace: 'kube-system', source: 'Trivy', status: 'Mitigated', age: '14d' },
      { severity: 'LOW', id: 'FALCO-2024-001', title: 'Unexpected outbound connection', namespace: 'monitoring', source: 'Falco', status: 'Open', age: '2d' },
    ],
    complianceChecks: [
      { name: 'CIS Kubernetes Benchmark', status: 'pass', details: '92/97 checks passed' },
      { name: 'Pod Security Standards', status: 'pass', details: 'Restricted profile enforced' },
      { name: 'Network Policy Coverage', status: 'pass', details: '100% namespaces covered' },
      { name: 'Image Vulnerability Scanning', status: 'pass', details: 'All images scanned, no critical' },
      { name: 'RBAC Least Privilege', status: 'pass', details: 'No cluster-admin bindings for workloads' },
      { name: 'Secret Encryption at Rest', status: 'pass', details: 'etcd encryption enabled (AES-256)' },
      { name: 'PCI-DSS Compliance', status: 'pass', details: 'All PCI controls satisfied' },
    ],
    costByNamespace: [
      { namespace: 'trading-engine', cost: 3200, percentage: 38 },
      { namespace: 'market-data', cost: 2100, percentage: 25 },
      { namespace: 'order-mgmt', cost: 1500, percentage: 18 },
      { namespace: 'monitoring', cost: 840, percentage: 10 },
      { namespace: 'kube-system', cost: 420, percentage: 5 },
      { namespace: 'other', cost: 360, percentage: 4 },
    ],
    nodes: [
      { name: 'aks-nodepool1-vm000000', status: 'Ready', cpu: 78, memory: 72, pods: 18, role: 'worker' },
      { name: 'aks-nodepool1-vm000001', status: 'Ready', cpu: 65, memory: 60, pods: 14, role: 'worker' },
      { name: 'aks-nodepool1-vm000002', status: 'Ready', cpu: 82, memory: 75, pods: 16, role: 'worker' },
      { name: 'aks-nodepool1-vm000003', status: 'Ready', cpu: 55, memory: 48, pods: 12, role: 'worker' },
      { name: 'aks-nodepool1-vm000004', status: 'Ready', cpu: 70, memory: 68, pods: 15, role: 'worker' },
      { name: 'aks-system-vm000000', status: 'Ready', cpu: 45, memory: 52, pods: 22, role: 'system' },
    ],
    components: [
      { name: 'API Server', status: 'Healthy', latency: '8ms' },
      { name: 'etcd', status: 'Healthy', latency: '4ms' },
      { name: 'Scheduler', status: 'Healthy', latency: '2ms' },
      { name: 'Controller Manager', status: 'Healthy', latency: '3ms' },
      { name: 'CoreDNS', status: 'Healthy', latency: '1ms' },
      { name: 'Ingress Controller', status: 'Healthy', latency: '5ms' },
    ],
    alerts: [
      { severity: 'warning', message: 'Node aks-nodepool1-vm000002 CPU > 80%', time: '15 min ago', source: 'Prometheus' },
      { severity: 'info', message: 'Horizontal Pod Autoscaler scaled trading-engine to 8 replicas', time: '1h ago', source: 'K8s Events' },
    ],
    events: [
      { type: 'deployment', message: 'trading-engine v2.14.3 deployed successfully', time: '2h ago', source: 'ArgoCD' },
      { type: 'config', message: 'Network policy updated for market-data namespace', time: '5h ago', source: 'GitOps' },
      { type: 'security', message: 'Vault secrets rotated for trading-engine', time: '12h ago', source: 'Vault' },
      { type: 'scaling', message: 'Node pool scaled from 10 to 12 nodes', time: '1d ago', source: 'Cluster Autoscaler' },
      { type: 'upgrade', message: 'CoreDNS upgraded to v1.11.3', time: '2d ago', source: 'ArgoCD' },
    ],
    addons: ['kube-prometheus-stack', 'vault-agent', 'network-policies', 'cert-manager', 'ingress-nginx', 'argocd'],
    insights: [
      { type: 'optimization', title: 'Right-size trading-engine pods', description: 'CPU requests are 40% higher than P95 usage. Reducing requests could save ~$420/mo.', priority: 'medium' },
      { type: 'upgrade', title: 'Kubernetes 1.30 available', description: 'Current version 1.29.2. Upgrade to 1.30 for improved sidecar container support and CEL admission policies.', priority: 'low' },
      { type: 'security', title: 'Rotate TLS certificates', description: '3 certificates expiring within 30 days. Schedule automated rotation via cert-manager.', priority: 'high' },
      { type: 'capacity', title: 'Node pool nearing capacity', description: 'Worker pool at 85% pod capacity (156/220). Consider adding nodes or enabling cluster autoscaler max increase.', priority: 'medium' },
    ],
  },
  'prod-analytics-eks': {
    cpu: 85, memory: 78, pods: 312, podCapacity: 440, nodeCount: 24,
    networkIn: 5.6, networkOut: 3.2, apiLatency: 18, etcdLatency: 6.1,
    securityScore: 88, monthlyCost: 14200, costTrend: 5.1,
    dailyCostHistory: [440, 455, 470, 460, 475, 480, 465, 470, 490, 485, 478, 482, 475, 488],
    cpuHistory: [78, 80, 85, 82, 88, 86, 84, 80, 87, 85, 82, 84, 86, 85],
    memHistory: [72, 74, 78, 76, 80, 79, 77, 74, 79, 78, 76, 77, 78, 78],
    podHistory: [280, 285, 295, 290, 305, 310, 302, 298, 308, 312, 306, 300, 308, 312],
    vulnerabilities: [
      { severity: 'CRITICAL', id: 'CVE-2024-21626', title: 'runc container breakout', namespace: 'ml-pipeline', source: 'Trivy', status: 'In Progress', age: '1d' },
      { severity: 'HIGH', id: 'CVE-2024-6387', title: 'OpenSSH RegreSSHion RCE', namespace: 'data-lake', source: 'Trivy', status: 'Open', age: '3d' },
      { severity: 'HIGH', id: 'OPA-DENY-003', title: 'Privileged container detected', namespace: 'ml-pipeline', source: 'OPA/Gatekeeper', status: 'Open', age: '5d' },
      { severity: 'MEDIUM', id: 'CVE-2024-3094', title: 'XZ Utils backdoor potential', namespace: 'kube-system', source: 'Trivy', status: 'Mitigated', age: '14d' },
    ],
    complianceChecks: [
      { name: 'CIS Kubernetes Benchmark', status: 'pass', details: '90/97 checks passed' },
      { name: 'Pod Security Standards', status: 'warning', details: '2 namespaces in privileged mode' },
      { name: 'Network Policy Coverage', status: 'pass', details: '95% namespaces covered' },
      { name: 'Image Vulnerability Scanning', status: 'fail', details: '1 critical vulnerability unresolved' },
      { name: 'RBAC Least Privilege', status: 'pass', details: 'Minor over-provisioned roles detected' },
      { name: 'Secret Encryption at Rest', status: 'pass', details: 'KMS encryption enabled' },
      { name: 'PCI-DSS Compliance', status: 'pass', details: 'All PCI controls satisfied' },
    ],
    costByNamespace: [
      { namespace: 'ml-pipeline', cost: 4970, percentage: 35 },
      { namespace: 'data-lake', cost: 3550, percentage: 25 },
      { namespace: 'spark-jobs', cost: 2840, percentage: 20 },
      { namespace: 'monitoring', cost: 1420, percentage: 10 },
      { namespace: 'kube-system', cost: 710, percentage: 5 },
      { namespace: 'other', cost: 710, percentage: 5 },
    ],
    nodes: [
      { name: 'ip-10-20-1-101', status: 'Ready', cpu: 90, memory: 82, pods: 16, role: 'worker' },
      { name: 'ip-10-20-1-102', status: 'Ready', cpu: 88, memory: 80, pods: 15, role: 'worker' },
      { name: 'ip-10-20-1-103', status: 'Ready', cpu: 82, memory: 75, pods: 14, role: 'worker' },
      { name: 'ip-10-20-2-101', status: 'Ready', cpu: 85, memory: 78, pods: 13, role: 'gpu' },
      { name: 'ip-10-20-2-102', status: 'Ready', cpu: 92, memory: 85, pods: 12, role: 'gpu' },
      { name: 'ip-10-20-3-101', status: 'Ready', cpu: 30, memory: 45, pods: 24, role: 'system' },
    ],
    components: [
      { name: 'API Server', status: 'Healthy', latency: '15ms' },
      { name: 'etcd', status: 'Healthy', latency: '6ms' },
      { name: 'Scheduler', status: 'Healthy', latency: '3ms' },
      { name: 'Controller Manager', status: 'Healthy', latency: '4ms' },
      { name: 'CoreDNS', status: 'Healthy', latency: '2ms' },
      { name: 'Ingress Controller', status: 'Warning', latency: '45ms' },
    ],
    alerts: [
      { severity: 'critical', message: 'GPU node ip-10-20-2-102 CPU at 92%', time: '5 min ago', source: 'Prometheus' },
      { severity: 'warning', message: 'Ingress controller latency > 40ms', time: '20 min ago', source: 'Prometheus' },
      { severity: 'warning', message: 'PVC storage-claim-spark nearing 90% capacity', time: '2h ago', source: 'Prometheus' },
    ],
    events: [
      { type: 'deployment', message: 'ml-pipeline v1.8.0 canary deployment started', time: '1h ago', source: 'ArgoCD' },
      { type: 'scaling', message: 'GPU node group scaled from 4 to 6 nodes', time: '4h ago', source: 'Cluster Autoscaler' },
      { type: 'config', message: 'Spark executor memory limit increased to 16Gi', time: '1d ago', source: 'GitOps' },
    ],
    addons: ['kube-prometheus-stack', 'vault-agent', 'network-policies', 'cert-manager', 'external-dns', 'argocd', 'namespace-operator'],
    insights: [
      { type: 'security', title: 'Critical CVE requires immediate action', description: 'CVE-2024-21626 runc container breakout in ml-pipeline. Patch to containerd 1.7.14 immediately.', priority: 'critical' },
      { type: 'capacity', title: 'GPU nodes approaching saturation', description: 'GPU node pool averaging 89% utilization. Queue times increasing. Add 2 GPU nodes.', priority: 'high' },
      { type: 'optimization', title: 'Idle Spark executor pods detected', description: '8 Spark executor pods idle for >4h. Consider using spot instances and auto-termination.', priority: 'medium' },
    ],
  },
  'prod-risk-gke': {
    cpu: 61, memory: 55, pods: 94, podCapacity: 160, nodeCount: 8,
    networkIn: 1.8, networkOut: 1.2, apiLatency: 9, etcdLatency: 3.8,
    securityScore: 85, monthlyCost: 6340, costTrend: -1.8,
    dailyCostHistory: [210, 208, 205, 212, 206, 204, 208, 210, 202, 205, 208, 204, 206, 203],
    cpuHistory: [58, 60, 62, 59, 64, 63, 60, 58, 62, 61, 59, 61, 62, 61],
    memHistory: [52, 54, 55, 53, 57, 56, 54, 52, 55, 55, 53, 54, 55, 55],
    podHistory: [88, 90, 94, 91, 96, 95, 92, 90, 94, 94, 92, 93, 94, 94],
    vulnerabilities: [
      { severity: 'HIGH', id: 'CVE-2024-6387', title: 'OpenSSH RegreSSHion RCE', namespace: 'risk-engine', source: 'Trivy', status: 'Open', age: '3d' },
      { severity: 'MEDIUM', id: 'KYVERNO-2024-01', title: 'Non-compliant resource labels', namespace: 'pricing', source: 'Kyverno', status: 'Open', age: '7d' },
    ],
    complianceChecks: [
      { name: 'CIS Kubernetes Benchmark', status: 'pass', details: '91/97 checks passed' },
      { name: 'Pod Security Standards', status: 'pass', details: 'Baseline profile enforced' },
      { name: 'Network Policy Coverage', status: 'warning', details: '88% namespaces covered' },
      { name: 'Image Vulnerability Scanning', status: 'pass', details: 'All images scanned' },
      { name: 'RBAC Least Privilege', status: 'pass', details: 'Clean RBAC configuration' },
      { name: 'Secret Encryption at Rest', status: 'pass', details: 'Cloud KMS encryption enabled' },
      { name: 'PCI-DSS Compliance', status: 'pass', details: 'All PCI controls satisfied' },
    ],
    costByNamespace: [
      { namespace: 'risk-engine', cost: 2536, percentage: 40 },
      { namespace: 'pricing', cost: 1585, percentage: 25 },
      { namespace: 'reporting', cost: 951, percentage: 15 },
      { namespace: 'monitoring', cost: 634, percentage: 10 },
      { namespace: 'kube-system', cost: 317, percentage: 5 },
      { namespace: 'other', cost: 317, percentage: 5 },
    ],
    nodes: [
      { name: 'gke-risk-pool-a1b2c3', status: 'Ready', cpu: 65, memory: 58, pods: 14, role: 'worker' },
      { name: 'gke-risk-pool-d4e5f6', status: 'Ready', cpu: 58, memory: 52, pods: 12, role: 'worker' },
      { name: 'gke-risk-pool-g7h8i9', status: 'Ready', cpu: 62, memory: 56, pods: 13, role: 'worker' },
      { name: 'gke-system-j0k1l2', status: 'Ready', cpu: 35, memory: 40, pods: 20, role: 'system' },
    ],
    components: [
      { name: 'API Server', status: 'Healthy', latency: '7ms' },
      { name: 'etcd', status: 'Healthy', latency: '4ms' },
      { name: 'Scheduler', status: 'Healthy', latency: '2ms' },
      { name: 'Controller Manager', status: 'Healthy', latency: '2ms' },
      { name: 'CoreDNS', status: 'Healthy', latency: '1ms' },
      { name: 'Ingress Controller', status: 'Healthy', latency: '4ms' },
    ],
    alerts: [
      { severity: 'info', message: 'risk-engine replicas scaled to 6', time: '3h ago', source: 'HPA' },
    ],
    events: [
      { type: 'deployment', message: 'pricing-service v3.2.1 rolled out', time: '6h ago', source: 'ArgoCD' },
      { type: 'security', message: 'Network policies reviewed and updated', time: '1d ago', source: 'GitOps' },
    ],
    addons: ['kube-prometheus-stack', 'vault-agent', 'network-policies', 'cert-manager', 'argocd'],
    insights: [
      { type: 'optimization', title: 'Cluster under-utilized', description: 'Average CPU at 61%, memory at 55%. Consider reducing node count from 8 to 6 to save ~$1,200/mo.', priority: 'medium' },
      { type: 'upgrade', title: 'Kubernetes 1.30 available', description: 'Current version 1.29.1. GKE release channel update recommended.', priority: 'low' },
    ],
  },
  'staging-risk-eks': {
    cpu: 34, memory: 42, pods: 67, podCapacity: 120, nodeCount: 6,
    networkIn: 0.8, networkOut: 0.5, apiLatency: 8, etcdLatency: 3.2,
    securityScore: 78, monthlyCost: 3180, costTrend: 0.5,
    dailyCostHistory: [102, 105, 100, 108, 103, 106, 101, 104, 107, 102, 105, 103, 100, 104],
    cpuHistory: [30, 32, 34, 31, 36, 35, 33, 30, 35, 34, 32, 33, 34, 34],
    memHistory: [38, 40, 42, 40, 44, 43, 41, 39, 43, 42, 40, 41, 42, 42],
    podHistory: [60, 62, 67, 64, 70, 68, 65, 62, 68, 67, 64, 65, 66, 67],
    vulnerabilities: [
      { severity: 'HIGH', id: 'CVE-2024-6387', title: 'OpenSSH RegreSSHion', namespace: 'risk-staging', source: 'Trivy', status: 'Open', age: '3d' },
      { severity: 'MEDIUM', id: 'OPA-DENY-005', title: 'Container without resource limits', namespace: 'risk-staging', source: 'OPA/Gatekeeper', status: 'Open', age: '10d' },
      { severity: 'MEDIUM', id: 'FALCO-2024-003', title: 'Write to /etc detected', namespace: 'test-runner', source: 'Falco', status: 'Investigating', age: '1d' },
    ],
    complianceChecks: [
      { name: 'CIS Kubernetes Benchmark', status: 'warning', details: '85/97 checks passed' },
      { name: 'Pod Security Standards', status: 'warning', details: 'Baseline mode, some violations' },
      { name: 'Network Policy Coverage', status: 'fail', details: '60% namespaces covered' },
      { name: 'Image Vulnerability Scanning', status: 'pass', details: 'All images scanned' },
      { name: 'RBAC Least Privilege', status: 'warning', details: 'Over-provisioned test roles' },
      { name: 'Secret Encryption at Rest', status: 'pass', details: 'KMS encryption enabled' },
    ],
    costByNamespace: [
      { namespace: 'risk-staging', cost: 1430, percentage: 45 },
      { namespace: 'test-runner', cost: 636, percentage: 20 },
      { namespace: 'perf-test', cost: 477, percentage: 15 },
      { namespace: 'monitoring', cost: 318, percentage: 10 },
      { namespace: 'other', cost: 319, percentage: 10 },
    ],
    nodes: [
      { name: 'ip-10-40-1-201', status: 'Ready', cpu: 38, memory: 44, pods: 12, role: 'worker' },
      { name: 'ip-10-40-1-202', status: 'Ready', cpu: 32, memory: 40, pods: 10, role: 'worker' },
      { name: 'ip-10-40-1-203', status: 'Ready', cpu: 30, memory: 38, pods: 11, role: 'worker' },
      { name: 'ip-10-40-2-201', status: 'Ready', cpu: 25, memory: 35, pods: 18, role: 'system' },
    ],
    components: [
      { name: 'API Server', status: 'Healthy', latency: '6ms' },
      { name: 'etcd', status: 'Healthy', latency: '3ms' },
      { name: 'Scheduler', status: 'Healthy', latency: '2ms' },
      { name: 'Controller Manager', status: 'Healthy', latency: '2ms' },
      { name: 'CoreDNS', status: 'Healthy', latency: '1ms' },
      { name: 'Ingress Controller', status: 'Healthy', latency: '5ms' },
    ],
    alerts: [],
    events: [
      { type: 'deployment', message: 'risk-staging integration tests completed', time: '2h ago', source: 'CI/CD' },
    ],
    addons: ['kube-prometheus-stack', 'vault-agent', 'cert-manager', 'argocd'],
    insights: [
      { type: 'security', title: 'Network policy gaps', description: 'Only 60% of namespaces have network policies. Add policies before promoting to production.', priority: 'high' },
      { type: 'optimization', title: 'Over-provisioned cluster', description: 'CPU ~34%, Memory ~42%. Consider scaling to 4 nodes during non-business hours.', priority: 'low' },
    ],
  },
  'dev-sandbox-aks': {
    cpu: 18, memory: 22, pods: 23, podCapacity: 80, nodeCount: 4,
    networkIn: 0.3, networkOut: 0.2, apiLatency: 6, etcdLatency: 2.8,
    securityScore: 65, monthlyCost: 1240, costTrend: -2.3,
    dailyCostHistory: [42, 40, 38, 44, 41, 39, 40, 42, 38, 40, 41, 39, 38, 40],
    cpuHistory: [15, 18, 20, 16, 22, 19, 17, 15, 20, 18, 16, 17, 19, 18],
    memHistory: [18, 20, 22, 20, 24, 22, 20, 19, 22, 22, 20, 21, 22, 22],
    podHistory: [18, 20, 23, 21, 25, 24, 22, 20, 24, 23, 21, 22, 23, 23],
    vulnerabilities: [
      { severity: 'HIGH', id: 'CVE-2024-6387', title: 'OpenSSH RegreSSHion', namespace: 'default', source: 'Trivy', status: 'Open', age: '3d' },
      { severity: 'MEDIUM', id: 'OPA-DENY-008', title: 'Pods running as root', namespace: 'sandbox', source: 'OPA/Gatekeeper', status: 'Open', age: '20d' },
      { severity: 'MEDIUM', id: 'KUBE-AUDIT-005', title: 'No readiness probe defined', namespace: 'sandbox', source: 'KubeAudit', status: 'Open', age: '30d' },
      { severity: 'LOW', id: 'KYVERNO-2024-03', title: 'Missing resource quotas', namespace: 'default', source: 'Kyverno', status: 'Open', age: '45d' },
    ],
    complianceChecks: [
      { name: 'CIS Kubernetes Benchmark', status: 'fail', details: '72/97 checks passed' },
      { name: 'Pod Security Standards', status: 'fail', details: 'Privileged mode with violations' },
      { name: 'Network Policy Coverage', status: 'fail', details: '25% namespaces covered' },
      { name: 'Image Vulnerability Scanning', status: 'warning', details: 'Some images not scanned' },
      { name: 'RBAC Least Privilege', status: 'fail', details: 'Multiple cluster-admin bindings' },
      { name: 'Secret Encryption at Rest', status: 'pass', details: 'Azure Key Vault enabled' },
    ],
    costByNamespace: [
      { namespace: 'sandbox', cost: 496, percentage: 40 },
      { namespace: 'dev-tools', cost: 310, percentage: 25 },
      { namespace: 'monitoring', cost: 186, percentage: 15 },
      { namespace: 'kube-system', cost: 124, percentage: 10 },
      { namespace: 'other', cost: 124, percentage: 10 },
    ],
    nodes: [
      { name: 'aks-dev-vm000000', status: 'Ready', cpu: 20, memory: 24, pods: 8, role: 'worker' },
      { name: 'aks-dev-vm000001', status: 'Ready', cpu: 15, memory: 18, pods: 6, role: 'worker' },
      { name: 'aks-dev-vm000002', status: 'Ready', cpu: 12, memory: 20, pods: 5, role: 'system' },
    ],
    components: [
      { name: 'API Server', status: 'Healthy', latency: '5ms' },
      { name: 'etcd', status: 'Healthy', latency: '3ms' },
      { name: 'Scheduler', status: 'Healthy', latency: '1ms' },
      { name: 'Controller Manager', status: 'Healthy', latency: '2ms' },
      { name: 'CoreDNS', status: 'Healthy', latency: '1ms' },
    ],
    alerts: [],
    events: [
      { type: 'config', message: 'Developer sandbox namespace recreated', time: '6h ago', source: 'GitOps' },
    ],
    addons: ['kube-prometheus-stack', 'cert-manager', 'argocd'],
    insights: [
      { type: 'security', title: 'Harden sandbox environment', description: 'Multiple CIS failures and pods running as root. Apply pod security standards at minimum baseline level.', priority: 'high' },
      { type: 'optimization', title: 'Extremely under-utilized', description: 'CPU 18%, Memory 22%. Consider shutting down during non-business hours to save ~$600/mo.', priority: 'medium' },
    ],
  },
  'dev-ml-gke': {
    cpu: 55, memory: 63, pods: 48, podCapacity: 120, nodeCount: 6,
    networkIn: 1.2, networkOut: 0.8, apiLatency: 10, etcdLatency: 3.5,
    securityScore: 54, monthlyCost: 4560, costTrend: 8.7,
    dailyCostHistory: [130, 138, 145, 140, 152, 160, 155, 148, 158, 162, 155, 150, 156, 160],
    cpuHistory: [48, 50, 55, 52, 58, 56, 54, 50, 56, 55, 52, 53, 54, 55],
    memHistory: [56, 58, 63, 60, 66, 65, 62, 58, 64, 63, 60, 62, 63, 63],
    podHistory: [40, 42, 48, 45, 52, 50, 47, 44, 50, 48, 45, 46, 47, 48],
    vulnerabilities: [
      { severity: 'CRITICAL', id: 'CVE-2024-21626', title: 'runc container breakout', namespace: 'ml-training', source: 'Trivy', status: 'Open', age: '5d' },
      { severity: 'HIGH', id: 'CVE-2024-6387', title: 'OpenSSH RegreSSHion', namespace: 'jupyter-hub', source: 'Trivy', status: 'Open', age: '3d' },
      { severity: 'HIGH', id: 'OPA-DENY-010', title: 'Privileged GPU containers', namespace: 'ml-training', source: 'OPA/Gatekeeper', status: 'Open', age: '15d' },
      { severity: 'MEDIUM', id: 'FALCO-2024-005', title: 'Unexpected shell in container', namespace: 'jupyter-hub', source: 'Falco', status: 'Investigating', age: '2d' },
      { severity: 'MEDIUM', id: 'KUBE-AUDIT-012', title: 'Host network access enabled', namespace: 'ml-training', source: 'KubeAudit', status: 'Open', age: '20d' },
    ],
    complianceChecks: [
      { name: 'CIS Kubernetes Benchmark', status: 'fail', details: '68/97 checks passed' },
      { name: 'Pod Security Standards', status: 'fail', details: 'Privileged containers for GPU access' },
      { name: 'Network Policy Coverage', status: 'fail', details: '30% namespaces covered' },
      { name: 'Image Vulnerability Scanning', status: 'fail', details: '1 critical, 2 high unresolved' },
      { name: 'RBAC Least Privilege', status: 'fail', details: 'Broad permissions for ML pipelines' },
      { name: 'Secret Encryption at Rest', status: 'pass', details: 'Cloud KMS encryption enabled' },
    ],
    costByNamespace: [
      { namespace: 'ml-training', cost: 2280, percentage: 50 },
      { namespace: 'jupyter-hub', cost: 912, percentage: 20 },
      { namespace: 'model-serving', cost: 684, percentage: 15 },
      { namespace: 'monitoring', cost: 456, percentage: 10 },
      { namespace: 'other', cost: 228, percentage: 5 },
    ],
    nodes: [
      { name: 'gke-ml-gpu-a1b2', status: 'Ready', cpu: 72, memory: 78, pods: 8, role: 'gpu' },
      { name: 'gke-ml-gpu-c3d4', status: 'Ready', cpu: 68, memory: 72, pods: 7, role: 'gpu' },
      { name: 'gke-ml-cpu-e5f6', status: 'Ready', cpu: 45, memory: 50, pods: 10, role: 'worker' },
      { name: 'gke-ml-cpu-g7h8', status: 'Ready', cpu: 40, memory: 48, pods: 9, role: 'worker' },
      { name: 'gke-ml-sys-i9j0', status: 'Ready', cpu: 28, memory: 35, pods: 14, role: 'system' },
    ],
    components: [
      { name: 'API Server', status: 'Healthy', latency: '8ms' },
      { name: 'etcd', status: 'Healthy', latency: '4ms' },
      { name: 'Scheduler', status: 'Healthy', latency: '2ms' },
      { name: 'Controller Manager', status: 'Healthy', latency: '3ms' },
      { name: 'CoreDNS', status: 'Healthy', latency: '1ms' },
      { name: 'GPU Device Plugin', status: 'Healthy', latency: 'N/A' },
    ],
    alerts: [
      { severity: 'critical', message: 'Unpatched critical CVE-2024-21626 for 5 days', time: '5d ago', source: 'Security Scanner' },
      { severity: 'warning', message: 'Monthly cost trending up 8.7%', time: '1d ago', source: 'Cost Manager' },
    ],
    events: [
      { type: 'deployment', message: 'JupyterHub v4.1.0 deployed', time: '4h ago', source: 'ArgoCD' },
      { type: 'scaling', message: 'GPU node pool scaled for training job batch-2024-q4', time: '8h ago', source: 'Karpenter' },
      { type: 'security', message: 'Security review flagged — compliance score below threshold', time: '1d ago', source: 'Policy Engine' },
    ],
    addons: ['kube-prometheus-stack', 'cert-manager', 'argocd', 'namespace-operator'],
    insights: [
      { type: 'security', title: 'Critical: Compliance score below 60', description: 'Security score 54/100. Multiple CIS failures, privileged containers, and unpatched critical CVEs. Immediate remediation required.', priority: 'critical' },
      { type: 'optimization', title: 'Cost spike alert', description: 'Monthly cost trending +8.7%. GPU training jobs running longer than expected. Implement job timeouts and spot instances.', priority: 'high' },
      { type: 'capacity', title: 'GPU utilization pattern', description: 'GPU nodes idle 40% of the time. Consider using preemptible/spot GPU instances to reduce costs by ~35%.', priority: 'medium' },
    ],
  },
};

// Fallback for clusters not in mock data
const defaultClusterDetail: ClusterDetail = {
  cpu: 50, memory: 50, pods: 50, podCapacity: 100, nodeCount: 4,
  networkIn: 1.0, networkOut: 0.5, apiLatency: 10, etcdLatency: 4,
  securityScore: 70, monthlyCost: 3000, costTrend: 0,
  dailyCostHistory: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  cpuHistory: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
  memHistory: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
  podHistory: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
  vulnerabilities: [], complianceChecks: [], costByNamespace: [],
  nodes: [], components: [], alerts: [], events: [], addons: [], insights: [],
};

// ---------------------------------------------------------------------------
// Tab Panels
// ---------------------------------------------------------------------------

// ---- Overview Tab ----
const OverviewTab = ({ data, entity }: { data: ClusterDetail; entity: Entity }) => {
  const classes = useStyles();
  const ann = entity.metadata.annotations || {};
  const csp = ann['morgan-stanley.com/csp'] || 'unknown';
  const env = ann['morgan-stanley.com/environment'] || '—';
  const region = ann['morgan-stanley.com/region'] || '—';
  const k8sVersion = ann['morgan-stanley.com/kubernetes-version'] || '—';
  const instanceType = ann['morgan-stanley.com/instance-type'] || '—';
  const clusterName = entity.metadata.name;

  return (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <GaugeChart value={data.cpu} label="CPU" />
            <Sparkline data={data.cpuHistory} color="#1976D2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <GaugeChart value={data.memory} label="Memory" />
            <Sparkline data={data.memHistory} color="#7B1FA2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <GaugeChart value={Math.round((data.pods / data.podCapacity) * 100)} label="Pods" />
            <Typography variant="caption" color="textSecondary">{data.pods}/{data.podCapacity} pods</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <Box>
              <Typography className={classes.metricValue} style={{ color: data.securityScore >= 80 ? '#4CAF50' : data.securityScore >= 60 ? '#FF9800' : '#F44336' }}>
                {data.securityScore}
              </Typography>
              <Typography className={classes.metricLabel}>Security Score</Typography>
            </Box>
            <Box mt={1}>
              <Typography variant="caption" display="block">
                <span style={{ fontWeight: 600 }}>${data.monthlyCost.toLocaleString()}</span>/mo
                <span style={{ color: data.costTrend >= 0 ? '#F44336' : '#4CAF50', marginLeft: 4 }}>
                  {data.costTrend >= 0 ? '+' : ''}{data.costTrend}%
                </span>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Cluster Info */}
      <Grid item xs={12} md={6}>
        <Card style={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Cluster Details</Typography>
            <Box className={classes.statRow}>
              <Typography variant="body2" color="textSecondary">Cloud Provider</Typography>
              <Chip size="small" label={csp.toUpperCase()} style={{ fontWeight: 600, backgroundColor: csp === 'azure' ? '#0078D4' : csp === 'aws' ? '#FF9900' : '#34A853', color: '#fff' }} />
            </Box>
            <Box className={classes.statRow}>
              <Typography variant="body2" color="textSecondary">Environment</Typography>
              <Typography variant="body2" style={{ fontWeight: 500 }}>{env}</Typography>
            </Box>
            <Box className={classes.statRow}>
              <Typography variant="body2" color="textSecondary">Region</Typography>
              <Typography variant="body2">{region}</Typography>
            </Box>
            <Box className={classes.statRow}>
              <Typography variant="body2" color="textSecondary">Kubernetes Version</Typography>
              <Chip size="small" label={k8sVersion} variant="outlined" />
            </Box>
            <Box className={classes.statRow}>
              <Typography variant="body2" color="textSecondary">Instance Type</Typography>
              <Typography variant="body2">{instanceType}</Typography>
            </Box>
            <Box className={classes.statRow}>
              <Typography variant="body2" color="textSecondary">Nodes</Typography>
              <Typography variant="body2" style={{ fontWeight: 600 }}>{data.nodeCount}</Typography>
            </Box>
            <Box className={classes.statRow}>
              <Typography variant="body2" color="textSecondary">Network In/Out</Typography>
              <Typography variant="body2">{data.networkIn} / {data.networkOut} Gbps</Typography>
            </Box>
            <Box className={classes.statRow}>
              <Typography variant="body2" color="textSecondary">API P99 Latency</Typography>
              <Typography variant="body2">{data.apiLatency}ms</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions + Add-ons */}
      <Grid item xs={12} md={6}>
        <Card style={{ marginBottom: 16 }}>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Quick Actions</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button variant="outlined" color="primary" fullWidth startIcon={<UpdateIcon />}
                  component={Link} to={`/create/templates/default/cluster-upgrade?clusterName=${clusterName}`}>
                  Upgrade
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" color="primary" fullWidth startIcon={<MemoryIcon />}
                  component={Link} to={`/create/templates/default/cluster-scale?clusterName=${clusterName}`}>
                  Scale
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" color="primary" fullWidth startIcon={<SettingsIcon />}
                  component={Link} to={`/create/templates/default/addon-management?clusterName=${clusterName}`}>
                  Manage Add-ons
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" color="primary" fullWidth startIcon={<DnsIcon />}
                  component={Link} to={`/create/templates/default/namespace-request?clusterName=${clusterName}`}>
                  Request NS
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Installed Add-ons</Typography>
            <Box display="flex" flexWrap="wrap" gridGap={6}>
              {data.addons.map(addon => (
                <Chip key={addon} size="small" label={addon} variant="outlined"
                  icon={addon.includes('prometheus') ? <AssessmentIcon /> : addon.includes('vault') ? <SecurityIcon /> :
                    addon.includes('network') ? <NetworkCheckIcon /> : addon.includes('cert') ? <SecurityIcon /> :
                    addon.includes('argocd') ? <UpdateIcon /> : <SettingsIcon />}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Component Health */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Component Health</Typography>
            {data.components.map(comp => (
              <Box key={comp.name} className={classes.statRow}>
                <Box display="flex" alignItems="center" gridGap={8}>
                  {comp.status === 'Healthy' ? <CheckCircleIcon style={{ color: '#4CAF50', fontSize: 18 }} /> :
                   comp.status === 'Warning' ? <WarningIcon style={{ color: '#FF9800', fontSize: 18 }} /> :
                   <ErrorIcon style={{ color: '#F44336', fontSize: 18 }} />}
                  <Typography variant="body2">{comp.name}</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">{comp.latency}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Events */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Recent Events</Typography>
            <List dense>
              {data.events.map((ev, i) => (
                <ListItem key={i}>
                  <ListItemIcon style={{ minWidth: 36 }}>
                    {ev.type === 'deployment' ? <UpdateIcon fontSize="small" color="primary" /> :
                     ev.type === 'security' ? <SecurityIcon fontSize="small" style={{ color: '#FF9800' }} /> :
                     ev.type === 'scaling' ? <TrendingUpIcon fontSize="small" style={{ color: '#4CAF50' }} /> :
                     ev.type === 'config' ? <SettingsIcon fontSize="small" color="action" /> :
                     <InfoIcon fontSize="small" color="action" />}
                  </ListItemIcon>
                  <ListItemText primary={ev.message} secondary={`${ev.time} — ${ev.source}`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// ---- Security Tab ----
const SecurityTab = ({ data }: { data: ClusterDetail }) => {
  const classes = useStyles();
  const critCount = data.vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
  const highCount = data.vulnerabilities.filter(v => v.severity === 'HIGH').length;
  const medCount = data.vulnerabilities.filter(v => v.severity === 'MEDIUM').length;
  const lowCount = data.vulnerabilities.filter(v => v.severity === 'LOW').length;

  const sevColor = (s: string) =>
    s === 'CRITICAL' ? '#9C27B0' : s === 'HIGH' ? '#F44336' : s === 'MEDIUM' ? '#FF9800' : '#2196F3';

  const checkIcon = (s: string) =>
    s === 'pass' ? <CheckCircleIcon style={{ color: '#4CAF50' }} /> :
    s === 'warning' ? <WarningIcon style={{ color: '#FF9800' }} /> :
    <ErrorIcon style={{ color: '#F44336' }} />;

  return (
    <Grid container spacing={3}>
      {/* Score Cards */}
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <Typography className={classes.metricValue}
              style={{ color: data.securityScore >= 80 ? '#4CAF50' : data.securityScore >= 60 ? '#FF9800' : '#F44336' }}>
              {data.securityScore}
            </Typography>
            <Typography className={classes.metricLabel}>Security Score</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <Typography className={classes.metricValue} style={{ color: '#9C27B0' }}>{critCount}</Typography>
            <Typography className={classes.metricLabel}>Critical</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <Typography className={classes.metricValue} style={{ color: '#F44336' }}>{highCount}</Typography>
            <Typography className={classes.metricLabel}>High</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <Typography className={classes.metricValue} style={{ color: '#FF9800' }}>{medCount + lowCount}</Typography>
            <Typography className={classes.metricLabel}>Medium / Low</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Compliance Checks */}
      <Grid item xs={12} md={5}>
        <Card style={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Compliance Checks</Typography>
            <List dense>
              {data.complianceChecks.map(check => (
                <ListItem key={check.name}>
                  <ListItemIcon style={{ minWidth: 36 }}>{checkIcon(check.status)}</ListItemIcon>
                  <ListItemText primary={check.name} secondary={check.details} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Vulnerability Table */}
      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Vulnerabilities</Typography>
            {data.vulnerabilities.length === 0 ? (
              <Box py={3} textAlign="center">
                <CheckCircleIcon style={{ color: '#4CAF50', fontSize: 48 }} />
                <Typography variant="body1" style={{ marginTop: 8 }}>No vulnerabilities detected</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Severity</TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Namespace</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.vulnerabilities.map((vuln, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Chip size="small" label={vuln.severity}
                            className={classes.severityChip}
                            style={{ backgroundColor: `${sevColor(vuln.severity)}22`, color: sevColor(vuln.severity), border: `1px solid ${sevColor(vuln.severity)}` }}
                          />
                        </TableCell>
                        <TableCell><Typography variant="body2" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{vuln.id}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{vuln.title}</Typography></TableCell>
                        <TableCell><Chip size="small" label={vuln.namespace} variant="outlined" /></TableCell>
                        <TableCell><Typography variant="body2">{vuln.source}</Typography></TableCell>
                        <TableCell>
                          <Chip size="small" label={vuln.status} variant="outlined"
                            style={{ borderColor: vuln.status === 'Mitigated' ? '#4CAF50' : vuln.status === 'In Progress' ? '#FF9800' : '#F44336',
                                     color: vuln.status === 'Mitigated' ? '#4CAF50' : vuln.status === 'In Progress' ? '#FF9800' : '#F44336' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// ---- Monitoring Tab ----
const MonitoringTab = ({ data }: { data: ClusterDetail }) => {
  const classes = useStyles();
  const getBarColor = (v: number) => v > 80 ? '#F44336' : v > 60 ? '#FF9800' : '#4CAF50';

  return (
    <Grid container spacing={3}>
      {/* Gauges */}
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <GaugeChart value={data.cpu} label="CPU" size={110} />
            <Sparkline data={data.cpuHistory} color="#1976D2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <GaugeChart value={data.memory} label="Memory" size={110} />
            <Sparkline data={data.memHistory} color="#7B1FA2" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <GaugeChart value={Math.round((data.pods / data.podCapacity) * 100)} label="Pods" size={110} />
            <Typography variant="caption" color="textSecondary">{data.pods}/{data.podCapacity}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <Box>
              <Typography variant="h4" style={{ fontWeight: 700, color: '#1976D2' }}>{data.apiLatency}ms</Typography>
              <Typography className={classes.metricLabel}>API P99 Latency</Typography>
            </Box>
            <Box mt={1}>
              <Typography variant="body2" color="textSecondary">etcd: {data.etcdLatency}ms</Typography>
              <Typography variant="body2" color="textSecondary">Net: {data.networkIn}/{data.networkOut} Gbps</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Node Status */}
      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Node Status</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Node</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>CPU</TableCell>
                    <TableCell>Memory</TableCell>
                    <TableCell>Pods</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.nodes.map(node => (
                    <TableRow key={node.name}>
                      <TableCell>
                        <Typography variant="body2" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{node.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={node.role} variant="outlined"
                          style={node.role === 'gpu' ? { borderColor: '#9C27B0', color: '#9C27B0' } : undefined}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gridGap={4}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: node.status === 'Ready' ? '#4CAF50' : '#F44336', display: 'inline-block' }} />
                          <Typography variant="body2">{node.status}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gridGap={4}>
                          <LinearProgress variant="determinate" value={node.cpu}
                            style={{ width: 50, height: 6, borderRadius: 3, backgroundColor: `${getBarColor(node.cpu)}22` }}
                            className={classes.progressBar}
                          />
                          <Typography variant="caption">{node.cpu}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gridGap={4}>
                          <LinearProgress variant="determinate" value={node.memory}
                            style={{ width: 50, height: 6, borderRadius: 3, backgroundColor: `${getBarColor(node.memory)}22` }}
                            className={classes.progressBar}
                          />
                          <Typography variant="caption">{node.memory}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2">{node.pods}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Component Health + Alerts */}
      <Grid item xs={12} md={5}>
        <Card style={{ marginBottom: 16 }}>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Control Plane</Typography>
            {data.components.map(comp => (
              <Box key={comp.name} className={classes.statRow}>
                <Box display="flex" alignItems="center" gridGap={6}>
                  {comp.status === 'Healthy' ? <CheckCircleIcon style={{ color: '#4CAF50', fontSize: 16 }} /> :
                   <WarningIcon style={{ color: '#FF9800', fontSize: 16 }} />}
                  <Typography variant="body2">{comp.name}</Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">{comp.latency}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>
              Active Alerts ({data.alerts.length})
            </Typography>
            {data.alerts.length === 0 ? (
              <Box py={2} textAlign="center">
                <CheckCircleIcon style={{ color: '#4CAF50', fontSize: 36 }} />
                <Typography variant="body2" color="textSecondary">No active alerts</Typography>
              </Box>
            ) : (
              data.alerts.map((alert, i) => (
                <Box key={i} className={classes.alertRow}>
                  {alert.severity === 'critical' ? <ErrorIcon style={{ color: '#F44336', fontSize: 18 }} /> :
                   alert.severity === 'warning' ? <WarningIcon style={{ color: '#FF9800', fontSize: 18 }} /> :
                   <InfoIcon style={{ color: '#2196F3', fontSize: 18 }} />}
                  <Box flex={1}>
                    <Typography variant="body2">{alert.message}</Typography>
                    <Typography variant="caption" color="textSecondary">{alert.time} — {alert.source}</Typography>
                  </Box>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// ---- Cost Tab ----
const CostTab = ({ data }: { data: ClusterDetail }) => {
  const classes = useStyles();
  const maxDailyCost = Math.max(...data.dailyCostHistory);
  const nsColors = ['#1976D2', '#7B1FA2', '#388E3C', '#F57C00', '#5D4037', '#607D8B'];

  return (
    <Grid container spacing={3}>
      {/* Cost Summary */}
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <AttachMoneyIcon style={{ color: '#1976D2', fontSize: 32 }} />
            <Typography className={classes.metricValue} style={{ color: '#1976D2' }}>
              ${data.monthlyCost.toLocaleString()}
            </Typography>
            <Typography className={classes.metricLabel}>Monthly Cost</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <Typography className={classes.metricValue} style={{ color: '#1976D2' }}>
              ${Math.round(data.monthlyCost / 30).toLocaleString()}
            </Typography>
            <Typography className={classes.metricLabel}>Daily Average</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            {data.costTrend >= 0 ? (
              <TrendingUpIcon style={{ color: '#F44336', fontSize: 32 }} />
            ) : (
              <TrendingDownIcon style={{ color: '#4CAF50', fontSize: 32 }} />
            )}
            <Typography className={classes.metricValue}
              style={{ color: data.costTrend >= 0 ? '#F44336' : '#4CAF50' }}>
              {data.costTrend >= 0 ? '+' : ''}{data.costTrend}%
            </Typography>
            <Typography className={classes.metricLabel}>Trend (30d)</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card className={classes.metricCard}>
          <CardContent>
            <Typography className={classes.metricValue} style={{ color: '#1976D2' }}>
              ${(data.monthlyCost * 12 / 1000).toFixed(1)}k
            </Typography>
            <Typography className={classes.metricLabel}>Annual Projection</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Daily Cost Trend */}
      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Daily Cost (Last 14 Days)</Typography>
            <Box display="flex" alignItems="flex-end" gridGap={4} style={{ height: 120, marginTop: 8 }}>
              {data.dailyCostHistory.map((cost, i) => {
                const h = (cost / maxDailyCost) * 100;
                return (
                  <Tooltip key={i} title={`$${cost}`}>
                    <Box
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        backgroundColor: '#1976D2',
                        borderRadius: '4px 4px 0 0',
                        opacity: 0.7 + (i / data.dailyCostHistory.length) * 0.3,
                        cursor: 'pointer',
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>
            <Box display="flex" justifyContent="space-between" mt={0.5}>
              <Typography variant="caption" color="textSecondary">14 days ago</Typography>
              <Typography variant="caption" color="textSecondary">Today</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Cost by Namespace */}
      <Grid item xs={12} md={5}>
        <Card style={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Cost by Namespace</Typography>
            {data.costByNamespace.map((ns, i) => (
              <Box key={ns.namespace} mb={1.5}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" style={{ fontWeight: 500 }}>{ns.namespace}</Typography>
                  <Typography variant="body2" style={{ fontWeight: 600 }}>${ns.cost.toLocaleString()} ({ns.percentage}%)</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={ns.percentage}
                  className={classes.costBar}
                  style={{ backgroundColor: `${nsColors[i % nsColors.length]}22` }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Cost Optimization */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Cost Optimization Opportunities</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gridGap={8} mb={1}>
                      <SpeedIcon style={{ color: '#FF9800' }} />
                      <Typography variant="subtitle2">Right-Sizing</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {data.cpu < 50 ? `CPU utilization at ${data.cpu}%. Consider downsizing instance types to save ~15%.` :
                       `CPU at ${data.cpu}%. Instance sizing appears appropriate.`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gridGap={8} mb={1}>
                      <ScheduleIcon style={{ color: '#1976D2' }} />
                      <Typography variant="subtitle2">Scheduling</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {data.cpu < 40 ? 'Low off-hours usage detected. Enable cluster auto-shutdown during non-business hours.' :
                       'Consistent utilization. Scheduling optimizations may have limited impact.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gridGap={8} mb={1}>
                      <StorageIcon style={{ color: '#4CAF50' }} />
                      <Typography variant="subtitle2">Reserved Capacity</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {data.monthlyCost > 5000 ? `Spending $${data.monthlyCost.toLocaleString()}/mo. RI/savings plans could save 20-30%.` :
                       'Consider reserved instances once workloads stabilize.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// ---- Insights Tab ----
const InsightsTab = ({ data }: { data: ClusterDetail }) => {
  const classes = useStyles();
  const priorityColor = (p: string) =>
    p === 'critical' ? '#9C27B0' : p === 'high' ? '#F44336' : p === 'medium' ? '#FF9800' : '#2196F3';
  const typeIcon = (t: string) =>
    t === 'security' ? <SecurityIcon /> : t === 'optimization' ? <AttachMoneyIcon /> :
    t === 'capacity' ? <StorageIcon /> : t === 'upgrade' ? <UpdateIcon /> : <InfoIcon />;

  return (
    <Grid container spacing={3}>
      {/* AI-Generated Insights */}
      <Grid item xs={12}>
        <Typography variant="h6" className={classes.sectionTitle}>
          <Box display="flex" alignItems="center" gridGap={8}>
            <BugReportIcon color="primary" /> Cluster Insights & Recommendations
          </Box>
        </Typography>
      </Grid>

      {data.insights.map((insight, i) => (
        <Grid item xs={12} md={6} key={i}>
          <Card className={classes.insightCard} style={{ borderLeftColor: priorityColor(insight.priority) }}>
            <CardContent>
              <Box display="flex" alignItems="center" gridGap={8} mb={1}>
                <Avatar style={{ width: 32, height: 32, backgroundColor: `${priorityColor(insight.priority)}22`, color: priorityColor(insight.priority) }}>
                  {typeIcon(insight.type)}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="subtitle2" style={{ fontWeight: 600 }}>{insight.title}</Typography>
                  <Chip size="small" label={insight.priority.toUpperCase()}
                    style={{ fontSize: '0.65rem', fontWeight: 700, backgroundColor: `${priorityColor(insight.priority)}22`,
                             color: priorityColor(insight.priority), height: 20, marginLeft: 8 }}
                  />
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary">{insight.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Cluster Events Timeline */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>
              <Box display="flex" alignItems="center" gridGap={8}>
                <ScheduleIcon color="action" /> Activity Timeline
              </Box>
            </Typography>
            <List dense>
              {data.events.map((ev, i) => (
                <ListItem key={i} style={{ borderLeft: `3px solid ${ev.type === 'security' ? '#FF9800' : ev.type === 'deployment' ? '#1976D2' : ev.type === 'scaling' ? '#4CAF50' : '#9E9E9E'}`, marginBottom: 4, paddingLeft: 12 }}>
                  <ListItemText
                    primary={<Typography variant="body2" style={{ fontWeight: 500 }}>{ev.message}</Typography>}
                    secondary={`${ev.time} — ${ev.source}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Active Alerts */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>
              <Box display="flex" alignItems="center" gridGap={8}>
                <NotificationsIcon color="action" /> Active Alerts ({data.alerts.length})
              </Box>
            </Typography>
            {data.alerts.length === 0 ? (
              <Box py={3} textAlign="center">
                <CheckCircleIcon style={{ color: '#4CAF50', fontSize: 48 }} />
                <Typography variant="body1" style={{ marginTop: 8, color: '#4CAF50' }}>All clear — no active alerts</Typography>
              </Box>
            ) : (
              data.alerts.map((alert, i) => (
                <Box key={i} className={classes.alertRow}>
                  {alert.severity === 'critical' ? <ErrorIcon style={{ color: '#F44336' }} /> :
                   alert.severity === 'warning' ? <WarningIcon style={{ color: '#FF9800' }} /> :
                   <InfoIcon style={{ color: '#2196F3' }} />}
                  <Box flex={1}>
                    <Typography variant="body2" style={{ fontWeight: 500 }}>{alert.message}</Typography>
                    <Typography variant="caption" color="textSecondary">{alert.time} — {alert.source}</Typography>
                  </Box>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Capacity Planning */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Capacity Planning</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <GaugeChart value={data.cpu} label="CPU Headroom" size={100}
                    color={data.cpu > 80 ? '#F44336' : data.cpu > 60 ? '#FF9800' : '#4CAF50'} />
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: 4 }}>
                    {100 - data.cpu}% remaining capacity
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <GaugeChart value={data.memory} label="Memory Headroom" size={100}
                    color={data.memory > 80 ? '#F44336' : data.memory > 60 ? '#FF9800' : '#4CAF50'} />
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: 4 }}>
                    {100 - data.memory}% remaining capacity
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <GaugeChart value={Math.round((data.pods / data.podCapacity) * 100)} label="Pod Headroom" size={100} />
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: 4 }}>
                    {data.podCapacity - data.pods} pods remaining
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// ---- GitOps Tab ----
const GitOpsTab = ({ data }: { data: ClusterDetail }) => {
  const classes = useStyles();
  const gitopsEvents = data.events.filter(event =>
    event.source === 'ArgoCD' || event.source === 'GitOps' || event.type === 'deployment' || event.type === 'config' || event.type === 'upgrade'
  );
  const releaseEvents = gitopsEvents.filter(event => event.type === 'deployment' || event.type === 'upgrade');
  const syncIssues = gitopsEvents.filter(event => /fail|error|drift|degraded/i.test(event.message)).length;
  const managedAppCount = Math.max(1, Math.min(6, data.addons.length - 1));
  const managedApps = [
    {
      app: `${(data.addons[0] || 'platform').replace(/-/g, ' ')}`,
      sync: 'Synced',
      health: 'Healthy',
      revision: 'main@a1f9d2c',
      updated: '8m ago',
    },
    {
      app: `${(data.addons[1] || 'security').replace(/-/g, ' ')}`,
      sync: 'Synced',
      health: 'Healthy',
      revision: 'main@6c4b12e',
      updated: '22m ago',
    },
    {
      app: `${(data.addons[2] || 'observability').replace(/-/g, ' ')}`,
      sync: syncIssues > 0 ? 'OutOfSync' : 'Synced',
      health: syncIssues > 0 ? 'Progressing' : 'Healthy',
      revision: 'main@9de31fa',
      updated: '47m ago',
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 0 }}>
          <Box display="flex" alignItems="center" gridGap={8}>
            <AccountTreeIcon color="primary" /> GitOps & ArgoCD Delivery
          </Box>
        </Typography>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Card className={classes.gitopsMiniCard}>
          <CardContent style={{ textAlign: 'center' }}>
            <Typography variant="overline" color="textSecondary">Managed Apps</Typography>
            <Typography className={classes.metricValue} style={{ color: '#1976D2' }}>{managedAppCount}</Typography>
            <Typography variant="caption" color="textSecondary">ArgoCD application sets</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card className={classes.gitopsMiniCard}>
          <CardContent style={{ textAlign: 'center' }}>
            <Typography variant="overline" color="textSecondary">Sync Health</Typography>
            <Typography className={classes.metricValue} style={{ color: syncIssues > 0 ? '#FF9800' : '#43A047' }}>
              {syncIssues > 0 ? `${syncIssues} issue${syncIssues > 1 ? 's' : ''}` : 'Stable'}
            </Typography>
            <Typography variant="caption" color="textSecondary">drift and sync status</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card className={classes.gitopsMiniCard}>
          <CardContent style={{ textAlign: 'center' }}>
            <Typography variant="overline" color="textSecondary">Recent Releases</Typography>
            <Typography className={classes.metricValue} style={{ color: '#7B1FA2' }}>{releaseEvents.length}</Typography>
            <Typography variant="caption" color="textSecondary">Git-driven deploy events</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card style={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 0 }}>
              ArgoCD Applications
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Application</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Sync</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Health</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Revision</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {managedApps.map((application, index) => (
                    <TableRow key={`${application.app}-${index}`} hover>
                      <TableCell>
                        <Typography variant="body2" style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                          {application.app}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={application.sync}
                          style={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            backgroundColor: application.sync === 'Synced' ? '#E8F5E9' : '#FFF3E0',
                            color: application.sync === 'Synced' ? '#2E7D32' : '#E65100',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={application.health}
                          style={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            backgroundColor: application.health === 'Healthy' ? '#E3F2FD' : '#FFF8E1',
                            color: application.health === 'Healthy' ? '#1565C0' : '#F57F17',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {application.revision}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="textSecondary">{application.updated}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card style={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 0 }}>
              GitOps Event Stream
            </Typography>
            {gitopsEvents.length === 0 ? (
              <Box py={3} textAlign="center">
                <InfoIcon style={{ color: '#9E9E9E', fontSize: 40 }} />
                <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                  No GitOps events recorded for this cluster
                </Typography>
              </Box>
            ) : (
              <List dense disablePadding>
                {gitopsEvents.slice(0, 8).map((event, index) => (
                  <ListItem key={`${event.message}-${index}`} className={classes.gitopsTimelineItem}>
                    <ListItemIcon style={{ minWidth: 32 }}>
                      {event.type === 'deployment' || event.type === 'upgrade' ? (
                        <UpdateIcon style={{ color: '#1976D2', fontSize: 18 }} />
                      ) : event.type === 'config' ? (
                        <SettingsIcon style={{ color: '#7B1FA2', fontSize: 18 }} />
                      ) : (
                        <InfoIcon style={{ color: '#9E9E9E', fontSize: 18 }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="body2" style={{ fontWeight: 500 }}>{event.message}</Typography>}
                      secondary={`${event.time} — ${event.source}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// ---- Alerts Tab ----
const AlertsTab = ({ data }: { data: ClusterDetail }) => {
  const classes = useStyles();
  const [alertFilter, setAlertFilter] = useState<string>('all');

  const severityIcon = (sev: string) =>
    sev === 'critical' ? <ErrorIcon style={{ color: '#F44336' }} /> :
    sev === 'warning' ? <WarningIcon style={{ color: '#FF9800' }} /> :
    <InfoIcon style={{ color: '#2196F3' }} />;

  const eventIcon = (type: string) =>
    type === 'security' ? <SecurityIcon style={{ color: '#FF9800', fontSize: 20 }} /> :
    type === 'deployment' ? <UpdateIcon style={{ color: '#1976D2', fontSize: 20 }} /> :
    type === 'scaling' ? <TrendingUpIcon style={{ color: '#4CAF50', fontSize: 20 }} /> :
    type === 'config' ? <SettingsIcon style={{ color: '#7B1FA2', fontSize: 20 }} /> :
    type === 'upgrade' ? <SpeedIcon style={{ color: '#00796B', fontSize: 20 }} /> :
    <InfoIcon style={{ color: '#9E9E9E', fontSize: 20 }} />;

  const filteredAlerts = alertFilter === 'all'
    ? data.alerts
    : data.alerts.filter(a => a.severity === alertFilter);

  const criticalCount = data.alerts.filter(a => a.severity === 'critical').length;
  const warningCount = data.alerts.filter(a => a.severity === 'warning').length;
  const infoCount = data.alerts.filter(a => a.severity === 'info').length;

  return (
    <Grid container spacing={3}>
      {/* Alert Summary Cards */}
      <Grid item xs={4}>
        <Card style={{ borderTop: '4px solid #F44336' }}>
          <CardContent style={{ textAlign: 'center', padding: 16 }}>
            <ErrorIcon style={{ color: '#F44336', fontSize: 32 }} />
            <Typography className={classes.metricValue} style={{ color: '#F44336' }}>
              {criticalCount}
            </Typography>
            <Typography className={classes.metricLabel}>Critical</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card style={{ borderTop: '4px solid #FF9800' }}>
          <CardContent style={{ textAlign: 'center', padding: 16 }}>
            <WarningIcon style={{ color: '#FF9800', fontSize: 32 }} />
            <Typography className={classes.metricValue} style={{ color: '#FF9800' }}>
              {warningCount}
            </Typography>
            <Typography className={classes.metricLabel}>Warning</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card style={{ borderTop: '4px solid #2196F3' }}>
          <CardContent style={{ textAlign: 'center', padding: 16 }}>
            <InfoIcon style={{ color: '#2196F3', fontSize: 32 }} />
            <Typography className={classes.metricValue} style={{ color: '#2196F3' }}>
              {infoCount}
            </Typography>
            <Typography className={classes.metricLabel}>Info</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Active Alerts */}
      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 0 }}>
                <Box display="flex" alignItems="center" gridGap={8}>
                  <NotificationsIcon color="action" /> Active Alerts
                </Box>
              </Typography>
              <Box display="flex" gridGap={4}>
                {['all', 'critical', 'warning', 'info'].map(sev => (
                  <Chip
                    key={sev}
                    size="small"
                    label={sev === 'all' ? 'All' : sev.charAt(0).toUpperCase() + sev.slice(1)}
                    variant={alertFilter === sev ? 'default' : 'outlined'}
                    onClick={() => setAlertFilter(sev)}
                    style={{
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      ...(alertFilter === sev ? {
                        backgroundColor: sev === 'critical' ? '#F44336' : sev === 'warning' ? '#FF9800' : sev === 'info' ? '#2196F3' : '#1976D2',
                        color: '#fff',
                      } : {}),
                    }}
                  />
                ))}
              </Box>
            </Box>

            {filteredAlerts.length === 0 ? (
              <Box py={4} textAlign="center">
                <CheckCircleIcon style={{ color: '#4CAF50', fontSize: 56 }} />
                <Typography variant="h6" style={{ marginTop: 12, color: '#4CAF50', fontWeight: 600 }}>
                  All Clear
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  No {alertFilter !== 'all' ? alertFilter + ' ' : ''}alerts at this time
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: 36 }} />
                      <TableCell style={{ fontWeight: 600 }}>Alert</TableCell>
                      <TableCell style={{ fontWeight: 600, width: 100 }}>Source</TableCell>
                      <TableCell style={{ fontWeight: 600, width: 100 }}>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAlerts.map((alert, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{severityIcon(alert.severity)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" style={{ fontWeight: 500 }}>{alert.message}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label={alert.source} variant="outlined"
                            style={{ fontSize: '0.65rem', height: 20 }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="textSecondary">{alert.time}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Events Timeline */}
      <Grid item xs={12} md={5}>
        <Card style={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 0 }}>
              <Box display="flex" alignItems="center" gridGap={8}>
                <ScheduleIcon color="action" /> Event Timeline
              </Box>
            </Typography>
            {data.events.length === 0 ? (
              <Box py={3} textAlign="center">
                <Typography variant="body2" color="textSecondary">No recent events</Typography>
              </Box>
            ) : (
              <List dense disablePadding>
                {data.events.map((ev, i) => (
                  <ListItem
                    key={i}
                    style={{
                      borderLeft: `3px solid ${ev.type === 'security' ? '#FF9800' : ev.type === 'deployment' ? '#1976D2' : ev.type === 'scaling' ? '#4CAF50' : ev.type === 'upgrade' ? '#00796B' : '#9E9E9E'}`,
                      marginBottom: 6,
                      paddingLeft: 12,
                      borderRadius: '0 4px 4px 0',
                    }}
                  >
                    <ListItemIcon style={{ minWidth: 32 }}>
                      {eventIcon(ev.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" style={{ fontWeight: 500, fontSize: '0.85rem' }}>
                          {ev.message}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="textSecondary">
                          {ev.time} — {ev.source}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Alert Rules / Configuration */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle} style={{ marginTop: 0 }}>
              <Box display="flex" alignItems="center" gridGap={8}>
                <AssessmentIcon color="action" /> Alert Rules
              </Box>
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Rule Name</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Condition</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Severity</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Last Triggered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { name: 'High CPU Usage', condition: 'Node CPU > 80% for 5m', severity: 'warning', status: data.cpu > 80 ? 'Firing' : 'OK', lastTriggered: data.cpu > 80 ? 'Now' : '3 days ago' },
                    { name: 'High Memory Usage', condition: 'Node Memory > 85% for 5m', severity: 'warning', status: data.memory > 85 ? 'Firing' : 'OK', lastTriggered: data.memory > 85 ? 'Now' : '1 week ago' },
                    { name: 'Pod CrashLoopBackOff', condition: 'Pod restart count > 5 in 10m', severity: 'critical', status: 'OK', lastTriggered: '2 weeks ago' },
                    { name: 'etcd Latency', condition: 'etcd P99 latency > 10ms', severity: 'critical', status: data.etcdLatency > 10 ? 'Firing' : 'OK', lastTriggered: data.etcdLatency > 10 ? 'Now' : 'Never' },
                    { name: 'PVC Capacity', condition: 'PVC usage > 85%', severity: 'warning', status: 'OK', lastTriggered: '5 days ago' },
                    { name: 'API Server Errors', condition: 'API 5xx rate > 1%', severity: 'critical', status: 'OK', lastTriggered: '1 month ago' },
                    { name: 'Certificate Expiry', condition: 'TLS cert expires in < 30d', severity: 'warning', status: data.securityScore < 80 ? 'Firing' : 'OK', lastTriggered: data.securityScore < 80 ? '1 day ago' : '2 months ago' },
                    { name: 'Security Score Drop', condition: 'Security score < 70', severity: 'critical', status: data.securityScore < 70 ? 'Firing' : 'OK', lastTriggered: data.securityScore < 70 ? 'Now' : 'Never' },
                  ].map((rule, i) => (
                    <TableRow key={i} hover>
                      <TableCell>
                        <Typography variant="body2" style={{ fontWeight: 500 }}>{rule.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {rule.condition}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={rule.severity.toUpperCase()}
                          className={classes.severityChip}
                          style={{
                            backgroundColor: rule.severity === 'critical' ? '#FFEBEE' : '#FFF3E0',
                            color: rule.severity === 'critical' ? '#C62828' : '#E65100',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={rule.status}
                          style={{
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            backgroundColor: rule.status === 'Firing' ? '#F44336' : '#E8F5E9',
                            color: rule.status === 'Firing' ? '#fff' : '#2E7D32',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="textSecondary">{rule.lastTriggered}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export const ClusterDetailPage = () => {
  const classes = useStyles();
  const { name } = useParams<{ name: string }>();
  const catalogApi = useApi(catalogApiRef);
  const [entity, setEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await catalogApi.getEntities({
          filter: [
            {
              kind: 'Resource',
              'metadata.name': name || '',
            },
          ],
        });
        setEntity(response.items[0] || null);
      } catch {
        setEntity(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [catalogApi, name]);

  const data = clusterDetailsData[name || ''] || defaultClusterDetail;
  const csp = entity?.metadata?.annotations?.['morgan-stanley.com/csp'] || 'unknown';
  const env = entity?.metadata?.annotations?.['morgan-stanley.com/environment'] || '';
  const gitopsEventCount = data.events.filter(event => event.source === 'ArgoCD' || event.source === 'GitOps').length;

  if (loading) {
    return (
      <Page themeId="tool">
        <Header title="Loading..." />
        <Content><LinearProgress /></Content>
      </Page>
    );
  }

  if (!entity) {
    return (
      <Page themeId="tool">
        <Header title="Cluster Not Found" />
        <Content>
          <Box py={4} textAlign="center">
            <Typography variant="h6">Cluster "{name}" not found</Typography>
            <Button component={Link} to="/clusters" variant="outlined" color="primary" style={{ marginTop: 16 }}>
              Back to Clusters
            </Button>
          </Box>
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="tool">
      <Header
        title={name || 'Cluster'}
        subtitle={
          <HeaderBannerLogos layout="clusterDetail">
            <Box display="flex" alignItems="center" gridGap={8}>
              <Chip size="small" label={csp.toUpperCase()}
                style={{ fontWeight: 600, backgroundColor: csp === 'azure' ? '#0078D4' : csp === 'aws' ? '#FF9900' : '#34A853', color: '#fff' }} />
              <Chip size="small" label={env} variant="outlined"
                style={{ fontWeight: 600,
                  borderColor: env === 'production' ? '#F44336' : env === 'staging' ? '#FF9800' : '#4CAF50',
                  color: env === 'production' ? '#F44336' : env === 'staging' ? '#FF9800' : '#4CAF50' }} />
              <Typography variant="body2" style={{ color: '#fff', opacity: 0.8 }}>
                {entity.metadata.description as string}
              </Typography>
            </Box>
          </HeaderBannerLogos>
        }
      />
      <Content>
        <Link to="/clusters" className={classes.backLink}>
          <ArrowBackIcon fontSize="small" /> Back to Clusters
        </Link>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabBar}
        >
          <Tab className={classes.tabItem} label="Overview" />
          <Tab className={classes.tabItem} label="Security" />
          <Tab className={classes.tabItem} label="Monitoring" />
          <Tab className={classes.tabItem} label="Cost" />
          <Tab className={classes.tabItem} label="Insights" />
          <Tab
            className={classes.tabItem}
            label={
              <Box display="flex" alignItems="center" gridGap={4}>
                <AccountTreeIcon style={{ fontSize: 18 }} /> GitOps
                {gitopsEventCount > 0 && (
                  <Chip
                    size="small"
                    label={gitopsEventCount}
                    style={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: '#1976D2',
                      color: '#fff',
                      marginLeft: 2,
                    }}
                  />
                )}
              </Box>
            }
          />
          <Tab className={classes.tabItem} label={<Box display="flex" alignItems="center" gridGap={4}><NotificationsIcon style={{ fontSize: 18 }} /> Alerts {data.alerts.length > 0 && <Chip size="small" label={data.alerts.length} style={{ height: 18, fontSize: '0.65rem', fontWeight: 700, backgroundColor: data.alerts.some(a => a.severity === 'critical') ? '#F44336' : '#FF9800', color: '#fff', marginLeft: 2 }} />}</Box>} />
        </Tabs>

        {tab === 0 && <OverviewTab data={data} entity={entity} />}
        {tab === 1 && <SecurityTab data={data} />}
        {tab === 2 && <MonitoringTab data={data} />}
        {tab === 3 && <CostTab data={data} />}
        {tab === 4 && <InsightsTab data={data} />}
        {tab === 5 && <GitOpsTab data={data} />}
        {tab === 6 && <AlertsTab data={data} />}
      </Content>
    </Page>
  );
};
