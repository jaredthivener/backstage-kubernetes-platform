import { useState, useMemo } from 'react';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  makeStyles,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import SecurityIcon from '@material-ui/icons/Security';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import BugReportIcon from '@material-ui/icons/BugReport';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useStyles = makeStyles(theme => ({
  scoreCard: {
    textAlign: 'center',
    padding: theme.spacing(3),
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  scoreValue: {
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  },
  clusterSecurityCard: {
    borderRadius: 12,
    transition: 'box-shadow 0.2s, transform 0.15s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[6],
    },
  },
  clusterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
  },
  clusterName: {
    fontWeight: 600,
    fontSize: '1rem',
  },
  severityBar: {
    display: 'flex',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
  },
  severitySegment: {
    height: '100%',
  },
  findingRow: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  complianceBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
    borderRadius: 8,
    marginBottom: theme.spacing(1),
  },
  compliant: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    border: '1px solid rgba(76, 175, 80, 0.3)',
  },
  nonCompliant: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    border: '1px solid rgba(244, 67, 54, 0.3)',
  },
  partial: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    border: '1px solid rgba(255, 152, 0, 0.3)',
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
  categoryIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
  },
  scoreRing: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBackground: {
    position: 'absolute',
    color: theme.palette.divider,
  },
  tabPanel: {
    paddingTop: theme.spacing(2),
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
}));

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ClusterSecurity {
  name: string;
  csp: string;
  environment: string;
  securityScore: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  lastScan: string;
  compliance: {
    cisKubernetes: 'pass' | 'fail' | 'partial';
    podSecurity: 'pass' | 'fail' | 'partial';
    networkPolicy: 'pass' | 'fail' | 'partial';
    imageScanning: 'pass' | 'fail' | 'partial';
  };
}

