import { useEffect, useState } from 'react';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';
import {
  Typography,
  Button,
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
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import SearchIcon from '@material-ui/icons/Search';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import SettingsIcon from '@material-ui/icons/Settings';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import SecurityIcon from '@material-ui/icons/Security';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import StorageIcon from '@material-ui/icons/Storage';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { Link, useLocation } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap' as const,
    gap: theme.spacing(1),
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  filterRow: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  tableContainer: {
    borderRadius: 8,
  },
  tableRow: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
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
  envChip: {
    fontWeight: 600,
    fontSize: '0.7rem',
  },
  prodChip: {
    borderColor: '#F44336',
    color: '#F44336',
  },
  stagingChip: {
    borderColor: '#FF9800',
    color: '#FF9800',
  },
  devChip: {
    borderColor: '#4CAF50',
    color: '#4CAF50',
  },
  searchField: {
    minWidth: 280,
  },
  summaryCard: {
    textAlign: 'center' as const,
  },
  summaryValue: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  summaryLabel: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginTop: 4,
  },
  healthDot: {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 6,
  },
  healthGreen: { backgroundColor: '#4CAF50' },
  healthYellow: { backgroundColor: '#FF9800' },
  healthRed: { backgroundColor: '#F44336' },
  clusterName: {
    fontWeight: 600,
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  metricCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  miniBar: {
    width: 60,
    height: 6,
    borderRadius: 3,
  },
  costTrendUp: {
    color: '#F44336',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  costTrendDown: {
    color: '#4CAF50',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  selectControl: {
    minWidth: 140,
  },
}));

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
const CspChip = ({ csp }: { csp: string }) => {
  const classes = useStyles();
  const chipClass =
    csp === 'azure' ? classes.azureChip :
    csp === 'aws' ? classes.awsChip :
    csp === 'gcp' ? classes.gcpChip : undefined;
  return <Chip size="small" label={csp.toUpperCase()} className={chipClass} />;
};

const EnvChip = ({ env }: { env: string }) => {
  const classes = useStyles();
  const envClass =
    env === 'production' ? classes.prodChip :
    env === 'staging' ? classes.stagingChip :
    classes.devChip;
  return (
    <Chip
      size="small"
      label={env}
      variant="outlined"
      className={`${classes.envChip} ${envClass}`}
    />
  );
};

// Mock cluster metrics (in production, fetched from Prometheus/metrics backend)
const clusterMetrics: Record<string, { cpu: number; memory: number; pods: number; securityScore: number; monthlyCost: number; costTrend: number }> = {
  'prod-trading-aks': { cpu: 72, memory: 68, pods: 156, securityScore: 92, monthlyCost: 8420, costTrend: 3.2 },
  'prod-analytics-eks': { cpu: 85, memory: 78, pods: 312, securityScore: 88, monthlyCost: 14200, costTrend: 5.1 },
  'prod-risk-gke': { cpu: 61, memory: 55, pods: 94, securityScore: 85, monthlyCost: 6340, costTrend: -1.8 },
  'staging-risk-eks': { cpu: 34, memory: 42, pods: 67, securityScore: 78, monthlyCost: 3180, costTrend: 0.5 },
  'dev-sandbox-aks': { cpu: 18, memory: 22, pods: 23, securityScore: 65, monthlyCost: 1240, costTrend: -2.3 },
  'dev-ml-gke': { cpu: 55, memory: 63, pods: 48, securityScore: 54, monthlyCost: 4560, costTrend: 8.7 },
};

const getMetrics = (name: string) =>
  clusterMetrics[name] || { cpu: 0, memory: 0, pods: 0, securityScore: 0, monthlyCost: 0, costTrend: 0 };

const HealthIndicator = ({ status }: { status: string }) => {
  const classes = useStyles();
  switch (status) {
    case 'running':
      return (
        <Box display="flex" alignItems="center">
          <span className={`${classes.healthDot} ${classes.healthGreen}`} />
          <Typography variant="body2" style={{ color: '#4CAF50', fontWeight: 500 }}>Healthy</Typography>
        </Box>
      );
    case 'updating':
      return (
        <Box display="flex" alignItems="center">
          <span className={`${classes.healthDot} ${classes.healthYellow}`} />
          <Typography variant="body2" style={{ color: '#FF9800', fontWeight: 500 }}>Updating</Typography>
        </Box>
      );
    case 'degraded':
      return (
        <Box display="flex" alignItems="center">
          <span className={`${classes.healthDot} ${classes.healthRed}`} />
          <Typography variant="body2" style={{ color: '#F44336', fontWeight: 500 }}>Degraded</Typography>
        </Box>
      );
    default:
      return (
        <Box display="flex" alignItems="center">
          <span className={`${classes.healthDot} ${classes.healthGreen}`} />
          <Typography variant="body2" style={{ color: '#4CAF50', fontWeight: 500 }}>Healthy</Typography>
        </Box>
      );
  }
};

