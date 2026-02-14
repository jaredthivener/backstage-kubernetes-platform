import { useState, useMemo } from 'react';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  makeStyles,
  Box,
  Tabs,
  Tab,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tooltip,
} from '@material-ui/core';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import StorageIcon from '@material-ui/icons/Storage';
import CloudIcon from '@material-ui/icons/Cloud';
import SpeedIcon from '@material-ui/icons/Speed';
import ScheduleIcon from '@material-ui/icons/Schedule';
import WarningIcon from '@material-ui/icons/Warning';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useStyles = makeStyles(theme => ({
  metricCard: {
    textAlign: 'center' as const,
    height: '100%',
    borderRadius: 12,
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginTop: 4,
  },
  filterBar: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  filterSelect: {
    minWidth: 150,
  },
  histogramContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 2,
    height: 200,
    padding: theme.spacing(2, 0),
  },
  histogramBar: {
    flex: 1,
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
    position: 'relative' as const,
    '&:hover': {
      opacity: 0.85,
    },
  },
  histogramLabel: {
    fontSize: '0.6rem',
    color: theme.palette.text.secondary,
    textAlign: 'center' as const,
    marginTop: 4,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  costBar: {
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  clusterRow: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tabBar: {
    marginBottom: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(1),
  },
  savingsCard: {
    borderLeft: `4px solid #4CAF50`,
    marginBottom: theme.spacing(1.5),
  },
  cspChip: {
    fontWeight: 600,
    fontSize: '0.7rem',
    color: '#fff',
  },
}));

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ClusterCost {
  name: string;
  csp: string;
  environment: string;
  region: string;
  nodeCount: number;
  monthlyCost: number;
  costTrend: number;
  dailyCosts: number[];
  computeCost: number;
  storageCost: number;
  networkCost: number;
  otherCost: number;
}

interface NodepoolCost {
  name: string;
  cluster: string;
  csp: string;
  instanceType: string;
  nodeCount: number;
  monthlyCost: number;
  costTrend: number;
  cpuUtilization: number;
  memUtilization: number;
  role: string;
  dailyCosts: number[];
}

interface NamespaceCost {
  namespace: string;
  cluster: string;
  csp: string;
  environment: string;
  monthlyCost: number;
  costTrend: number;
  cpuRequested: number;
  cpuUsed: number;
  memRequested: number;
  memUsed: number;
  podCount: number;
  owner: string;
  dailyCosts: number[];
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------
const genDailyCosts = (base: number, variance: number, days: number): number[] =>
  Array.from({ length: days }, () => Math.round(base + (Math.random() - 0.5) * variance));

const clusterCosts: ClusterCost[] = [
  {
    name: 'prod-trading-aks', csp: 'azure', environment: 'production', region: 'eastus',
    nodeCount: 12, monthlyCost: 8420, costTrend: 3.2,
    dailyCosts: genDailyCosts(280, 30, 30),
    computeCost: 5894, storageCost: 1263, networkCost: 842, otherCost: 421,
  },
  {
    name: 'prod-analytics-eks', csp: 'aws', environment: 'production', region: 'us-east-1',
    nodeCount: 24, monthlyCost: 14200, costTrend: 5.1,
    dailyCosts: genDailyCosts(473, 40, 30),
    computeCost: 9940, storageCost: 2130, networkCost: 1420, otherCost: 710,
  },
  {
    name: 'prod-risk-gke', csp: 'gcp', environment: 'production', region: 'us-central1',
    nodeCount: 8, monthlyCost: 6340, costTrend: -1.8,
    dailyCosts: genDailyCosts(211, 20, 30),
    computeCost: 4438, storageCost: 951, networkCost: 634, otherCost: 317,
  },
  {
    name: 'staging-risk-eks', csp: 'aws', environment: 'staging', region: 'us-west-2',
    nodeCount: 6, monthlyCost: 3180, costTrend: 0.5,
    dailyCosts: genDailyCosts(106, 12, 30),
    computeCost: 2226, storageCost: 477, networkCost: 318, otherCost: 159,
  },
  {
    name: 'dev-sandbox-aks', csp: 'azure', environment: 'development', region: 'westus2',
    nodeCount: 4, monthlyCost: 1240, costTrend: -2.3,
    dailyCosts: genDailyCosts(41, 8, 30),
    computeCost: 868, storageCost: 186, networkCost: 124, otherCost: 62,
  },
  {
    name: 'dev-ml-gke', csp: 'gcp', environment: 'development', region: 'europe-west1',
    nodeCount: 6, monthlyCost: 4560, costTrend: 8.7,
    dailyCosts: genDailyCosts(152, 25, 30),
    computeCost: 3192, storageCost: 684, networkCost: 456, otherCost: 228,
  },
];

const nodepoolCosts: NodepoolCost[] = [
  // prod-trading-aks
  { name: 'nodepool-workers', cluster: 'prod-trading-aks', csp: 'azure', instanceType: 'Standard_D8s_v5', nodeCount: 10, monthlyCost: 6580, costTrend: 2.5, cpuUtilization: 72, memUtilization: 68, role: 'worker', dailyCosts: genDailyCosts(219, 20, 30) },
  { name: 'nodepool-system', cluster: 'prod-trading-aks', csp: 'azure', instanceType: 'Standard_D4s_v5', nodeCount: 2, monthlyCost: 1840, costTrend: 1.0, cpuUtilization: 45, memUtilization: 52, role: 'system', dailyCosts: genDailyCosts(61, 8, 30) },
  // prod-analytics-eks
  { name: 'workers', cluster: 'prod-analytics-eks', csp: 'aws', instanceType: 'r6i.2xlarge', nodeCount: 16, monthlyCost: 8520, costTrend: 4.2, cpuUtilization: 85, memUtilization: 78, role: 'worker', dailyCosts: genDailyCosts(284, 25, 30) },
  { name: 'gpu-pool', cluster: 'prod-analytics-eks', csp: 'aws', instanceType: 'p3.2xlarge', nodeCount: 4, monthlyCost: 4320, costTrend: 8.0, cpuUtilization: 90, memUtilization: 82, role: 'gpu', dailyCosts: genDailyCosts(144, 20, 30) },
  { name: 'system', cluster: 'prod-analytics-eks', csp: 'aws', instanceType: 'm6i.xlarge', nodeCount: 4, monthlyCost: 1360, costTrend: 0.0, cpuUtilization: 30, memUtilization: 45, role: 'system', dailyCosts: genDailyCosts(45, 5, 30) },
  // prod-risk-gke
  { name: 'default-pool', cluster: 'prod-risk-gke', csp: 'gcp', instanceType: 'n2-standard-8', nodeCount: 6, monthlyCost: 4890, costTrend: -2.0, cpuUtilization: 61, memUtilization: 55, role: 'worker', dailyCosts: genDailyCosts(163, 15, 30) },
  { name: 'system-pool', cluster: 'prod-risk-gke', csp: 'gcp', instanceType: 'n2-standard-4', nodeCount: 2, monthlyCost: 1450, costTrend: 0.0, cpuUtilization: 35, memUtilization: 40, role: 'system', dailyCosts: genDailyCosts(48, 5, 30) },
  // staging-risk-eks
  { name: 'workers', cluster: 'staging-risk-eks', csp: 'aws', instanceType: 'm6i.xlarge', nodeCount: 4, monthlyCost: 2220, costTrend: 0.8, cpuUtilization: 34, memUtilization: 42, role: 'worker', dailyCosts: genDailyCosts(74, 10, 30) },
  { name: 'system', cluster: 'staging-risk-eks', csp: 'aws', instanceType: 'm6i.large', nodeCount: 2, monthlyCost: 960, costTrend: 0.0, cpuUtilization: 25, memUtilization: 35, role: 'system', dailyCosts: genDailyCosts(32, 4, 30) },
  // dev-sandbox-aks
  { name: 'dev-pool', cluster: 'dev-sandbox-aks', csp: 'azure', instanceType: 'Standard_D4s_v5', nodeCount: 3, monthlyCost: 920, costTrend: -3.0, cpuUtilization: 18, memUtilization: 22, role: 'worker', dailyCosts: genDailyCosts(31, 6, 30) },
  { name: 'system', cluster: 'dev-sandbox-aks', csp: 'azure', instanceType: 'Standard_D2s_v5', nodeCount: 1, monthlyCost: 320, costTrend: 0.0, cpuUtilization: 15, memUtilization: 20, role: 'system', dailyCosts: genDailyCosts(11, 2, 30) },
  // dev-ml-gke
  { name: 'gpu-training', cluster: 'dev-ml-gke', csp: 'gcp', instanceType: 'a2-highgpu-1g', nodeCount: 2, monthlyCost: 2640, costTrend: 12.0, cpuUtilization: 72, memUtilization: 78, role: 'gpu', dailyCosts: genDailyCosts(88, 18, 30) },
  { name: 'cpu-workers', cluster: 'dev-ml-gke', csp: 'gcp', instanceType: 'n2-standard-4', nodeCount: 2, monthlyCost: 1280, costTrend: 5.0, cpuUtilization: 45, memUtilization: 50, role: 'worker', dailyCosts: genDailyCosts(43, 8, 30) },
  { name: 'system', cluster: 'dev-ml-gke', csp: 'gcp', instanceType: 'e2-standard-2', nodeCount: 2, monthlyCost: 640, costTrend: 0.0, cpuUtilization: 28, memUtilization: 35, role: 'system', dailyCosts: genDailyCosts(21, 3, 30) },
];

const namespaceCosts: NamespaceCost[] = [
  // prod-trading-aks
  { namespace: 'trading-engine', cluster: 'prod-trading-aks', csp: 'azure', environment: 'production', monthlyCost: 3200, costTrend: 4.1, cpuRequested: 32, cpuUsed: 24, memRequested: 64, memUsed: 48, podCount: 42, owner: 'equities-team', dailyCosts: genDailyCosts(107, 12, 30) },
  { namespace: 'market-data', cluster: 'prod-trading-aks', csp: 'azure', environment: 'production', monthlyCost: 2100, costTrend: 1.5, cpuRequested: 20, cpuUsed: 16, memRequested: 40, memUsed: 32, podCount: 28, owner: 'data-team', dailyCosts: genDailyCosts(70, 8, 30) },
  { namespace: 'order-mgmt', cluster: 'prod-trading-aks', csp: 'azure', environment: 'production', monthlyCost: 1500, costTrend: 2.0, cpuRequested: 16, cpuUsed: 10, memRequested: 32, memUsed: 20, podCount: 18, owner: 'trading-ops', dailyCosts: genDailyCosts(50, 6, 30) },
  { namespace: 'monitoring', cluster: 'prod-trading-aks', csp: 'azure', environment: 'production', monthlyCost: 840, costTrend: 0.5, cpuRequested: 8, cpuUsed: 6, memRequested: 16, memUsed: 12, podCount: 14, owner: 'platform-team', dailyCosts: genDailyCosts(28, 4, 30) },
  { namespace: 'kube-system', cluster: 'prod-trading-aks', csp: 'azure', environment: 'production', monthlyCost: 420, costTrend: 0.0, cpuRequested: 4, cpuUsed: 3, memRequested: 8, memUsed: 6, podCount: 12, owner: 'platform-team', dailyCosts: genDailyCosts(14, 2, 30) },
  // prod-analytics-eks
  { namespace: 'ml-pipeline', cluster: 'prod-analytics-eks', csp: 'aws', environment: 'production', monthlyCost: 4970, costTrend: 6.5, cpuRequested: 48, cpuUsed: 42, memRequested: 96, memUsed: 80, podCount: 56, owner: 'ml-team', dailyCosts: genDailyCosts(166, 18, 30) },
  { namespace: 'data-lake', cluster: 'prod-analytics-eks', csp: 'aws', environment: 'production', monthlyCost: 3550, costTrend: 3.0, cpuRequested: 32, cpuUsed: 28, memRequested: 64, memUsed: 56, podCount: 38, owner: 'data-team', dailyCosts: genDailyCosts(118, 14, 30) },
  { namespace: 'spark-jobs', cluster: 'prod-analytics-eks', csp: 'aws', environment: 'production', monthlyCost: 2840, costTrend: 8.0, cpuRequested: 24, cpuUsed: 22, memRequested: 80, memUsed: 72, podCount: 24, owner: 'analytics-team', dailyCosts: genDailyCosts(95, 15, 30) },
  { namespace: 'monitoring', cluster: 'prod-analytics-eks', csp: 'aws', environment: 'production', monthlyCost: 1420, costTrend: 1.0, cpuRequested: 12, cpuUsed: 8, memRequested: 24, memUsed: 16, podCount: 20, owner: 'platform-team', dailyCosts: genDailyCosts(47, 5, 30) },
  { namespace: 'kube-system', cluster: 'prod-analytics-eks', csp: 'aws', environment: 'production', monthlyCost: 710, costTrend: 0.0, cpuRequested: 6, cpuUsed: 4, memRequested: 12, memUsed: 8, podCount: 16, owner: 'platform-team', dailyCosts: genDailyCosts(24, 3, 30) },
  // prod-risk-gke
  { namespace: 'risk-engine', cluster: 'prod-risk-gke', csp: 'gcp', environment: 'production', monthlyCost: 2536, costTrend: -2.0, cpuRequested: 24, cpuUsed: 16, memRequested: 48, memUsed: 32, podCount: 22, owner: 'risk-team', dailyCosts: genDailyCosts(85, 10, 30) },
  { namespace: 'pricing', cluster: 'prod-risk-gke', csp: 'gcp', environment: 'production', monthlyCost: 1585, costTrend: -1.5, cpuRequested: 16, cpuUsed: 10, memRequested: 32, memUsed: 20, podCount: 16, owner: 'quant-team', dailyCosts: genDailyCosts(53, 6, 30) },
  { namespace: 'reporting', cluster: 'prod-risk-gke', csp: 'gcp', environment: 'production', monthlyCost: 951, costTrend: 0.0, cpuRequested: 8, cpuUsed: 5, memRequested: 16, memUsed: 10, podCount: 10, owner: 'risk-team', dailyCosts: genDailyCosts(32, 4, 30) },
  // staging-risk-eks
  { namespace: 'risk-staging', cluster: 'staging-risk-eks', csp: 'aws', environment: 'staging', monthlyCost: 1430, costTrend: 0.5, cpuRequested: 12, cpuUsed: 6, memRequested: 24, memUsed: 12, podCount: 14, owner: 'risk-team', dailyCosts: genDailyCosts(48, 6, 30) },
  { namespace: 'test-runner', cluster: 'staging-risk-eks', csp: 'aws', environment: 'staging', monthlyCost: 636, costTrend: 1.0, cpuRequested: 6, cpuUsed: 3, memRequested: 12, memUsed: 6, podCount: 8, owner: 'qa-team', dailyCosts: genDailyCosts(21, 4, 30) },
  { namespace: 'perf-test', cluster: 'staging-risk-eks', csp: 'aws', environment: 'staging', monthlyCost: 477, costTrend: -1.0, cpuRequested: 8, cpuUsed: 2, memRequested: 16, memUsed: 4, podCount: 4, owner: 'qa-team', dailyCosts: genDailyCosts(16, 4, 30) },
  // dev-sandbox-aks
  { namespace: 'sandbox', cluster: 'dev-sandbox-aks', csp: 'azure', environment: 'development', monthlyCost: 496, costTrend: -3.0, cpuRequested: 4, cpuUsed: 1, memRequested: 8, memUsed: 2, podCount: 6, owner: 'dev-team', dailyCosts: genDailyCosts(17, 4, 30) },
  { namespace: 'dev-tools', cluster: 'dev-sandbox-aks', csp: 'azure', environment: 'development', monthlyCost: 310, costTrend: 0.0, cpuRequested: 2, cpuUsed: 1, memRequested: 4, memUsed: 2, podCount: 5, owner: 'dev-team', dailyCosts: genDailyCosts(10, 2, 30) },
  // dev-ml-gke
  { namespace: 'ml-training', cluster: 'dev-ml-gke', csp: 'gcp', environment: 'development', monthlyCost: 2280, costTrend: 12.0, cpuRequested: 16, cpuUsed: 12, memRequested: 64, memUsed: 52, podCount: 10, owner: 'ml-team', dailyCosts: genDailyCosts(76, 16, 30) },
  { namespace: 'jupyter-hub', cluster: 'dev-ml-gke', csp: 'gcp', environment: 'development', monthlyCost: 912, costTrend: 5.0, cpuRequested: 8, cpuUsed: 4, memRequested: 32, memUsed: 16, podCount: 8, owner: 'ml-team', dailyCosts: genDailyCosts(30, 6, 30) },
  { namespace: 'model-serving', cluster: 'dev-ml-gke', csp: 'gcp', environment: 'development', monthlyCost: 684, costTrend: 4.0, cpuRequested: 6, cpuUsed: 3, memRequested: 16, memUsed: 8, podCount: 6, owner: 'ml-team', dailyCosts: genDailyCosts(23, 4, 30) },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const CspChip = ({ csp }: { csp: string }) => {
  const classes = useStyles();
  const bg = csp === 'azure' ? '#0078D4' : csp === 'aws' ? '#FF9900' : '#34A853';
  const textColor = csp === 'aws' ? '#232F3E' : '#fff';
  return <Chip size="small" label={csp.toUpperCase()} className={classes.cspChip} style={{ backgroundColor: bg, color: textColor }} />;
};

const EnvChip = ({ env }: { env: string }) => {
  const color = env === 'production' ? '#F44336' : env === 'staging' ? '#FF9800' : '#4CAF50';
  return <Chip size="small" label={env} variant="outlined" style={{ borderColor: color, color, fontWeight: 600, fontSize: '0.65rem', height: 20 }} />;
};

const TrendIndicator = ({ trend }: { trend: number }) => {
  if (trend === 0) return <Typography variant="body2" color="textSecondary">—</Typography>;
  const color = trend > 0 ? '#F44336' : '#4CAF50';
  const Icon = trend > 0 ? TrendingUpIcon : TrendingDownIcon;
  return (
    <Box display="flex" alignItems="center" gridGap={2} style={{ color }}>
      <Icon style={{ fontSize: 16 }} />
      <Typography variant="body2" style={{ fontWeight: 600, color }}>{trend > 0 ? '+' : ''}{trend}%</Typography>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Histogram Component
// ---------------------------------------------------------------------------
const CostHistogram = ({
  data,
  labels,
  color = '#1976D2',
  height = 200,
}: {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}) => {
  const classes = useStyles();
  const max = Math.max(...data, 1);

  return (
    <Box>
      <Box className={classes.histogramContainer} style={{ height }}>
        {data.map((value, i) => {
          const h = (value / max) * 100;
          return (
            <Tooltip key={i} title={`${labels[i]}: $${value.toLocaleString()}`}>
              <Box
                className={classes.histogramBar}
                style={{
                  height: `${h}%`,
                  backgroundColor: color,
                  opacity: 0.5 + (i / data.length) * 0.5,
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="caption" color="textSecondary">{labels[0]}</Typography>
        <Typography variant="caption" color="textSecondary">{labels[labels.length - 1]}</Typography>
      </Box>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Generate date labels
// ---------------------------------------------------------------------------
const generateDateLabels = (days: number): string[] => {
  const labels: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  return labels;
};

// ---------------------------------------------------------------------------
// Tab: Clusters
// ---------------------------------------------------------------------------
const ClustersTab = ({
  filteredClusters,
  timePeriod,
}: {
  filteredClusters: ClusterCost[];
  timePeriod: number;
}) => {
  const classes = useStyles();
  const totalCost = filteredClusters.reduce((s, c) => s + c.monthlyCost, 0);
  const labels = generateDateLabels(timePeriod);

  // Aggregate daily costs across filtered clusters
  const aggregatedDaily = Array.from({ length: timePeriod }, (_, i) =>
    filteredClusters.reduce((s, c) => s + (c.dailyCosts[i] ?? 0), 0),
  );

  const nsColors = ['#1976D2', '#7B1FA2', '#388E3C', '#F57C00', '#5D4037', '#607D8B'];

  return (
    <Grid container spacing={3}>
      {/* Histogram */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>
              Daily Spend — All Filtered Clusters ({timePeriod} days)
            </Typography>
            <CostHistogram data={aggregatedDaily} labels={labels} color="#1976D2" height={180} />
          </CardContent>
        </Card>
      </Grid>

      {/* Cluster table */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Cluster Cost Breakdown</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Cluster</TableCell>
                    <TableCell>CSP</TableCell>
                    <TableCell>Env</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>Nodes</TableCell>
                    <TableCell align="right">Compute</TableCell>
                    <TableCell align="right">Storage</TableCell>
                    <TableCell align="right">Network</TableCell>
                    <TableCell align="right">Monthly Total</TableCell>
                    <TableCell>Trend</TableCell>
                    <TableCell>% of Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClusters.sort((a, b) => b.monthlyCost - a.monthlyCost).map(cluster => {
                    const pct = Math.round((cluster.monthlyCost / totalCost) * 100);
                    return (
                      <TableRow key={cluster.name} className={classes.clusterRow} component={Link} to={`/clusters/${cluster.name}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}>
                        <TableCell>
                          <Typography variant="body2" style={{ fontWeight: 600 }}>{cluster.name}</Typography>
                        </TableCell>
                        <TableCell><CspChip csp={cluster.csp} /></TableCell>
                        <TableCell><EnvChip env={cluster.environment} /></TableCell>
                        <TableCell><Typography variant="body2">{cluster.region}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{cluster.nodeCount}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2">${cluster.computeCost.toLocaleString()}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2">${cluster.storageCost.toLocaleString()}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2">${cluster.networkCost.toLocaleString()}</Typography></TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" style={{ fontWeight: 700 }}>${cluster.monthlyCost.toLocaleString()}</Typography>
                        </TableCell>
                        <TableCell><TrendIndicator trend={cluster.costTrend} /></TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gridGap={4}>
                            <LinearProgress variant="determinate" value={pct}
                              style={{ width: 60, height: 6, borderRadius: 3 }} />
                            <Typography variant="caption">{pct}%</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Cost category breakdown */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Cost by Category</Typography>
            {['Compute', 'Storage', 'Network', 'Other'].map((cat, i) => {
              const val = filteredClusters.reduce((s, c) =>
                s + (cat === 'Compute' ? c.computeCost : cat === 'Storage' ? c.storageCost : cat === 'Network' ? c.networkCost : c.otherCost), 0);
              const pct = Math.round((val / totalCost) * 100);
              return (
                <Box key={cat} mb={1.5}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" style={{ fontWeight: 500 }}>{cat}</Typography>
                    <Typography variant="body2" style={{ fontWeight: 600 }}>${val.toLocaleString()} ({pct}%)</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={pct} className={classes.costBar}
                    style={{ backgroundColor: `${nsColors[i]}22` }} />
                </Box>
              );
            })}
          </CardContent>
        </Card>
      </Grid>

      {/* Savings Opportunities */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Savings Opportunities</Typography>
            {filteredClusters
              .filter(c => c.costTrend > 5 || c.costTrend < -1 || c.nodeCount < 6)
              .slice(0, 4)
              .map(c => (
                <Card key={c.name} className={classes.savingsCard} variant="outlined">
                  <CardContent style={{ padding: '12px 16px' }}>
                    <Box display="flex" alignItems="center" gridGap={8} mb={0.5}>
                      {c.costTrend > 5 ? <WarningIcon style={{ color: '#FF9800', fontSize: 18 }} /> :
                       <SpeedIcon style={{ color: '#4CAF50', fontSize: 18 }} />}
                      <Typography variant="subtitle2" style={{ fontWeight: 600 }}>{c.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {c.costTrend > 5
                        ? `Cost trending +${c.costTrend}%. Review workloads for optimization opportunities.`
                        : c.nodeCount < 6
                        ? `Low node count (${c.nodeCount}). Consider spot/preemptible instances to save 30-60%.`
                        : `Cost trending ${c.costTrend}%. Good cost discipline — maintain current approach.`}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// ---------------------------------------------------------------------------
// Tab: Node Pools
// ---------------------------------------------------------------------------
const NodePoolsTab = ({
  filteredNodepools,
  timePeriod,
}: {
  filteredNodepools: NodepoolCost[];
  timePeriod: number;
}) => {
  const classes = useStyles();
  const labels = generateDateLabels(timePeriod);

  const aggregatedDaily = Array.from({ length: timePeriod }, (_, i) =>
    filteredNodepools.reduce((s, n) => s + (n.dailyCosts[i] ?? 0), 0),
  );

  const getBarColor = (v: number) => v > 80 ? '#F44336' : v > 60 ? '#FF9800' : '#4CAF50';

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>
              Daily Node Pool Spend ({timePeriod} days)
            </Typography>
            <CostHistogram data={aggregatedDaily} labels={labels} color="#7B1FA2" height={180} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Node Pool Cost Breakdown</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Node Pool</TableCell>
                    <TableCell>Cluster</TableCell>
                    <TableCell>CSP</TableCell>
                    <TableCell>Instance Type</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Nodes</TableCell>
                    <TableCell>CPU Util</TableCell>
                    <TableCell>Mem Util</TableCell>
                    <TableCell align="right">Monthly Cost</TableCell>
                    <TableCell>Trend</TableCell>
                    <TableCell>Efficiency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredNodepools.sort((a, b) => b.monthlyCost - a.monthlyCost).map(np => {
                    const efficiency = Math.round((np.cpuUtilization + np.memUtilization) / 2);
                    const effColor = efficiency > 70 ? '#4CAF50' : efficiency > 40 ? '#FF9800' : '#F44336';
                    return (
                      <TableRow key={`${np.cluster}-${np.name}`} hover>
                        <TableCell>
                          <Typography variant="body2" style={{ fontWeight: 600 }}>{np.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" component={Link} to={`/clusters/${np.cluster}`}
                            style={{ textDecoration: 'none', color: '#1976D2' }}>{np.cluster}</Typography>
                        </TableCell>
                        <TableCell><CspChip csp={np.csp} /></TableCell>
                        <TableCell>
                          <Typography variant="body2" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{np.instanceType}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label={np.role} variant="outlined"
                            style={np.role === 'gpu' ? { borderColor: '#9C27B0', color: '#9C27B0', fontWeight: 600, fontSize: '0.65rem' } :
                              { fontWeight: 500, fontSize: '0.65rem' }} />
                        </TableCell>
                        <TableCell><Typography variant="body2">{np.nodeCount}</Typography></TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gridGap={4}>
                            <LinearProgress variant="determinate" value={np.cpuUtilization}
                              style={{ width: 50, height: 6, borderRadius: 3, backgroundColor: `${getBarColor(np.cpuUtilization)}22` }} />
                            <Typography variant="caption">{np.cpuUtilization}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gridGap={4}>
                            <LinearProgress variant="determinate" value={np.memUtilization}
                              style={{ width: 50, height: 6, borderRadius: 3, backgroundColor: `${getBarColor(np.memUtilization)}22` }} />
                            <Typography variant="caption">{np.memUtilization}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" style={{ fontWeight: 700 }}>${np.monthlyCost.toLocaleString()}</Typography>
                        </TableCell>
                        <TableCell><TrendIndicator trend={np.costTrend} /></TableCell>
                        <TableCell>
                          <Chip size="small" label={`${efficiency}%`}
                            style={{ backgroundColor: `${effColor}22`, color: effColor, fontWeight: 700, fontSize: '0.7rem' }} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Under-utilized pools */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>
              <Box display="flex" alignItems="center" gridGap={8}>
                <ScheduleIcon color="action" /> Under-Utilized Node Pools
              </Box>
            </Typography>
            <Grid container spacing={2}>
              {filteredNodepools
                .filter(np => (np.cpuUtilization + np.memUtilization) / 2 < 40)
                .sort((a, b) => a.cpuUtilization - b.cpuUtilization)
                .map(np => {
                  const efficiency = Math.round((np.cpuUtilization + np.memUtilization) / 2);
                  const potentialSavings = Math.round(np.monthlyCost * (1 - efficiency / 100) * 0.6);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={`${np.cluster}-${np.name}`}>
                      <Card variant="outlined" className={classes.savingsCard}>
                        <CardContent style={{ padding: '12px 16px' }}>
                          <Typography variant="subtitle2" style={{ fontWeight: 600 }}>{np.name}</Typography>
                          <Typography variant="caption" color="textSecondary">{np.cluster}</Typography>
                          <Box display="flex" justifyContent="space-between" mt={1}>
                            <Typography variant="body2">CPU: {np.cpuUtilization}% | Mem: {np.memUtilization}%</Typography>
                          </Box>
                          <Typography variant="body2" style={{ color: '#4CAF50', fontWeight: 600, marginTop: 4 }}>
                            Potential savings: ~${potentialSavings.toLocaleString()}/mo
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// ---------------------------------------------------------------------------
// Tab: Namespaces
// ---------------------------------------------------------------------------
const NamespacesTab = ({
  filteredNamespaces,
  timePeriod,
}: {
  filteredNamespaces: NamespaceCost[];
  timePeriod: number;
}) => {
  const classes = useStyles();
  const labels = generateDateLabels(timePeriod);
  const totalCost = filteredNamespaces.reduce((s, n) => s + n.monthlyCost, 0);

  const aggregatedDaily = Array.from({ length: timePeriod }, (_, i) =>
    filteredNamespaces.reduce((s, n) => s + (n.dailyCosts[i] ?? 0), 0),
  );

  // Top spenders by owner
  const ownerCosts: Record<string, number> = {};
  filteredNamespaces.forEach(ns => {
    ownerCosts[ns.owner] = (ownerCosts[ns.owner] || 0) + ns.monthlyCost;
  });
  const ownerEntries = Object.entries(ownerCosts).sort((a, b) => b[1] - a[1]);
  const ownerColors = ['#1976D2', '#7B1FA2', '#388E3C', '#F57C00', '#5D4037', '#607D8B', '#E91E63', '#009688'];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>
              Daily Namespace Spend ({timePeriod} days)
            </Typography>
            <CostHistogram data={aggregatedDaily} labels={labels} color="#388E3C" height={180} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Namespace Cost Breakdown</Typography>
            <TableContainer style={{ maxHeight: 500 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Namespace</TableCell>
                    <TableCell>Cluster</TableCell>
                    <TableCell>CSP</TableCell>
                    <TableCell>Env</TableCell>
                    <TableCell>Pods</TableCell>
                    <TableCell>CPU Req / Used</TableCell>
                    <TableCell>Mem Req / Used</TableCell>
                    <TableCell align="right">Monthly Cost</TableCell>
                    <TableCell>Trend</TableCell>
                    <TableCell>Owner</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredNamespaces.sort((a, b) => b.monthlyCost - a.monthlyCost).map(ns => {
                    const cpuEff = Math.round((ns.cpuUsed / ns.cpuRequested) * 100);
                    const memEff = Math.round((ns.memUsed / ns.memRequested) * 100);
                    const cpuColor = cpuEff > 70 ? '#4CAF50' : cpuEff > 40 ? '#FF9800' : '#F44336';
                    const memColor = memEff > 70 ? '#4CAF50' : memEff > 40 ? '#FF9800' : '#F44336';
                    return (
                      <TableRow key={`${ns.cluster}-${ns.namespace}`} hover>
                        <TableCell>
                          <Typography variant="body2" style={{ fontWeight: 600 }}>{ns.namespace}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" component={Link} to={`/clusters/${ns.cluster}`}
                            style={{ textDecoration: 'none', color: '#1976D2', fontSize: '0.8rem' }}>{ns.cluster}</Typography>
                        </TableCell>
                        <TableCell><CspChip csp={ns.csp} /></TableCell>
                        <TableCell><EnvChip env={ns.environment} /></TableCell>
                        <TableCell><Typography variant="body2">{ns.podCount}</Typography></TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gridGap={4}>
                            <Typography variant="caption" style={{ color: cpuColor, fontWeight: 600 }}>{ns.cpuUsed}/{ns.cpuRequested}</Typography>
                            <Typography variant="caption" color="textSecondary">({cpuEff}%)</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gridGap={4}>
                            <Typography variant="caption" style={{ color: memColor, fontWeight: 600 }}>{ns.memUsed}/{ns.memRequested}Gi</Typography>
                            <Typography variant="caption" color="textSecondary">({memEff}%)</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" style={{ fontWeight: 700 }}>${ns.monthlyCost.toLocaleString()}</Typography>
                        </TableCell>
                        <TableCell><TrendIndicator trend={ns.costTrend} /></TableCell>
                        <TableCell>
                          <Chip size="small" label={ns.owner} variant="outlined" style={{ fontSize: '0.65rem', height: 20 }} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Cost by Owner */}
      <Grid item xs={12} md={4}>
        <Card style={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>Cost by Owner</Typography>
            {ownerEntries.map(([owner, cost], i) => {
              const pct = Math.round((cost / totalCost) * 100);
              return (
                <Box key={owner} mb={1.5}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" style={{ fontWeight: 500 }}>{owner}</Typography>
                    <Typography variant="body2" style={{ fontWeight: 600 }}>${cost.toLocaleString()} ({pct}%)</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={pct} className={classes.costBar}
                    style={{ backgroundColor: `${ownerColors[i % ownerColors.length]}22` }} />
                </Box>
              );
            })}
          </CardContent>
        </Card>
      </Grid>

      {/* Resource Waste */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" className={classes.sectionTitle}>
              <Box display="flex" alignItems="center" gridGap={8}>
                <WarningIcon style={{ color: '#FF9800' }} /> Resource Over-Provisioning
              </Box>
            </Typography>
            <Grid container spacing={2}>
              {filteredNamespaces
                .filter(ns => {
                  const cpuEff = (ns.cpuUsed / ns.cpuRequested) * 100;
                  return cpuEff < 50;
                })
                .sort((a, b) => (a.cpuUsed / a.cpuRequested) - (b.cpuUsed / b.cpuRequested))
                .slice(0, 6)
                .map(ns => {
                  const cpuEff = Math.round((ns.cpuUsed / ns.cpuRequested) * 100);
                  const wastedCost = Math.round(ns.monthlyCost * (1 - cpuEff / 100) * 0.5);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={`${ns.cluster}-${ns.namespace}`}>
                      <Card variant="outlined" className={classes.savingsCard}>
                        <CardContent style={{ padding: '12px 16px' }}>
                          <Typography variant="subtitle2" style={{ fontWeight: 600 }}>{ns.namespace}</Typography>
                          <Typography variant="caption" color="textSecondary">{ns.cluster} — {ns.owner}</Typography>
                          <Box mt={0.5}>
                            <Typography variant="body2">CPU efficiency: <span style={{ color: '#F44336', fontWeight: 600 }}>{cpuEff}%</span></Typography>
                            <Typography variant="body2" style={{ color: '#4CAF50', fontWeight: 600, marginTop: 2 }}>
                              Right-size to save ~${wastedCost.toLocaleString()}/mo
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// ---------------------------------------------------------------------------
// Main Cost Page
// ---------------------------------------------------------------------------
export const CostPage = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [cspFilter, setCspFilter] = useState<string>('all');
  const [envFilter, setEnvFilter] = useState<string>('all');
  const [clusterFilter, setClusterFilter] = useState<string>('all');
  const [timePeriod, setTimePeriod] = useState<number>(30);

  // Filtered data
  const filteredClusters = useMemo(() =>
    clusterCosts.filter(c =>
      (cspFilter === 'all' || c.csp === cspFilter) &&
      (envFilter === 'all' || c.environment === envFilter),
    ), [cspFilter, envFilter]);

  const filteredNodepools = useMemo(() =>
    nodepoolCosts.filter(np =>
      (cspFilter === 'all' || np.csp === cspFilter) &&
      (clusterFilter === 'all' || np.cluster === clusterFilter) &&
      (envFilter === 'all' || clusterCosts.find(c => c.name === np.cluster)?.environment === envFilter),
    ), [cspFilter, clusterFilter, envFilter]);

  const filteredNamespaces = useMemo(() =>
    namespaceCosts.filter(ns =>
      (cspFilter === 'all' || ns.csp === cspFilter) &&
      (envFilter === 'all' || ns.environment === envFilter) &&
      (clusterFilter === 'all' || ns.cluster === clusterFilter),
    ), [cspFilter, envFilter, clusterFilter]);

  // Summary stats
  const totalMonthlyCost = filteredClusters.reduce((s, c) => s + c.monthlyCost, 0);
  const totalNodes = filteredClusters.reduce((s, c) => s + c.nodeCount, 0);
  const avgTrend = filteredClusters.length > 0
    ? Number((filteredClusters.reduce((s, c) => s + c.costTrend, 0) / filteredClusters.length).toFixed(1))
    : 0;

  // Available clusters for cluster filter
  const availableClusters = filteredClusters.map(c => c.name);

  return (
    <Page themeId="tool">
      <Header
        title="Cost Management"
        subtitle={
          <HeaderBannerLogos layout="cost" text="Analyze and optimize Kubernetes spend across clusters, node pools, and namespaces" />
        }
      />
      <Content>
        {/* Summary Cards */}
        <Grid container spacing={2} style={{ marginBottom: 24 }}>
          <Grid item xs={6} sm={3}>
            <Card className={classes.metricCard}>
              <CardContent>
                <AttachMoneyIcon style={{ color: '#1976D2', fontSize: 28 }} />
                <Typography className={classes.metricValue} style={{ color: '#1976D2' }}>
                  ${totalMonthlyCost.toLocaleString()}
                </Typography>
                <Typography className={classes.metricLabel}>Monthly Spend</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card className={classes.metricCard}>
              <CardContent>
                <CloudIcon style={{ color: '#7B1FA2', fontSize: 28 }} />
                <Typography className={classes.metricValue} style={{ color: '#7B1FA2' }}>
                  {filteredClusters.length}
                </Typography>
                <Typography className={classes.metricLabel}>Clusters</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card className={classes.metricCard}>
              <CardContent>
                <StorageIcon style={{ color: '#388E3C', fontSize: 28 }} />
                <Typography className={classes.metricValue} style={{ color: '#388E3C' }}>
                  {totalNodes}
                </Typography>
                <Typography className={classes.metricLabel}>Total Nodes</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card className={classes.metricCard}>
              <CardContent>
                {avgTrend >= 0 ? (
                  <TrendingUpIcon style={{ color: '#F44336', fontSize: 28 }} />
                ) : (
                  <TrendingDownIcon style={{ color: '#4CAF50', fontSize: 28 }} />
                )}
                <Typography className={classes.metricValue}
                  style={{ color: avgTrend >= 0 ? '#F44336' : '#4CAF50' }}>
                  {avgTrend >= 0 ? '+' : ''}{avgTrend}%
                </Typography>
                <Typography className={classes.metricLabel}>Avg Cost Trend</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Box className={classes.filterBar}>
          <FormControl variant="outlined" size="small" className={classes.filterSelect}>
            <InputLabel>Cloud Provider</InputLabel>
            <Select value={cspFilter} onChange={e => setCspFilter(e.target.value as string)} label="Cloud Provider">
              <MenuItem value="all">All CSPs</MenuItem>
              <MenuItem value="azure">Azure (AKS)</MenuItem>
              <MenuItem value="aws">AWS (EKS)</MenuItem>
              <MenuItem value="gcp">GCP (GKE)</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" className={classes.filterSelect}>
            <InputLabel>Environment</InputLabel>
            <Select value={envFilter} onChange={e => setEnvFilter(e.target.value as string)} label="Environment">
              <MenuItem value="all">All Environments</MenuItem>
              <MenuItem value="production">Production</MenuItem>
              <MenuItem value="staging">Staging</MenuItem>
              <MenuItem value="development">Development</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" className={classes.filterSelect}>
            <InputLabel>Cluster</InputLabel>
            <Select value={clusterFilter} onChange={e => setClusterFilter(e.target.value as string)} label="Cluster">
              <MenuItem value="all">All Clusters</MenuItem>
              {availableClusters.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" className={classes.filterSelect}>
            <InputLabel>Time Period</InputLabel>
            <Select value={timePeriod} onChange={e => setTimePeriod(e.target.value as number)} label="Time Period">
              <MenuItem value={7}>Last 7 Days</MenuItem>
              <MenuItem value={14}>Last 14 Days</MenuItem>
              <MenuItem value={30}>Last 30 Days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabBar}
        >
          <Tab label="Clusters" icon={<CloudIcon style={{ fontSize: 18 }} />} />
          <Tab label="Node Pools" icon={<StorageIcon style={{ fontSize: 18 }} />} />
          <Tab label="Namespaces" icon={<SpeedIcon style={{ fontSize: 18 }} />} />
        </Tabs>

        {tab === 0 && <ClustersTab filteredClusters={filteredClusters} timePeriod={timePeriod} />}
        {tab === 1 && <NodePoolsTab filteredNodepools={filteredNodepools} timePeriod={timePeriod} />}
        {tab === 2 && <NamespacesTab filteredNamespaces={filteredNamespaces} timePeriod={timePeriod} />}
      </Content>
    </Page>
  );
};