interface Vulnerability {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cluster: string;
  namespace: string;
  category: string;
  source: string;
  firstSeen: string;
  status: 'open' | 'in-progress' | 'mitigated';
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const clusterSecurityData: ClusterSecurity[] = [
  {
    name: 'prod-trading-aks',
    csp: 'azure',
    environment: 'production',
    securityScore: 62,
    critical: 3,
    high: 8,
    medium: 12,
    low: 24,
    lastScan: '12 min ago',
    compliance: { cisKubernetes: 'partial', podSecurity: 'fail', networkPolicy: 'pass', imageScanning: 'partial' },
  },
  {
    name: 'prod-settlement-aks',
    csp: 'azure',
    environment: 'production',
    securityScore: 78,
    critical: 0,
    high: 4,
    medium: 9,
    low: 15,
    lastScan: '8 min ago',
    compliance: { cisKubernetes: 'pass', podSecurity: 'partial', networkPolicy: 'pass', imageScanning: 'pass' },
  },
  {
    name: 'staging-risk-eks',
    csp: 'aws',
    environment: 'staging',
    securityScore: 71,
    critical: 1,
    high: 6,
    medium: 14,
    low: 20,
    lastScan: '5 min ago',
    compliance: { cisKubernetes: 'partial', podSecurity: 'pass', networkPolicy: 'fail', imageScanning: 'partial' },
  },
  {
    name: 'prod-analytics-eks',
    csp: 'aws',
    environment: 'production',
    securityScore: 85,
    critical: 0,
    high: 2,
    medium: 7,
    low: 11,
    lastScan: '3 min ago',
    compliance: { cisKubernetes: 'pass', podSecurity: 'pass', networkPolicy: 'pass', imageScanning: 'partial' },
  },
  {
    name: 'dev-platform-gke',
    csp: 'gcp',
    environment: 'development',
    securityScore: 54,
    critical: 2,
    high: 9,
    medium: 18,
    low: 31,
    lastScan: '15 min ago',
    compliance: { cisKubernetes: 'fail', podSecurity: 'fail', networkPolicy: 'fail', imageScanning: 'fail' },
  },
  {
    name: 'staging-wealth-gke',
    csp: 'gcp',
    environment: 'staging',
    securityScore: 73,
    critical: 0,
    high: 5,
    medium: 11,
    low: 18,
    lastScan: '10 min ago',
    compliance: { cisKubernetes: 'partial', podSecurity: 'pass', networkPolicy: 'partial', imageScanning: 'pass' },
  },
];

const vulnerabilities: Vulnerability[] = [
  { id: 'CVE-2026-1234', title: 'Critical RCE in nginx:1.24 base image', severity: 'critical', cluster: 'prod-trading-aks', namespace: 'payments', category: 'Container Image', source: 'Trivy', firstSeen: '2 days ago', status: 'open' },
  { id: 'CVE-2026-5678', title: 'Privilege escalation via container breakout', severity: 'critical', cluster: 'prod-trading-aks', namespace: 'trading-engine', category: 'Runtime', source: 'Falco', firstSeen: '4 hours ago', status: 'open' },
  { id: 'CVE-2026-9012', title: 'OpenSSL buffer overflow in API gateway', severity: 'critical', cluster: 'prod-trading-aks', namespace: 'ingress', category: 'Container Image', source: 'Trivy', firstSeen: '1 day ago', status: 'in-progress' },
  { id: 'CVE-2026-3456', title: 'Heap corruption in libcurl 8.4.0', severity: 'critical', cluster: 'staging-risk-eks', namespace: 'data-pipeline', category: 'Container Image', source: 'Trivy', firstSeen: '3 days ago', status: 'open' },
  { id: 'CVE-2026-7890', title: 'Remote code exec in log4j-core 2.x', severity: 'critical', cluster: 'dev-platform-gke', namespace: 'ci-cd', category: 'Container Image', source: 'Trivy', firstSeen: '5 days ago', status: 'open' },
  { id: 'CVE-2026-2345', title: 'Unauthorized API access via SSRF', severity: 'critical', cluster: 'dev-platform-gke', namespace: 'api-gateway', category: 'Runtime', source: 'Falco', firstSeen: '1 day ago', status: 'in-progress' },
  { id: 'POL-001', title: 'Pod running as root user', severity: 'high', cluster: 'prod-trading-aks', namespace: 'payments', category: 'Pod Security', source: 'OPA/Gatekeeper', firstSeen: '5 days ago', status: 'open' },
  { id: 'POL-002', title: 'Container running in privileged mode', severity: 'high', cluster: 'prod-trading-aks', namespace: 'monitoring', category: 'Pod Security', source: 'OPA/Gatekeeper', firstSeen: '1 week ago', status: 'open' },
  { id: 'NET-001', title: 'Missing network policy for namespace', severity: 'high', cluster: 'staging-risk-eks', namespace: 'analytics', category: 'Network Policy', source: 'Cilium', firstSeen: '1 week ago', status: 'open' },
  { id: 'NET-002', title: 'Egress allowed to all external IPs', severity: 'high', cluster: 'dev-platform-gke', namespace: 'default', category: 'Network Policy', source: 'Cilium', firstSeen: '2 weeks ago', status: 'open' },
  { id: 'RBAC-001', title: 'Over-privileged service account', severity: 'high', cluster: 'staging-risk-eks', namespace: 'ci-cd', category: 'RBAC', source: 'KubeAudit', firstSeen: '2 weeks ago', status: 'open' },
  { id: 'IMG-001', title: 'Image from untrusted registry', severity: 'high', cluster: 'dev-platform-gke', namespace: 'sandbox', category: 'Image Policy', source: 'Kyverno', firstSeen: '3 days ago', status: 'open' },
  { id: 'SEC-001', title: 'TLS cert expiring in 14 days', severity: 'medium', cluster: 'dev-platform-gke', namespace: 'ingress', category: 'Certificate', source: 'cert-manager', firstSeen: '3 days ago', status: 'open' },
  { id: 'SEC-002', title: 'Kubernetes API audit logging not enabled', severity: 'medium', cluster: 'staging-risk-eks', namespace: 'kube-system', category: 'Audit', source: 'KubeAudit', firstSeen: '1 week ago', status: 'open' },
  { id: 'SEC-003', title: 'Secret not encrypted at rest', severity: 'medium', cluster: 'prod-settlement-aks', namespace: 'trading', category: 'Encryption', source: 'KubeAudit', firstSeen: '4 days ago', status: 'in-progress' },
];

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

const severityColor = (sev: string) =>
  sev === 'critical' ? '#F44336' :
  sev === 'high' ? '#FF9800' :
  sev === 'medium' ? '#FFC107' : '#8BC34A';

const complianceIcon = (status: 'pass' | 'fail' | 'partial') => {
  if (status === 'pass') return <CheckCircleIcon style={{ color: '#4CAF50', fontSize: 18 }} />;
  if (status === 'fail') return <ErrorIcon style={{ color: '#F44336', fontSize: 18 }} />;
  return <WarningIcon style={{ color: '#FF9800', fontSize: 18 }} />;
};

const statusChip = (status: string) => {
  const color = status === 'open' ? '#F44336' : status === 'in-progress' ? '#FF9800' : '#4CAF50';
  return <Chip size="small" label={status} style={{ backgroundColor: color, color: '#fff', fontWeight: 600, fontSize: '0.65rem', height: 20 }} />;
};

// ---------------------------------------------------------------------------
// Cluster Security Card
// ---------------------------------------------------------------------------
const ClusterSecurityCard = ({ cluster }: { cluster: ClusterSecurity }) => {
  const classes = useStyles();
  const total = cluster.critical + cluster.high + cluster.medium + cluster.low;
  const scoreColor =
    cluster.securityScore >= 80 ? '#4CAF50' :
    cluster.securityScore >= 60 ? '#FF9800' : '#F44336';

  return (
    <Card className={classes.clusterSecurityCard}>
      <CardContent>
        <Box className={classes.clusterHeader}>
          <Box>
            <Typography className={classes.clusterName}>{cluster.name}</Typography>
            <Box display="flex" alignItems="center" style={{ gap: 6, marginTop: 4 }}>
              <CspChip csp={cluster.csp} />
              <Chip size="small" label={cluster.environment} variant="outlined" style={{ fontSize: '0.65rem', height: 20 }} />
            </Box>
          </Box>
          <Box textAlign="center">
            <Typography style={{ fontSize: '2rem', fontWeight: 700, color: scoreColor, lineHeight: 1 }}>
              {cluster.securityScore}
            </Typography>
            <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.65rem' }}>
              SCORE
            </Typography>
          </Box>
        </Box>

        {/* Severity breakdown bar */}
        <Box className={classes.severityBar}>
          {cluster.critical > 0 && <Box className={classes.severitySegment} style={{ width: `${(cluster.critical / total) * 100}%`, backgroundColor: '#F44336' }} />}
          {cluster.high > 0 && <Box className={classes.severitySegment} style={{ width: `${(cluster.high / total) * 100}%`, backgroundColor: '#FF9800' }} />}
          {cluster.medium > 0 && <Box className={classes.severitySegment} style={{ width: `${(cluster.medium / total) * 100}%`, backgroundColor: '#FFC107' }} />}
          {cluster.low > 0 && <Box className={classes.severitySegment} style={{ width: `${(cluster.low / total) * 100}%`, backgroundColor: '#8BC34A' }} />}
        </Box>

        {/* Severity counts */}
        <Box display="flex" justifyContent="space-between" mb={1.5}>
          <Typography variant="caption" style={{ color: '#F44336', fontWeight: 600 }}>{cluster.critical} Critical</Typography>
          <Typography variant="caption" style={{ color: '#FF9800', fontWeight: 600 }}>{cluster.high} High</Typography>
          <Typography variant="caption" style={{ color: '#FFC107', fontWeight: 600 }}>{cluster.medium} Medium</Typography>
          <Typography variant="caption" style={{ color: '#8BC34A', fontWeight: 600 }}>{cluster.low} Low</Typography>
        </Box>

        {/* Compliance badges */}
        <Typography variant="caption" color="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1.2, fontSize: '0.65rem', fontWeight: 600 }}>
          Compliance Checks
        </Typography>
        <Box mt={0.5}>
          {Object.entries(cluster.compliance).map(([key, value]) => {
            const label =
              key === 'cisKubernetes' ? 'CIS Benchmark' :
              key === 'podSecurity' ? 'Pod Security' :
              key === 'networkPolicy' ? 'Network Policy' : 'Image Scanning';
            const badgeClass =
              value === 'pass' ? classes.compliant :
              value === 'fail' ? classes.nonCompliant : classes.partial;
            return (
              <Box key={key} className={`${classes.complianceBadge} ${badgeClass}`}>
                {complianceIcon(value)}
                <Typography variant="caption" style={{ fontWeight: 500, flex: 1 }}>{label}</Typography>
                <Typography variant="caption" style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6rem' }}>{value}</Typography>
              </Box>
            );
          })}
        </Box>

        <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: 8 }}>
          Last scan: {cluster.lastScan}
        </Typography>
      </CardContent>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// Main Security Page
// ---------------------------------------------------------------------------
export const SecurityPage = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [clusterFilter, setClusterFilter] = useState<string | null>(null);
  const [cspFilter, setCspFilter] = useState<string>('all');
  const [envFilter, setEnvFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Filter clusters by CSP/env and optionally severity
  const filteredClusters = useMemo(() =>
    clusterSecurityData.filter(c => {
      if (cspFilter !== 'all' && c.csp !== cspFilter) return false;
      if (envFilter !== 'all' && c.environment !== envFilter) return false;
      if (severityFilter !== 'all') {
        // Only show clusters that have findings at the selected severity
        const sevCount = severityFilter === 'critical' ? c.critical :
          severityFilter === 'high' ? c.high :
          severityFilter === 'medium' ? c.medium : c.low;
        if (sevCount === 0) return false;
      }
      return true;
    }), [cspFilter, envFilter, severityFilter]);

  const filteredClusterNames = new Set(filteredClusters.map(c => c.name));

  const totalFindings = filteredClusters.reduce((sum, c) => sum + c.critical + c.high + c.medium + c.low, 0);
  const totalCritical = filteredClusters.reduce((sum, c) => sum + c.critical, 0);
  const totalHigh = filteredClusters.reduce((sum, c) => sum + c.high, 0);
  const avgScore = filteredClusters.length > 0
    ? Math.round(filteredClusters.reduce((sum, c) => sum + c.securityScore, 0) / filteredClusters.length)
    : 0;
  const avgScoreColor = avgScore >= 80 ? '#4CAF50' : avgScore >= 60 ? '#FF9800' : '#F44336';

  const filteredVulns = useMemo(() =>
    vulnerabilities.filter(v =>
      filteredClusterNames.has(v.cluster) &&
      (clusterFilter === null || v.cluster === clusterFilter) &&
      (severityFilter === 'all' || v.severity === severityFilter),
    ), [clusterFilter, severityFilter, filteredClusterNames]);

  const categoryIcons: Record<string, JSX.Element> = {
    'Container Image': <BugReportIcon style={{ fontSize: 16, color: '#9C27B0' }} />,
    Runtime: <WarningIcon style={{ fontSize: 16, color: '#F44336' }} />,
    'Pod Security': <SecurityIcon style={{ fontSize: 16, color: '#FF9800' }} />,
    'Network Policy': <NetworkCheckIcon style={{ fontSize: 16, color: '#2196F3' }} />,
    RBAC: <VpnKeyIcon style={{ fontSize: 16, color: '#795548' }} />,
    'Image Policy': <VerifiedUserIcon style={{ fontSize: 16, color: '#607D8B' }} />,
    Certificate: <VpnKeyIcon style={{ fontSize: 16, color: '#009688' }} />,
    Audit: <SecurityIcon style={{ fontSize: 16, color: '#3F51B5' }} />,
    Encryption: <VpnKeyIcon style={{ fontSize: 16, color: '#E91E63' }} />,
  };

  return (
    <Page themeId="tool">
      <Header
        title="Security Posture"
        subtitle={
          <HeaderBannerLogos layout="security" text="Vulnerability scanning, compliance, and security findings across all clusters" />
        }
      />
      <Content>
        {/* Summary cards */}
        <Grid container spacing={2} style={{ marginBottom: 24 }}>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.scoreCard} variant="outlined">
              <Typography className={classes.scoreValue} style={{ color: avgScoreColor }}>
                {avgScore}
              </Typography>
              <Typography className={classes.scoreLabel}>Avg Security Score</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.scoreCard} variant="outlined">
              <Typography className={classes.scoreValue}>{totalFindings}</Typography>
              <Typography className={classes.scoreLabel}>Total Findings</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.scoreCard} variant="outlined">
              <Typography className={classes.scoreValue} style={{ color: '#F44336' }}>{totalCritical}</Typography>
              <Typography className={classes.scoreLabel}>Critical</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.scoreCard} variant="outlined">
              <Typography className={classes.scoreValue} style={{ color: '#FF9800' }}>{totalHigh}</Typography>
              <Typography className={classes.scoreLabel}>High</Typography>
            </Paper>
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
            <InputLabel>Severity</InputLabel>
            <Select value={severityFilter} onChange={e => setSeverityFilter(e.target.value as string)} label="Severity">
              <MenuItem value="all">All Severities</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Tabs */}
        <Paper variant="outlined" style={{ borderRadius: 12 }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="By Cluster" />
            <Tab label="All Vulnerabilities" />
          </Tabs>
          <Divider />

          {/* Tab 0: By Cluster */}
          {tabValue === 0 && (
            <Box className={classes.tabPanel} p={2}>
              <Grid container spacing={3}>
                {filteredClusters
                  .sort((a, b) => a.securityScore - b.securityScore)
                  .map(cluster => (
                    <Grid item xs={12} sm={6} md={4} key={cluster.name}>
                      <Link
                        to="#"
                        style={{ textDecoration: 'none' }}
                        onClick={e => {
                          e.preventDefault();
                          setClusterFilter(cluster.name);
                          setTabValue(1);
                        }}
                      >
                        <ClusterSecurityCard cluster={cluster} />
                      </Link>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}

          {/* Tab 1: All Vulnerabilities */}
          {tabValue === 1 && (
            <Box>
              {/* Cluster filter chips */}
              <Box p={2} pb={0} display="flex" flexWrap="wrap" style={{ gap: 8 }}>
                <Chip
                  label="All Clusters"
                  size="small"
                  color={clusterFilter === null ? 'primary' : 'default'}
                  onClick={() => setClusterFilter(null)}
                  style={{ fontWeight: 600 }}
                />
                {filteredClusters.map(c => (
                  <Chip
                    key={c.name}
                    label={c.name}
                    size="small"
                    color={clusterFilter === c.name ? 'primary' : 'default'}
                    onClick={() => setClusterFilter(c.name)}
                    variant={clusterFilter === c.name ? 'default' : 'outlined'}
                    style={{ fontWeight: 500 }}
                  />
                ))}
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Severity</TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Vulnerability</TableCell>
                      <TableCell>Cluster</TableCell>
                      <TableCell>Namespace</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredVulns.map(v => (
                      <TableRow key={v.id} className={classes.findingRow} hover>
                        <TableCell>
                          <Chip
                            size="small"
                            label={v.severity.toUpperCase()}
                            style={{
                              backgroundColor: severityColor(v.severity),
                              color: v.severity === 'medium' ? '#000' : '#fff',
                              fontWeight: 700,
                              fontSize: '0.6rem',
                              height: 20,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                            {v.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" style={{ fontWeight: 500, maxWidth: 300 }}>
                            {v.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" style={{ fontSize: '0.8rem' }}>{v.cluster}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label={v.namespace} variant="outlined" style={{ fontSize: '0.65rem', height: 20 }} />
                        </TableCell>
                        <TableCell>
                          <Box className={classes.categoryIcon}>
                            {categoryIcons[v.category] || <SecurityIcon style={{ fontSize: 16 }} />}
                            {v.category}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{v.source}</Typography>
                        </TableCell>
                        <TableCell>{statusChip(v.status)}</TableCell>
                        <TableCell>
                          <Typography variant="caption" color="textSecondary">{v.firstSeen}</Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View details">
                            <IconButton size="small">
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Content>
    </Page>
  );
};