const ResourceMiniBar = ({ value, label }: { value: number; label: string }) => {
  const classes = useStyles();
  const color = value > 80 ? '#F44336' : value > 60 ? '#FF9800' : '#4CAF50';
  return (
    <Box className={classes.metricCell}>
      <Typography variant="body2" style={{ minWidth: 28, fontWeight: 500 }}>{value}%</Typography>
      <LinearProgress
        variant="determinate"
        value={value}
        className={classes.miniBar}
        style={{ backgroundColor: `${color}22` }}
      />
      <Typography variant="caption" color="textSecondary">{label}</Typography>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export const ClustersPage = () => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const location = useLocation();
  const [clusters, setClusters] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [cspFilter, setCspFilter] = useState('all');
  const [envFilter, setEnvFilter] = useState('all');

  // Parse CSP filter from URL query params (from Platforms submenu)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const csp = params.get('csp');
    if (csp) setCspFilter(csp);
  }, [location.search]);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await catalogApi.getEntities({
          filter: {
            kind: 'Resource',
            'spec.type': 'kubernetes-cluster',
          },
        });
        // Filter out management clusters — show only workload clusters
        const workloadClusters = response.items.filter(e => {
          const tags = e.metadata.tags || [];
          const clusterType =
            e.metadata.annotations?.['morgan-stanley.com/cluster-type'] ||
            (e as any).spec?.clusterType || '';
          if (tags.includes('management-cluster')) return false;
          if (clusterType === 'management') return false;
          return true;
        });
        setClusters(workloadClusters);
      } catch {
        setClusters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClusters();
  }, [catalogApi]);

  const getCsp = (e: Entity) =>
    e.metadata.annotations?.['morgan-stanley.com/csp'] || (e as any).spec?.csp || 'unknown';
  const getEnv = (e: Entity) =>
    e.metadata.annotations?.['morgan-stanley.com/environment'] || (e as any).spec?.environment || '—';
  const getRegion = (e: Entity) =>
    e.metadata.annotations?.['morgan-stanley.com/region'] || (e as any).spec?.region || '—';
  const getVersion = (e: Entity) =>
    e.metadata.annotations?.['morgan-stanley.com/kubernetes-version'] || (e as any).spec?.kubernetesVersion || '—';
  const getStatus = (e: Entity) =>
    e.metadata.annotations?.['morgan-stanley.com/cluster-status'] || 'running';
  const getOwner = (e: Entity) =>
    (e as any).spec?.owner || '—';
  const getNodeCount = (e: Entity) =>
    e.metadata.annotations?.['morgan-stanley.com/node-count'] || '—';

  const filtered = clusters.filter(c => {
    const matchesText = !filter ||
      c.metadata.name.toLowerCase().includes(filter.toLowerCase()) ||
      getCsp(c).toLowerCase().includes(filter.toLowerCase()) ||
      getEnv(c).toLowerCase().includes(filter.toLowerCase()) ||
      (c.metadata.description || '').toLowerCase().includes(filter.toLowerCase());
    const matchesCsp = cspFilter === 'all' || getCsp(c) === cspFilter;
    const matchesEnv = envFilter === 'all' || getEnv(c) === envFilter;
    return matchesText && matchesCsp && matchesEnv;
  });

  // Summary calculations
  const totalClusters = clusters.length;
  const prodCount = clusters.filter(c => getEnv(c) === 'production').length;
  const healthyCount = clusters.filter(c => getStatus(c) === 'running').length;
  const totalCost = clusters.reduce((sum, c) => sum + getMetrics(c.metadata.name).monthlyCost, 0);

  return (
    <Page themeId="tool">
      <Header
        title="Workload Clusters"
        subtitle={
          <HeaderBannerLogos layout="clusters" text="Kubernetes clusters running your applications across Azure, AWS, and GCP" />
        }
      />
      <Content>
        {/* Summary Cards */}
        <Grid container spacing={2} style={{ marginBottom: 20 }}>
          <Grid item xs={6} sm={3}>
            <Card className={classes.summaryCard}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" gridGap={8}>
                  <StorageIcon style={{ color: '#0078D4', fontSize: 28 }} />
                  <Typography className={classes.summaryValue} style={{ color: '#0078D4' }}>
                    {totalClusters}
                  </Typography>
                </Box>
                <Typography className={classes.summaryLabel}>Total Clusters</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card className={classes.summaryCard}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" gridGap={8}>
                  <CheckCircleIcon style={{ color: '#4CAF50', fontSize: 28 }} />
                  <Typography className={classes.summaryValue} style={{ color: '#4CAF50' }}>
                    {healthyCount}/{totalClusters}
                  </Typography>
                </Box>
                <Typography className={classes.summaryLabel}>Healthy</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card className={classes.summaryCard}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" gridGap={8}>
                  <SecurityIcon style={{ color: '#FF9800', fontSize: 28 }} />
                  <Typography className={classes.summaryValue} style={{ color: '#FF9800' }}>
                    {prodCount}
                  </Typography>
                </Box>
                <Typography className={classes.summaryLabel}>Production</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card className={classes.summaryCard}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" gridGap={8}>
                  <AttachMoneyIcon style={{ color: '#1976D2', fontSize: 28 }} />
                  <Typography className={classes.summaryValue} style={{ color: '#1976D2' }}>
                    ${(totalCost / 1000).toFixed(1)}k
                  </Typography>
                </Box>
                <Typography className={classes.summaryLabel}>Monthly Cost</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Toolbar */}
        <Box className={classes.toolbar}>
          <Box className={classes.actionButtons}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              component={Link}
              to="/create/templates/default/kubernetes-cluster-provisioner"
            >
              Create Cluster
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<UpdateIcon />}
              component={Link}
              to="/create/templates/default/cluster-upgrade"
            >
              Upgrade
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<TrendingUpIcon />}
              component={Link}
              to="/create/templates/default/cluster-scale"
            >
              Scale
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DeleteIcon />}
              component={Link}
              to="/create/templates/default/cluster-destroy"
            >
              Destroy
            </Button>
          </Box>
          <Box className={classes.filterRow}>
            <FormControl variant="outlined" size="small" className={classes.selectControl}>
              <InputLabel>CSP</InputLabel>
              <Select
                value={cspFilter}
                onChange={e => setCspFilter(e.target.value as string)}
                label="CSP"
              >
                <MenuItem value="all">All CSPs</MenuItem>
                <MenuItem value="azure">Azure</MenuItem>
                <MenuItem value="aws">AWS</MenuItem>
                <MenuItem value="gcp">GCP</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" className={classes.selectControl}>
              <InputLabel>Environment</InputLabel>
              <Select
                value={envFilter}
                onChange={e => setEnvFilter(e.target.value as string)}
                label="Environment"
              >
                <MenuItem value="all">All Envs</MenuItem>
                <MenuItem value="production">Production</MenuItem>
                <MenuItem value="staging">Staging</MenuItem>
                <MenuItem value="development">Development</MenuItem>
              </Select>
            </FormControl>
            <TextField
              className={classes.searchField}
              variant="outlined"
              size="small"
              placeholder="Search clusters..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="disabled" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Clusters Table */}
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Health</TableCell>
                <TableCell>Cluster</TableCell>
                <TableCell>CSP</TableCell>
                <TableCell>Environment</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Nodes</TableCell>
                <TableCell>CPU / Mem</TableCell>
                <TableCell>Security</TableCell>
                <TableCell>Cost/mo</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <Box py={3}>
                      <LinearProgress />
                      <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                        Loading workload clusters...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <Box py={4}>
                      <Typography variant="body1" color="textSecondary">
                        {filter || cspFilter !== 'all' || envFilter !== 'all' ? 'No clusters match your filters' : 'No workload clusters found'}
                      </Typography>
                      {!filter && cspFilter === 'all' && envFilter === 'all' && (
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          style={{ marginTop: 12 }}
                          component={Link}
                          to="/create/templates/default/kubernetes-cluster-provisioner"
                        >
                          Deploy Your First Cluster
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {filtered.map(cluster => {
                const metrics = getMetrics(cluster.metadata.name);
                const secColor = metrics.securityScore >= 80 ? '#4CAF50' : metrics.securityScore >= 60 ? '#FF9800' : '#F44336';
                const SecIcon = metrics.securityScore >= 80 ? CheckCircleIcon : metrics.securityScore >= 60 ? WarningIcon : ErrorIcon;

                return (
                  <TableRow
                    key={cluster.metadata.name}
                    className={classes.tableRow}
                    hover
                  >
                    <TableCell>
                      <HealthIndicator status={getStatus(cluster)} />
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/clusters/${cluster.metadata.name}`}
                        className={classes.clusterName}
                      >
                        {cluster.metadata.name}
                      </Link>
                      {cluster.metadata.description && (
                        <Typography variant="caption" display="block" color="textSecondary" style={{ maxWidth: 200 }}>
                          {(cluster.metadata.description as string).slice(0, 60)}...
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <CspChip csp={getCsp(cluster)} />
                    </TableCell>
                    <TableCell>
                      <EnvChip env={getEnv(cluster)} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{getRegion(cluster)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={getVersion(cluster)} variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" style={{ fontWeight: 600 }}>{getNodeCount(cluster)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <ResourceMiniBar value={metrics.cpu} label="CPU" />
                        <ResourceMiniBar value={metrics.memory} label="MEM" />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gridGap={4}>
                        <SecIcon style={{ color: secColor, fontSize: 18 }} />
                        <Typography variant="body2" style={{ color: secColor, fontWeight: 600 }}>
                          {metrics.securityScore}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" style={{ fontWeight: 600 }}>
                        ${metrics.monthlyCost.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={metrics.costTrend >= 0 ? classes.costTrendUp : classes.costTrendDown}
                      >
                        {metrics.costTrend >= 0 ? '+' : ''}{metrics.costTrend}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{getOwner(cluster)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Manage add-ons">
                        <IconButton
                          size="small"
                          component={Link}
                          to={`/create/templates/default/addon-management?clusterName=${cluster.metadata.name}`}
                        >
                          <SettingsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View cluster details">
                        <IconButton
                          size="small"
                          component={Link}
                          to={`/clusters/${cluster.metadata.name}`}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Content>
    </Page>
  );
};
