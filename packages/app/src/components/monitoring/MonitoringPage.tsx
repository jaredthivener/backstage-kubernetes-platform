import { useState } from 'react';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  makeStyles,
  Box,
  Paper,
  Divider,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Tooltip,
  Button,
} from '@material-ui/core';
import MemoryIcon from '@material-ui/icons/Memory';
import SpeedIcon from '@material-ui/icons/Speed';
import StorageIcon from '@material-ui/icons/Storage';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import TimerIcon from '@material-ui/icons/Timer';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import InfoIcon from '@material-ui/icons/Info';
import RefreshIcon from '@material-ui/icons/Refresh';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useStyles = makeStyles(theme => ({
  clusterSelector: {
    minWidth: 300,
    marginBottom: theme.spacing(3),
  },
  quickStatsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  statCard: {
    background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
    borderRadius: 12,
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
    },
  },
  metricCard: {
    borderRadius: 12,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.03) 100%)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  },
  metricCardGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    opacity: 0.1,
    borderRadius: '50%',
  },
  metricValue: {
    fontSize: '2.2rem',
    fontWeight: 700,
    lineHeight: 1,
  },
  metricLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  },
  metricTrend: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 2,
    fontSize: '0.75rem',
    fontWeight: 600,
    marginTop: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    borderRadius: 20,
    backgroundColor: theme.palette.action.hover,
  },
  trendUp: {
    color: '#F44336',
  },
  trendDown: {
    color: '#4CAF50',
  },
  trendFlat: {
    color: '#2196F3',
  },
  sparkline: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 2,
    height: 40,
    marginTop: theme.spacing(1),
  },
  sparkBar: {
    flex: 1,
    borderRadius: 2,
    transition: 'height 0.3s',
    minWidth: 4,
  },
  lineChart: {
    width: '100%',
    height: 80,
    marginTop: theme.spacing(1),
    position: 'relative',
  },
  gaugeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  gaugeRing: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  gaugeSvg: {
    transform: 'rotate(-90deg)',
  },
  gaugeText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  healthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  healthItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.action.hover,
    position: 'relative',
    overflow: 'hidden',
  },
  chartArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    opacity: 0.3,
  },
  timeseriesLine: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '100%',
    gap: 1,
    padding: '0 8px',
  },
  tabPanel: {
    paddingTop: theme.spacing(2),
  },
  azureChip: {
    backgroundColor: '#0078D4',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.7rem',
  },
  awsChip: {
    backgroundColor: '#FF9900',
    color: '#232F3E',
    fontWeight: 600,
    fontSize: '0.7rem',
  },
  gcpChip: {
    backgroundColor: '#34A853',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.7rem',
  },
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    borderRadius: 8,
    marginBottom: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.action.hover,
    },
  },
  insightCard: {
    background: 'linear-gradient(135deg, #FFF9C4 0%, #FFFDE7 100%)',
    borderLeft: `4px solid #FBC02D`,
    borderRadius: 8,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1.5),
    color: theme.palette.text.primary,
  },
}));

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ClusterMetrics {
  name: string;
  csp: string;
  cpuUsage: number;
  cpuCapacity: number;
  memoryUsage: number;
  memoryCapacity: number;
  podCount: number;
  podCapacity: number;
  nodeCount: number;
  networkIn: number;
  networkOut: number;
  apiLatencyP99: number;
  etcdLatency: number;
  cpuHistory: number[];
  memHistory: number[];
  podHistory: number[];
  componentHealth: {
    apiServer: 'healthy' | 'degraded' | 'down';
    etcd: 'healthy' | 'degraded' | 'down';
    scheduler: 'healthy' | 'degraded' | 'down';
    controllerManager: 'healthy' | 'degraded' | 'down';
    coreDns: 'healthy' | 'degraded' | 'down';
    ingressController: 'healthy' | 'degraded' | 'down';
    cni: 'healthy' | 'degraded' | 'down';
    csi: 'healthy' | 'degraded' | 'down';
  };
  alerts: { severity: 'critical' | 'warning' | 'info'; message: string; since: string }[];
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const genHistory = (base: number, variance: number, len = 24) =>
  Array.from({ length: len }, () => Math.max(0, base + (Math.random() - 0.5) * variance));

const clusterMetricsData: Record<string, ClusterMetrics> = {
  'prod-trading-aks': {
    name: 'prod-trading-aks', csp: 'azure',
    cpuUsage: 72, cpuCapacity: 100, memoryUsage: 68, memoryCapacity: 100,
    podCount: 234, podCapacity: 330, nodeCount: 12,
    networkIn: 4.2, networkOut: 2.8, apiLatencyP99: 145, etcdLatency: 12,
    cpuHistory: genHistory(72, 20), memHistory: genHistory(68, 15), podHistory: genHistory(234, 30),
    componentHealth: { apiServer: 'healthy', etcd: 'healthy', scheduler: 'healthy', controllerManager: 'healthy', coreDns: 'healthy', ingressController: 'healthy', cni: 'healthy', csi: 'healthy' },
    alerts: [
      { severity: 'warning', message: 'High CPU usage on node aks-pool1-vm03 (>85%)', since: '15 min ago' },
      { severity: 'info', message: 'HPA scaled deployment trading-api from 3 to 5 replicas', since: '30 min ago' },
    ],
  },
  'prod-settlement-aks': {
    name: 'prod-settlement-aks', csp: 'azure',
    cpuUsage: 45, cpuCapacity: 100, memoryUsage: 52, memoryCapacity: 100,
    podCount: 156, podCapacity: 220, nodeCount: 8,
    networkIn: 2.1, networkOut: 1.4, apiLatencyP99: 98, etcdLatency: 8,
    cpuHistory: genHistory(45, 15), memHistory: genHistory(52, 10), podHistory: genHistory(156, 20),
    componentHealth: { apiServer: 'healthy', etcd: 'healthy', scheduler: 'healthy', controllerManager: 'healthy', coreDns: 'healthy', ingressController: 'healthy', cni: 'healthy', csi: 'healthy' },
    alerts: [
      { severity: 'info', message: 'Scheduled maintenance window in 2 hours', since: '1 hour ago' },
    ],
  },
  'staging-risk-eks': {
    name: 'staging-risk-eks', csp: 'aws',
    cpuUsage: 58, cpuCapacity: 100, memoryUsage: 63, memoryCapacity: 100,
    podCount: 189, podCapacity: 275, nodeCount: 10,
    networkIn: 3.1, networkOut: 2.2, apiLatencyP99: 165, etcdLatency: 15,
    cpuHistory: genHistory(58, 25), memHistory: genHistory(63, 18), podHistory: genHistory(189, 25),
    componentHealth: { apiServer: 'healthy', etcd: 'degraded', scheduler: 'healthy', controllerManager: 'healthy', coreDns: 'healthy', ingressController: 'degraded', cni: 'healthy', csi: 'healthy' },
    alerts: [
      { severity: 'critical', message: 'etcd leader election latency >500ms', since: '5 min ago' },
      { severity: 'warning', message: 'Ingress controller pod restart count > 3 in last hour', since: '20 min ago' },
      { severity: 'warning', message: 'PVC pending in namespace risk-engine', since: '45 min ago' },
    ],
  },
  'prod-analytics-eks': {
    name: 'prod-analytics-eks', csp: 'aws',
    cpuUsage: 38, cpuCapacity: 100, memoryUsage: 71, memoryCapacity: 100,
    podCount: 203, podCapacity: 330, nodeCount: 11,
    networkIn: 5.6, networkOut: 3.9, apiLatencyP99: 112, etcdLatency: 9,
    cpuHistory: genHistory(38, 12), memHistory: genHistory(71, 10), podHistory: genHistory(203, 15),
    componentHealth: { apiServer: 'healthy', etcd: 'healthy', scheduler: 'healthy', controllerManager: 'healthy', coreDns: 'healthy', ingressController: 'healthy', cni: 'healthy', csi: 'healthy' },
    alerts: [
      { severity: 'warning', message: 'Memory utilization >70% on 3 nodes', since: '10 min ago' },
    ],
  },
  'dev-platform-gke': {
    name: 'dev-platform-gke', csp: 'gcp',
    cpuUsage: 29, cpuCapacity: 100, memoryUsage: 34, memoryCapacity: 100,
    podCount: 87, podCapacity: 165, nodeCount: 5,
    networkIn: 0.8, networkOut: 0.5, apiLatencyP99: 78, etcdLatency: 6,
    cpuHistory: genHistory(29, 10), memHistory: genHistory(34, 12), podHistory: genHistory(87, 15),
    componentHealth: { apiServer: 'healthy', etcd: 'healthy', scheduler: 'healthy', controllerManager: 'healthy', coreDns: 'healthy', ingressController: 'healthy', cni: 'healthy', csi: 'healthy' },
    alerts: [],
  },
  'staging-wealth-gke': {
    name: 'staging-wealth-gke', csp: 'gcp',
    cpuUsage: 51, cpuCapacity: 100, memoryUsage: 47, memoryCapacity: 100,
    podCount: 132, podCapacity: 220, nodeCount: 7,
    networkIn: 1.9, networkOut: 1.2, apiLatencyP99: 134, etcdLatency: 11,
    cpuHistory: genHistory(51, 18), memHistory: genHistory(47, 14), podHistory: genHistory(132, 20),
    componentHealth: { apiServer: 'healthy', etcd: 'healthy', scheduler: 'healthy', controllerManager: 'healthy', coreDns: 'degraded', ingressController: 'healthy', cni: 'healthy', csi: 'healthy' },
    alerts: [
      { severity: 'warning', message: 'CoreDNS latency >200ms for external queries', since: '8 min ago' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const CspChip = ({ csp }: { csp: string }) => {
  const classes = useStyles();
  const chipClass =
    csp === 'azure' ? classes.azureChip :
    csp === 'aws' ? classes.awsChip :
    csp === 'gcp' ? classes.gcpChip : undefined;
  return <Chip size="small" label={csp.toUpperCase()} className={chipClass} />;
};

const healthIcon = (status: string) => {
  if (status === 'healthy') return <CheckCircleIcon style={{ color: '#4CAF50', fontSize: 18 }} />;
  if (status === 'degraded') return <WarningIcon style={{ color: '#FF9800', fontSize: 18 }} />;
  return <ErrorIcon style={{ color: '#F44336', fontSize: 18 }} />;
};

const alertSeverityIcon = (sev: string) => {
  if (sev === 'critical') return <ErrorIcon style={{ color: '#F44336', fontSize: 20 }} />;
  if (sev === 'warning') return <WarningIcon style={{ color: '#FF9800', fontSize: 20 }} />;
  return <CheckCircleIcon style={{ color: '#2196F3', fontSize: 20 }} />;
};

const usageColor = (pct: number) =>
  pct >= 85 ? '#F44336' : pct >= 70 ? '#FF9800' : '#4CAF50';

// Calculate trend direction based on history data
const calculateTrend = (data: number[]) => {
  if (data.length < 2) return { direction: 'flat', change: 0 };
  const first = data.slice(0, 4).reduce((a, b) => a + b, 0) / 4;
  const last = data.slice(-4).reduce((a, b) => a + b, 0) / 4;
  const change = last - first;
  const direction = Math.abs(change) < 2 ? 'flat' : change > 0 ? 'up' : 'down';
  return { direction, change: Math.abs(Math.round(change)) };
};

const getTrendIcon = (direction: string) => {
  if (direction === 'up') return <TrendingUpIcon style={{ fontSize: 14 }} />;
  if (direction === 'down') return <TrendingDownIcon style={{ fontSize: 14 }} />;
  return <TrendingFlatIcon style={{ fontSize: 14 }} />;
};

// Generate insights based on metrics
const generateInsights = (metrics: ClusterMetrics) => {
  const insights: { message: string; severity: 'critical' | 'warning' | 'info' }[] = [];
  
  const cpuTrend = calculateTrend(metrics.cpuHistory);
  const podTrend = calculateTrend(metrics.podHistory);
  
  if (metrics.cpuUsage > 85) {
    insights.push({ message: '🔴 CPU usage is critical (>85%)', severity: 'critical' });
  } else if (metrics.cpuUsage > 75 && cpuTrend.direction === 'up') {
    insights.push({ message: '⚠️ CPU trending upward, consider scaling soon', severity: 'warning' });
  }
  
  if (metrics.memoryUsage > 85) {
    insights.push({ message: '🔴 Memory usage is critical (>85%)', severity: 'critical' });
  } else if (metrics.memoryUsage > 75) {
    insights.push({ message: '⚠️ Memory utilization is high', severity: 'warning' });
  }
  
  const podPct = Math.round((metrics.podCount / metrics.podCapacity) * 100);
  if (podPct > 85) {
    insights.push({ message: '🔴 Pod capacity nearly full (>85%)', severity: 'critical' });
  } else if (podPct > 70 && podTrend.direction === 'up') {
    insights.push({ message: '⚠️ Pod count growing, monitor capacity', severity: 'warning' });
  }
  
  if (metrics.componentHealth.etcd === 'degraded') {
    insights.push({ message: '⚠️ etcd performance degraded', severity: 'warning' });
  }
  
  const criticalAlerts = metrics.alerts.filter(a => a.severity === 'critical').length;
  if (criticalAlerts > 0) {
    insights.push({ message: `🔴 ${criticalAlerts} critical alert(s) require attention`, severity: 'critical' });
  }
  
  if (insights.length === 0 && metrics.alerts.length === 0) {
    insights.push({ message: '✅ Cluster running healthy, no immediate action needed', severity: 'info' });
  }
  
  return insights;
};

// ---------------------------------------------------------------------------
// Gauge Chart
// ---------------------------------------------------------------------------
const GaugeChart = ({ value, label, unit, color }: { value: number; label: string; unit: string; color: string }) => {
  const classes = useStyles();
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(value, 100);
  const offset = circumference - (percent / 100) * circumference;

  return (
    <Box textAlign="center">
      <Box className={classes.gaugeRing}>
        <svg width={120} height={120} className={classes.gaugeSvg}>
          <circle cx={60} cy={60} r={radius} fill="none" stroke="#e0e0e0" strokeWidth={10} />
          <circle
            cx={60} cy={60} r={radius} fill="none"
            stroke={color} strokeWidth={10}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <Box className={classes.gaugeText}>
          <Typography style={{ fontSize: '1.5rem', fontWeight: 700, color, lineHeight: 1 }}>
            {Math.round(value)}
          </Typography>
          <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.65rem' }}>
            {unit}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="textSecondary" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>
        {label}
      </Typography>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------
const Sparkline = ({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) => {
  const classes = useStyles();
  const max = Math.max(...data);
  return (
    <Box className={classes.sparkline} style={{ height }}>
      {data.map((val, i) => (
        <Box
          key={i}
          className={classes.sparkBar}
          style={{
            height: `${Math.max(4, (val / max) * 100)}%`,
            backgroundColor: color,
            opacity: i === data.length - 1 ? 1 : 0.5,
          }}
        />
      ))}
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Main Monitoring Page
// ---------------------------------------------------------------------------
export const MonitoringPage = () => {
  const classes = useStyles();
  const clusterNames = Object.keys(clusterMetricsData);
  const [selectedCluster, setSelectedCluster] = useState(clusterNames[0]);
  const [tabValue, setTabValue] = useState(0);
  const metrics = clusterMetricsData[selectedCluster];

  const cpuPct = metrics.cpuUsage;
  const memPct = metrics.memoryUsage;
  const podPct = Math.round((metrics.podCount / metrics.podCapacity) * 100);

  return (
    <Page themeId="tool">
      <Header
        title="Cluster Monitoring"
        subtitle={
          <HeaderBannerLogos layout="monitoring" text="Real-time metrics, health status, and alerts for your Kubernetes clusters" />
        }
      />
      <Content>
        {/* Cluster selector with refresh */}
        <Box display="flex" alignItems="center" style={{ gap: 16 }} mb={3} flexWrap="wrap">
          <FormControl variant="outlined" className={classes.clusterSelector} size="small">
            <InputLabel>Select Cluster</InputLabel>
            <Select
              value={selectedCluster}
              onChange={e => setSelectedCluster(e.target.value as string)}
              label="Select Cluster"
            >
              {clusterNames.map(name => (
                <MenuItem key={name} value={name}>
                  <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                    {name}
                    <CspChip csp={clusterMetricsData[name].csp} />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Nodes in cluster">
            <Chip label={`${metrics.nodeCount} nodes`} variant="outlined" size="small" style={{ fontWeight: 600 }} />
          </Tooltip>
          <Tooltip title="Running vs total pod capacity">
            <Chip label={`${metrics.podCount} / ${metrics.podCapacity} pods`} variant="outlined" size="small" style={{ fontWeight: 600 }} />
          </Tooltip>
          <Tooltip title="Refresh metrics">
            <Button size="small" variant="outlined" startIcon={<RefreshIcon />}>Refresh</Button>
          </Tooltip>
        </Box>

        {/* Quick Stats Bar */}
        <Box className={classes.quickStatsBar}>
          <Tooltip title="CPU usage across all nodes">
            <Box className={classes.statCard}>
              <SpeedIcon style={{ fontSize: 24, color: usageColor(cpuPct) }} />
              <Box flex={1}>
                <Typography variant="body2" style={{ fontWeight: 600 }}>CPU</Typography>
                <Box display="flex" alignItems="center" gridGap={8}>
                  <Typography style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cpuPct}%</Typography>
                  <Box className={classes.metricTrend} style={{ color: calculateTrend(metrics.cpuHistory).direction === 'up' ? '#F44336' : calculateTrend(metrics.cpuHistory).direction === 'down' ? '#4CAF50' : '#2196F3' }}>
                    {getTrendIcon(calculateTrend(metrics.cpuHistory).direction)}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Tooltip>
          <Tooltip title="Memory usage across cluster">
            <Box className={classes.statCard}>
              <MemoryIcon style={{ fontSize: 24, color: usageColor(memPct) }} />
              <Box flex={1}>
                <Typography variant="body2" style={{ fontWeight: 600 }}>Memory</Typography>
                <Box display="flex" alignItems="center" gridGap={8}>
                  <Typography style={{ fontSize: '1.1rem', fontWeight: 700 }}>{memPct}%</Typography>
                  <Box className={classes.metricTrend} style={{ color: calculateTrend(metrics.memHistory).direction === 'up' ? '#F44336' : calculateTrend(metrics.memHistory).direction === 'down' ? '#4CAF50' : '#2196F3' }}>
                    {getTrendIcon(calculateTrend(metrics.memHistory).direction)}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Tooltip>
          <Tooltip title="Running pods vs cluster capacity">
            <Box className={classes.statCard}>
              <StorageIcon style={{ fontSize: 24, color: usageColor(podPct) }} />
              <Box flex={1}>
                <Typography variant="body2" style={{ fontWeight: 600 }}>Pods</Typography>
                <Box display="flex" alignItems="center" gridGap={8}>
                  <Typography style={{ fontSize: '1.1rem', fontWeight: 700 }}>{podPct}%</Typography>
                  <Box className={classes.metricTrend} style={{ color: calculateTrend(metrics.podHistory).direction === 'up' ? '#F44336' : calculateTrend(metrics.podHistory).direction === 'down' ? '#4CAF50' : '#2196F3' }}>
                    {getTrendIcon(calculateTrend(metrics.podHistory).direction)}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Tooltip>
          <Tooltip title="Active alerts and issues">
            <Box className={classes.statCard}>
              <WarningIcon style={{ fontSize: 24, color: metrics.alerts.length > 0 ? '#F44336' : '#4CAF50' }} />
              <Box flex={1}>
                <Typography variant="body2" style={{ fontWeight: 600 }}>Alerts</Typography>
                <Typography style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {metrics.alerts.length === 0 ? 'None' : metrics.alerts.length}
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </Box>

        {/* Insights Section */}
        {generateInsights(metrics).length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" style={{ fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <InfoIcon style={{ fontSize: 18 }} /> Insights & Recommendations
            </Typography>
            {generateInsights(metrics).map((insight, idx) => (
              <Box key={idx} className={classes.insightCard} style={{
                backgroundColor: insight.severity === 'critical' ? '#FFEBEE' : insight.severity === 'warning' ? '#FFF3E0' : '#E3F2FD',
                borderLeftColor: insight.severity === 'critical' ? '#F44336' : insight.severity === 'warning' ? '#FF9800' : '#2196F3',
                color: '#1a1a1a',
              }}>
                <Typography variant="body2" style={{ flex: 1, lineHeight: 1.4 }}>{insight.message}</Typography>
              </Box>
            ))}
          </Box>
        )}

        <Paper variant="outlined" style={{ borderRadius: 12 }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Overview" />
            <Tab label="Resources" />
            <Tab label="Health" />
            <Tab label="Alerts" />
          </Tabs>
          <Divider />

          {/* Tab 0: Overview */}
          {tabValue === 0 && (
            <Box p={3}>
              {/* Resource Gauges */}
              <Grid container spacing={3} style={{ marginBottom: 24 }}>
                <Grid item xs={12} sm={4}>
                  <Card className={classes.metricCard} variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                          <SpeedIcon style={{ color: usageColor(cpuPct), fontSize: 20 }} />
                          <Typography variant="subtitle2" style={{ fontWeight: 600 }}>CPU Usage</Typography>
                        </Box>
                        <Box className={classes.metricTrend} style={{ color: calculateTrend(metrics.cpuHistory).direction === 'up' ? '#F44336' : calculateTrend(metrics.cpuHistory).direction === 'down' ? '#4CAF50' : '#2196F3' }}>
                          {getTrendIcon(calculateTrend(metrics.cpuHistory).direction)}
                          {calculateTrend(metrics.cpuHistory).direction === 'up' && `+${calculateTrend(metrics.cpuHistory).change}%`}
                          {calculateTrend(metrics.cpuHistory).direction === 'down' && `-${calculateTrend(metrics.cpuHistory).change}%`}
                          {calculateTrend(metrics.cpuHistory).direction === 'flat' && 'Stable'}
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography className={classes.metricValue} style={{ color: usageColor(cpuPct) }}>
                            {cpuPct}%
                          </Typography>
                          <Typography className={classes.metricLabel}>of cluster capacity</Typography>
                        </Box>
                        <GaugeChart value={cpuPct} label="" unit="%" color={usageColor(cpuPct)} />
                      </Box>
                      <Sparkline data={metrics.cpuHistory} color={usageColor(cpuPct)} />
                      <Typography variant="caption" color="textSecondary">Last 24 hours</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Card className={classes.metricCard} variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                          <MemoryIcon style={{ color: usageColor(memPct), fontSize: 20 }} />
                          <Typography variant="subtitle2" style={{ fontWeight: 600 }}>Memory Usage</Typography>
                        </Box>
                        <Box className={classes.metricTrend} style={{ color: calculateTrend(metrics.memHistory).direction === 'up' ? '#F44336' : calculateTrend(metrics.memHistory).direction === 'down' ? '#4CAF50' : '#2196F3' }}>
                          {getTrendIcon(calculateTrend(metrics.memHistory).direction)}
                          {calculateTrend(metrics.memHistory).direction === 'up' && `+${calculateTrend(metrics.memHistory).change}%`}
                          {calculateTrend(metrics.memHistory).direction === 'down' && `-${calculateTrend(metrics.memHistory).change}%`}
                          {calculateTrend(metrics.memHistory).direction === 'flat' && 'Stable'}
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography className={classes.metricValue} style={{ color: usageColor(memPct) }}>
                            {memPct}%
                          </Typography>
                          <Typography className={classes.metricLabel}>of cluster capacity</Typography>
                        </Box>
                        <GaugeChart value={memPct} label="" unit="%" color={usageColor(memPct)} />
                      </Box>
                      <Sparkline data={metrics.memHistory} color={usageColor(memPct)} />
                      <Typography variant="caption" color="textSecondary">Last 24 hours</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Card className={classes.metricCard} variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                          <StorageIcon style={{ color: usageColor(podPct), fontSize: 20 }} />
                          <Typography variant="subtitle2" style={{ fontWeight: 600 }}>Pod Usage</Typography>
                        </Box>
                        <Box className={classes.metricTrend} style={{ color: calculateTrend(metrics.podHistory).direction === 'up' ? '#F44336' : calculateTrend(metrics.podHistory).direction === 'down' ? '#4CAF50' : '#2196F3' }}>
                          {getTrendIcon(calculateTrend(metrics.podHistory).direction)}
                          {calculateTrend(metrics.podHistory).direction === 'up' && `+${calculateTrend(metrics.podHistory).change}`}
                          {calculateTrend(metrics.podHistory).direction === 'down' && `-${calculateTrend(metrics.podHistory).change}`}
                          {calculateTrend(metrics.podHistory).direction === 'flat' && 'Stable'}
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography className={classes.metricValue} style={{ color: usageColor(podPct) }}>
                            {metrics.podCount}
                          </Typography>
                          <Typography className={classes.metricLabel}>of {metrics.podCapacity} capacity</Typography>
                        </Box>
                        <GaugeChart value={podPct} label="" unit="pods" color={usageColor(podPct)} />
                      </Box>
                      <Sparkline data={metrics.podHistory} color={usageColor(podPct)} />
                      <Typography variant="caption" color="textSecondary">Last 24 hours</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Secondary metrics */}
              <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 16 }}>Network & Latency</Typography>
              <Grid container spacing={2} style={{ marginBottom: 24 }}>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined" className={classes.metricCard}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <NetworkCheckIcon style={{ color: '#2196F3', fontSize: 24 }} />
                      </Box>
                      <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Network In</Typography>
                      <Typography style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2196F3', marginTop: 8 }}>
                        {metrics.networkIn} Gbps
                      </Typography>
                      <LinearProgress variant="determinate" value={(metrics.networkIn / 10) * 100} style={{ borderRadius: 4, marginTop: 8 }} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined" className={classes.metricCard}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <NetworkCheckIcon style={{ color: '#9C27B0', fontSize: 24 }} />
                      </Box>
                      <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Network Out</Typography>
                      <Typography style={{ fontSize: '1.4rem', fontWeight: 700, color: '#9C27B0', marginTop: 8 }}>
                        {metrics.networkOut} Gbps
                      </Typography>
                      <LinearProgress variant="determinate" value={(metrics.networkOut / 10) * 100} style={{ borderRadius: 4, marginTop: 8 }} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined" className={classes.metricCard}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <TimerIcon style={{ color: metrics.apiLatencyP99 > 150 ? '#FF9800' : '#4CAF50', fontSize: 24 }} />
                      </Box>
                      <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>API P99 Latency</Typography>
                      <Typography style={{ fontSize: '1.4rem', fontWeight: 700, color: metrics.apiLatencyP99 > 150 ? '#FF9800' : '#4CAF50', marginTop: 8 }}>
                        {metrics.apiLatencyP99}ms
                      </Typography>
                      <LinearProgress variant="determinate" value={Math.min((metrics.apiLatencyP99 / 200) * 100, 100)} style={{ borderRadius: 4, marginTop: 8 }} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined" className={classes.metricCard}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <TimerIcon style={{ color: metrics.etcdLatency > 15 ? '#FF9800' : '#4CAF50', fontSize: 24 }} />
                      </Box>
                      <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>etcd Latency</Typography>
                      <Typography style={{ fontSize: '1.4rem', fontWeight: 700, color: metrics.etcdLatency > 15 ? '#FF9800' : '#4CAF50', marginTop: 8 }}>
                        {metrics.etcdLatency}ms
                      </Typography>
                      <LinearProgress variant="determinate" value={Math.min((metrics.etcdLatency / 30) * 100, 100)} style={{ borderRadius: 4, marginTop: 8 }} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Alerts summary */}
              {metrics.alerts.length > 0 && (
                <Card variant="outlined" style={{ borderRadius: 12 }}>
                  <CardHeader
                    title="Active Alerts"
                    titleTypographyProps={{ variant: 'subtitle1' }}
                    avatar={<WarningIcon style={{ color: '#FF9800' }} />}
                    action={<Chip size="small" label={`${metrics.alerts.length} active`} color="secondary" />}
                  />
                  <Divider />
                  <CardContent>
                    {metrics.alerts.map((alert, i) => (
                      <Box 
                        key={i} 
                        className={classes.alertItem}
                        style={{
                          borderLeft: `4px solid ${alert.severity === 'critical' ? '#F44336' : alert.severity === 'warning' ? '#FF9800' : '#2196F3'}`,
                          backgroundColor: alert.severity === 'critical' ? 'rgba(244, 67, 54, 0.02)' : alert.severity === 'warning' ? 'rgba(255, 152, 0, 0.02)' : 'rgba(33, 150, 243, 0.02)',
                        }}
                      >
                        {alertSeverityIcon(alert.severity)}
                        <Box flex={1}>
                          <Typography variant="body2" style={{ fontWeight: 600, fontSize: '0.95rem' }}>{alert.message}</Typography>
                          <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.8rem', marginTop: 2 }}>Since {alert.since}</Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={alert.severity.toUpperCase()}
                          style={{
                            fontWeight: 700,
                            fontSize: '0.6rem',
                            height: 22,
                            backgroundColor: alert.severity === 'critical' ? '#F44336' : alert.severity === 'warning' ? '#FF9800' : '#2196F3',
                            color: '#fff',
                          }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {/* Tab 1: Resources */}
          {tabValue === 1 && (
            <Box p={3}>
              <Typography variant="h6" gutterBottom>Resource Utilization Over Time</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" style={{ borderRadius: 12 }}>
                    <CardHeader title="CPU Utilization (%)" titleTypographyProps={{ variant: 'subtitle2' }} />
                    <Divider />
                    <CardContent>
                      <Box display="flex" alignItems="center" style={{ gap: 8 }} mb={1}>
                        <Typography className={classes.metricValue} style={{ fontSize: '1.5rem', color: usageColor(cpuPct) }}>
                          {cpuPct}%
                        </Typography>
                        <Box className={classes.metricTrend} style={{ color: cpuPct > 70 ? '#F44336' : '#4CAF50' }}>
                          {cpuPct > 70 ? <TrendingUpIcon style={{ fontSize: 14 }} /> : <TrendingDownIcon style={{ fontSize: 14 }} />}
                          {cpuPct > 70 ? 'Elevated' : 'Normal'}
                        </Box>
                      </Box>
                      <Sparkline data={metrics.cpuHistory} color={usageColor(cpuPct)} height={60} />
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="caption" color="textSecondary">24h ago</Typography>
                        <Typography variant="caption" color="textSecondary">now</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" style={{ borderRadius: 12 }}>
                    <CardHeader title="Memory Utilization (%)" titleTypographyProps={{ variant: 'subtitle2' }} />
                    <Divider />
                    <CardContent>
                      <Box display="flex" alignItems="center" style={{ gap: 8 }} mb={1}>
                        <Typography className={classes.metricValue} style={{ fontSize: '1.5rem', color: usageColor(memPct) }}>
                          {memPct}%
                        </Typography>
                        <Box className={classes.metricTrend} style={{ color: memPct > 70 ? '#F44336' : '#4CAF50' }}>
                          {memPct > 70 ? <TrendingUpIcon style={{ fontSize: 14 }} /> : <TrendingDownIcon style={{ fontSize: 14 }} />}
                          {memPct > 70 ? 'Elevated' : 'Normal'}
                        </Box>
                      </Box>
                      <Sparkline data={metrics.memHistory} color={usageColor(memPct)} height={60} />
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="caption" color="textSecondary">24h ago</Typography>
                        <Typography variant="caption" color="textSecondary">now</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" style={{ borderRadius: 12 }}>
                    <CardHeader title="Pod Count" titleTypographyProps={{ variant: 'subtitle2' }} />
                    <Divider />
                    <CardContent>
                      <Box display="flex" alignItems="center" style={{ gap: 8 }} mb={1}>
                        <Typography className={classes.metricValue} style={{ fontSize: '1.5rem', color: usageColor(podPct) }}>
                          {metrics.podCount}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">/ {metrics.podCapacity}</Typography>
                      </Box>
                      <Sparkline data={metrics.podHistory} color={usageColor(podPct)} height={60} />
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="caption" color="textSecondary">24h ago</Typography>
                        <Typography variant="caption" color="textSecondary">now</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" style={{ borderRadius: 12 }}>
                    <CardHeader title="Network Throughput" titleTypographyProps={{ variant: 'subtitle2' }} />
                    <Divider />
                    <CardContent>
                      <Box display="flex" alignItems="center" style={{ gap: 16 }} mb={1}>
                        <Box>
                          <Typography variant="caption" color="textSecondary">IN</Typography>
                          <Typography style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2196F3' }}>
                            {metrics.networkIn} Gbps
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="textSecondary">OUT</Typography>
                          <Typography style={{ fontSize: '1.3rem', fontWeight: 700, color: '#9C27B0' }}>
                            {metrics.networkOut} Gbps
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        In production, this would embed a Grafana panel via iframe or use the Grafana plugin.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tab 2: Health */}
          {tabValue === 2 && (
            <Box p={3}>
              <Typography variant="h6" gutterBottom>Component Health</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Real-time health status of critical Kubernetes control plane and data plane components.
              </Typography>
              <Grid container spacing={2} style={{ marginTop: 8 }}>
                {Object.entries(metrics.componentHealth).map(([name, status]) => {
                  const friendlyName =
                    name === 'apiServer' ? 'API Server' :
                    name === 'etcd' ? 'etcd' :
                    name === 'scheduler' ? 'Scheduler' :
                    name === 'controllerManager' ? 'Controller Manager' :
                    name === 'coreDns' ? 'CoreDNS' :
                    name === 'ingressController' ? 'Ingress Controller' :
                    name === 'cni' ? 'CNI (Networking)' : 'CSI (Storage)';
                  return (
                    <Grid item xs={12} sm={6} md={3} key={name}>
                      <Card variant="outlined" style={{ borderRadius: 12 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" style={{ gap: 12 }}>
                            {healthIcon(status)}
                            <Box>
                              <Typography variant="subtitle2" style={{ fontWeight: 600 }}>{friendlyName}</Typography>
                              <Typography variant="caption" style={{
                                color: status === 'healthy' ? '#4CAF50' : status === 'degraded' ? '#FF9800' : '#F44336',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                fontSize: '0.65rem',
                              }}>
                                {status}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Node status */}
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>Node Status</Typography>
                <Grid container spacing={2}>
                  {Array.from({ length: metrics.nodeCount }, (_, i) => (
                    <Grid item xs={6} sm={4} md={3} key={i}>
                      <Card variant="outlined" style={{ borderRadius: 8 }}>
                        <CardContent style={{ padding: 12 }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="body2" style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                              node-{String(i + 1).padStart(2, '0')}
                            </Typography>
                            <CheckCircleIcon style={{ color: '#4CAF50', fontSize: 16 }} />
                          </Box>
                          <Box mt={1}>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="caption" color="textSecondary">CPU</Typography>
                              <Typography variant="caption" style={{ fontWeight: 600 }}>
                                {Math.round(20 + Math.random() * 60)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={20 + Math.random() * 60}
                              style={{ borderRadius: 4, height: 4, marginTop: 2 }}
                            />
                          </Box>
                          <Box mt={0.5}>
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="caption" color="textSecondary">MEM</Typography>
                              <Typography variant="caption" style={{ fontWeight: 600 }}>
                                {Math.round(30 + Math.random() * 50)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={30 + Math.random() * 50}
                              style={{ borderRadius: 4, height: 4, marginTop: 2 }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}

          {/* Tab 3: Alerts */}
          {tabValue === 3 && (
            <Box p={3}>
              <Typography variant="h6" gutterBottom>Active Alerts</Typography>
              {metrics.alerts.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <CheckCircleIcon style={{ fontSize: 64, color: '#4CAF50', opacity: 0.5 }} />
                  <Typography variant="h6" style={{ marginTop: 8, color: '#4CAF50' }}>
                    All Clear
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    No active alerts for {metrics.name}
                  </Typography>
                </Box>
              ) : (
                metrics.alerts.map((alert, i) => (
                  <Box key={i} className={classes.alertItem} style={{
                    borderLeft: `4px solid ${alert.severity === 'critical' ? '#F44336' : alert.severity === 'warning' ? '#FF9800' : '#2196F3'}`,
                  }}>
                    {alertSeverityIcon(alert.severity)}
                    <Box flex={1}>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>{alert.message}</Typography>
                      <Typography variant="body2" color="textSecondary">Since {alert.since}</Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={alert.severity.toUpperCase()}
                      style={{
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        height: 22,
                        backgroundColor: alert.severity === 'critical' ? '#F44336' : alert.severity === 'warning' ? '#FF9800' : '#2196F3',
                        color: '#fff',
                      }}
                    />
                  </Box>
                ))
              )}

              {/* All-clusters overview */}
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>Alert Summary Across All Clusters</Typography>
                <Grid container spacing={2}>
                  {Object.values(clusterMetricsData).map(cm => (
                    <Grid item xs={12} sm={6} md={4} key={cm.name}>
                      <Card variant="outlined" style={{ borderRadius: 12, cursor: 'pointer' }} onClick={() => { setSelectedCluster(cm.name); setTabValue(0); }}>
                        <CardContent style={{ padding: 16 }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                              <Typography variant="subtitle2" style={{ fontWeight: 600 }}>{cm.name}</Typography>
                              <CspChip csp={cm.csp} />
                            </Box>
                            {cm.alerts.length === 0 ? (
                              <CheckCircleIcon style={{ color: '#4CAF50', fontSize: 20 }} />
                            ) : (
                              <Chip size="small" label={`${cm.alerts.length} alerts`} style={{
                                fontWeight: 600, fontSize: '0.65rem', height: 20,
                                backgroundColor: cm.alerts.some(a => a.severity === 'critical') ? '#F44336' : '#FF9800',
                                color: '#fff',
                              }} />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}
        </Paper>
      </Content>
    </Page>
  );
};
