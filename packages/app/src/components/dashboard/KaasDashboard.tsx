import { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  InputBase,
  makeStyles,
  Box,
  Divider,
  LinearProgress,
  Paper,
  Tooltip,
} from '@material-ui/core';
import CloudIcon from '@material-ui/icons/Cloud';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import SecurityIcon from '@material-ui/icons/Security';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import GitHubIcon from '@material-ui/icons/GitHub';
import StorageIcon from '@material-ui/icons/Storage';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import UpdateIcon from '@material-ui/icons/Update';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import TimelineIcon from '@material-ui/icons/Timeline';
import TipsAndUpdatesIcon from '@material-ui/icons/EmojiObjects';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import SchoolIcon from '@material-ui/icons/School';
import EventIcon from '@material-ui/icons/Event';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import SpeedIcon from '@material-ui/icons/Speed';
import EmailIcon from '@material-ui/icons/Email';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {
  Header,
  Page,
  Content,
  StatusOK,
  StatusWarning,
  StatusAborted,
  LinkButton,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useStyles = makeStyles(theme => ({
  welcomeBanner: {
    background: 'linear-gradient(135deg, #002F6C 0%, #0050A0 50%, #0078D4 100%)',
    borderRadius: 12,
    padding: theme.spacing(5, 5),
    minHeight: 160,
    color: '#FFFFFF',
    marginBottom: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: -50,
      right: -50,
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
    },
  },
  welcomeMascot: {
    position: 'absolute',
    right: theme.spacing(70),
    bottom: 0,
    height: 155,
    objectFit: 'contain',
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))',
    pointerEvents: 'none',
  },
  welcomeTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    marginBottom: theme.spacing(0.5),
  },
  welcomeSubtitle: {
    fontSize: '1rem',
    opacity: 0.85,
    marginBottom: theme.spacing(2),
  },
  statCard: {
    textAlign: 'center',
    padding: theme.spacing(2),
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  statValue: {
    fontSize: '2.4rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
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
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  dashboardColumn: {
    display: 'grid',
    gap: theme.spacing(3),
  },
  widgetCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 12,
  },
  widgetBody: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  widgetTall: {
    minHeight: 420,
  },
  widgetMedium: {
    minHeight: 360,
  },
  widgetCompact: {
    minHeight: 300,
  },
  clusterRow: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    marginBottom: theme.spacing(1),
    borderRadius: 4,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  clusterFilterBar: {
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  clusterFilterInput: {
    fontSize: '0.8rem',
    width: '100%',
  },
  clusterPrimaryText: {
    fontWeight: 500,
    fontSize: '0.86rem',
  },
  clusterTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
  clusterSecondaryText: {
    fontSize: '0.74rem',
    color: theme.palette.text.secondary,
    marginTop: 2,
  },
  clusterTagsRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  clusterTagChip: {
    height: 20,
    fontSize: '0.65rem',
    borderRadius: 999,
    '& .MuiChip-label': {
      paddingLeft: 8,
      paddingRight: 8,
    },
  },
  clusterStatusAlert: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 8,
    padding: theme.spacing(0.4, 1.1),
    minWidth: 108,
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    whiteSpace: 'nowrap',
  },
  clusterStatusIcon: {
    fontSize: '0.95rem',
  },
  clusterStatusRunning: {
    backgroundColor: 'rgba(46, 160, 67, 0.22)',
    color: '#2EA043',
    border: '1px solid rgba(46, 160, 67, 0.45)',
  },
  clusterStatusUpdating: {
    backgroundColor: 'rgba(255, 165, 0, 0.22)',
    color: '#D97706',
    border: '1px solid rgba(255, 165, 0, 0.45)',
  },
  clusterStatusStopped: {
    backgroundColor: 'rgba(244, 67, 54, 0.22)',
    color: '#E53935',
    border: '1px solid rgba(244, 67, 54, 0.45)',
  },
  prRow: {
    borderLeft: `3px solid ${theme.palette.warning.main}`,
    marginBottom: theme.spacing(1),
    borderRadius: 4,
  },
  githubToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  githubFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 999,
    padding: theme.spacing(0.25, 1),
    width: 280,
    maxWidth: '100%',
  },
  githubFilterInput: {
    fontSize: '0.8rem',
    width: '100%',
  },
  githubTabs: {
    minHeight: 34,
    borderBottom: `1px solid ${theme.palette.divider}`,
    '& .MuiTab-root': {
      minHeight: 34,
      fontSize: '0.72rem',
      textTransform: 'none',
      minWidth: 88,
      fontWeight: 600,
    },
  },
  githubTableHeader: {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1.8fr 1fr 1.2fr 1fr 1fr 1fr 1fr',
    gap: theme.spacing(1),
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  githubHeaderText: {
    fontSize: '0.68rem',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: 700,
    color: theme.palette.text.secondary,
  },
  githubRow: {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1.8fr 1fr 1.2fr 1fr 1fr 1fr 1fr',
    gap: theme.spacing(1),
    alignItems: 'center',
    padding: theme.spacing(1.1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  githubTitleLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontSize: '0.78rem',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  githubCellText: {
    fontSize: '0.74rem',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  githubReviewers: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    minHeight: 24,
  },
  githubReviewerAvatar: {
    width: 22,
    height: 22,
    fontSize: '0.62rem',
    fontWeight: 700,
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.35)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
  },
  githubReviewerEmpty: {
    fontSize: '0.72rem',
    color: theme.palette.text.disabled,
  },
  githubReviewerMore: {
    height: 20,
    fontSize: '0.65rem',
    fontWeight: 700,
  },
  githubChipCompact: {
    height: 20,
    fontSize: '0.65rem',
    fontWeight: 600,
  },
  criticalFinding: {
    borderLeft: `3px solid ${theme.palette.error.main}`,
  },
  highFinding: {
    borderLeft: `3px solid #FF9800`,
  },
  mediumFinding: {
    borderLeft: `3px solid ${theme.palette.warning.main}`,
  },
  quickAction: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.15s',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'translateY(-2px)',
    },
  },
  quickActionIcon: {
    fontSize: 36,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  costHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: theme.spacing(2),
  },
  costTotal: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  costTrendUp: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 2,
    color: '#F44336',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  costTrendDown: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 2,
    color: '#4CAF50',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  costBar: {
    height: 8,
    borderRadius: 4,
    display: 'flex',
    overflow: 'hidden',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  costBarSegment: {
    height: '100%',
    transition: 'width 0.3s',
  },
  costClusterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  costClusterName: {
    fontWeight: 500,
    fontSize: '0.85rem',
  },
  costClusterAmount: {
    fontWeight: 600,
    fontSize: '0.85rem',
  },
  incidentRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  incidentSev: {
    minWidth: 6,
    height: 40,
    borderRadius: 3,
    flexShrink: 0,
  },
  onCallBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid rgba(76,175,80,0.3)',
    backgroundColor: 'rgba(76,175,80,0.05)',
    marginBottom: 8,
  },
  onCallActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  teamsIconButton: {
    width: 28,
    height: 28,
    padding: 4,
    borderRadius: 6,
    border: `1px solid ${theme.palette.divider}`,
  },
  teamsIcon: {
    width: 16,
    height: 16,
    objectFit: 'contain',
  },
  observabilityCard: {
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    },
  },
  newsTicker: {
    background: 'linear-gradient(90deg, rgba(25,118,210,0.08) 0%, rgba(156,39,176,0.08) 100%)',
    borderRadius: 10,
    padding: theme.spacing(1.5, 0),
    marginBottom: theme.spacing(3),
    overflow: 'hidden',
    position: 'relative',
    border: `1px solid ${theme.palette.divider}`,
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 80,
      background: theme.palette.type === 'dark' 
        ? 'linear-gradient(90deg, rgba(18,18,18,1) 0%, rgba(18,18,18,0) 100%)'
        : 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
      zIndex: 2,
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 80,
      background: theme.palette.type === 'dark'
        ? 'linear-gradient(90deg, rgba(18,18,18,0) 0%, rgba(18,18,18,1) 100%)'
        : 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
      zIndex: 2,
      pointerEvents: 'none',
    },
  },
  tickerLabel: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 3,
    backgroundColor: theme.palette.type === 'dark' ? '#121212' : '#ffffff',
    padding: '4px 12px',
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  tickerLabelText: {
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: theme.palette.primary.main,
  },
  tickerScroll: {
    display: 'flex',
    alignItems: 'center',
    gap: 48,
    paddingLeft: 120,
    animation: '$tickerScroll 90s linear infinite',
    '&:hover': {
      animationPlayState: 'paused',
    },
  },
  '@keyframes tickerScroll': {
    '0%': {
      transform: 'translateX(0)',
    },
    '100%': {
      transform: 'translateX(-50%)',
    },
  },
  tickerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  tickerIcon: {
    fontSize: 18,
    flexShrink: 0,
    opacity: 0.9,
  },
  tickerText: {
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: 0.2,
  },
  tickerDivider: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    backgroundColor: theme.palette.text.disabled,
    opacity: 0.4,
    flexShrink: 0,
  },
}));

// ---------------------------------------------------------------------------
// Helper: CSP chip
// ---------------------------------------------------------------------------
const CspChip = ({ csp }: { csp: string }) => {
  const classes = useStyles();
  const chipClass =
    csp === 'azure' ? classes.azureChip :
    csp === 'aws' ? classes.awsChip :
    csp === 'gcp' ? classes.gcpChip : undefined;
  return <Chip size="small" label={csp.toUpperCase()} className={chipClass} />;
};

// ---------------------------------------------------------------------------
// Types for mock data (will be replaced with real API calls)
// ---------------------------------------------------------------------------
interface PullRequest {
  id: number;
  title: string;
  repo: string;
  author: string;
  authorAvatar: string;
  owner: string;
  status: 'open' | 'review' | 'approved';
  checkStatus: 'passing' | 'failing' | 'pending';
  newComments: number;
  reviewers: string[];
  createdAt: string;
  updatedAt: string;
  url: string;
}

interface SecurityFinding {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  cluster: string;
  category: string;
  age: string;
}

// ---------------------------------------------------------------------------
// My Clusters Widget
// ---------------------------------------------------------------------------
const MyClustersWidget = () => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const [clusters, setClusters] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await catalogApi.getEntities({
          filter: {
            kind: 'Resource',
            'spec.type': 'kubernetes-cluster',
          },
        });
        setClusters(response.items);
      } catch {
        // If catalog has no clusters yet, just show empty
        setClusters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClusters();
  }, [catalogApi]);

  const getCsp = (entity: Entity) =>
    entity.metadata.annotations?.['morgan-stanley.com/csp'] ||
    (entity as any).spec?.csp ||
    'unknown';

  const getEnv = (entity: Entity) =>
    entity.metadata.annotations?.['morgan-stanley.com/environment'] ||
    (entity as any).spec?.environment ||
    '—';

  const getStatus = (entity: Entity) =>
    entity.metadata.annotations?.['morgan-stanley.com/cluster-status'] || 'running';

  const filteredClusters = clusters.filter(cluster => {
    const haystack = [
      cluster.metadata.name,
      cluster.metadata.description || '',
      getEnv(cluster),
      getCsp(cluster),
      getStatus(cluster),
      ...(cluster.metadata.tags || []),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(filterQuery.trim().toLowerCase());
  });

  const statusChipClass = (status: string) => {
    if (status === 'running') return classes.clusterStatusRunning;
    if (status === 'updating') return classes.clusterStatusUpdating;
    return classes.clusterStatusStopped;
  };

  const statusIcon = (status: string) => {
    if (status === 'running') return <CheckCircleIcon className={classes.clusterStatusIcon} />;
    if (status === 'updating') return <AutorenewIcon className={classes.clusterStatusIcon} />;
    return <HighlightOffIcon className={classes.clusterStatusIcon} />;
  };

  const statusLabel = (status: string) => {
    if (status === 'running') return 'Running';
    if (status === 'updating') return 'Updating';
    return 'Stopped';
  };

  const applyFilterFromChip = (
    value: string,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setFilterQuery(value);
  };

  return (
    <Card className={`${classes.widgetCard} ${classes.widgetMedium}`}>
      <CardHeader
        title="My Clusters"
        titleTypographyProps={{ variant: 'h6' }}
        avatar={<StorageIcon color="primary" />}
        action={
          <LinkButton to="/clusters" color="primary">
            View All
          </LinkButton>
        }
      />
      <Divider />
      <CardContent style={{ padding: 0 }} className={classes.widgetBody}>
        <Box className={classes.clusterFilterBar}>
          <Box className={classes.githubFilter} style={{ width: '100%' }}>
            <SearchIcon fontSize="small" color="action" />
            <InputBase
              placeholder="Filter clusters by name, env, cloud, status, tag"
              className={classes.clusterFilterInput}
              value={filterQuery}
              onChange={event => setFilterQuery(event.target.value)}
            />
            {filterQuery && (
              <IconButton size="small" onClick={() => setFilterQuery('')}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
        {loading && <LinearProgress />}
        {!loading && filteredClusters.length === 0 && (
          <Box className={classes.emptyState}>
            <CloudIcon style={{ fontSize: 48, opacity: 0.3 }} />
            <Typography variant="body1" style={{ marginTop: 8 }}>
              No clusters found
            </Typography>
            <Typography variant="body2">
              {filterQuery
                ? 'Try changing your filter'
                : 'Deploy your first cluster to get started'}
            </Typography>
            {!filterQuery && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                style={{ marginTop: 16 }}
                component={Link}
                to="/create/templates/default/kubernetes-cluster-provisioner"
              >
                Deploy Cluster
              </Button>
            )}
          </Box>
        )}
        <List disablePadding>
          {filteredClusters.slice(0, 6).map(cluster => {
            const status = getStatus(cluster);
            return (
              <ListItem
                key={cluster.metadata.name}
                className={classes.clusterRow}
                button
                component={Link}
                to={`/clusters/${cluster.metadata.name}`}
              >
                <ListItemIcon>
                  {status === 'running' ? (
                    <StatusOK />
                  ) : status === 'updating' ? (
                    <StatusWarning />
                  ) : (
                    <StatusAborted />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box className={classes.clusterTitleRow}>
                      <Typography className={classes.clusterPrimaryText}>
                        {cluster.metadata.name}
                      </Typography>
                      <Box className={`${classes.clusterStatusAlert} ${statusChipClass(status)}`}>
                        {statusIcon(status)}
                        {statusLabel(status)}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography className={classes.clusterSecondaryText}>
                        {cluster.metadata.description || 'No description provided'}
                      </Typography>
                      <Box className={classes.clusterTagsRow}>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`env:${getEnv(cluster)}`}
                          className={classes.clusterTagChip}
                          clickable
                          onClick={event => applyFilterFromChip(getEnv(cluster), event)}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`cloud:${getCsp(cluster)}`}
                          className={classes.clusterTagChip}
                          clickable
                          onClick={event => applyFilterFromChip(getCsp(cluster), event)}
                        />
                        {(cluster.metadata.tags || []).slice(0, 2).map(tag => (
                          <Chip
                            key={`${cluster.metadata.name}-${tag}`}
                            size="small"
                            variant="outlined"
                            label={tag}
                            className={classes.clusterTagChip}
                            clickable
                            onClick={event => applyFilterFromChip(tag, event)}
                          />
                        ))}
                      </Box>
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// Open Pull Requests Widget
// ---------------------------------------------------------------------------
const PullRequestsWidget = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');

  // In production, this would call the GitHub API via the proxy backend.
  // For now we render placeholder data that demonstrates the layout.
  const [pullRequests] = useState<PullRequest[]>([
    {
      id: 1,
      title: 'feat: upgrade cluster prod-trading-aks to 1.31',
      repo: 'kaas-clusters/prod-trading-aks',
      author: 'jdoe',
      authorAvatar: '',
      owner: 'jdoe',
      status: 'review',
      checkStatus: 'passing',
      newComments: 2,
      reviewers: ['asmith', 'mchen'],
      createdAt: '1 day ago',
      updatedAt: '2 hours ago',
      url: '#',
    },
    {
      id: 2,
      title: 'chore: add network-policy addon to staging-risk-eks',
      repo: 'kaas-clusters/staging-risk-eks',
      author: 'asmith',
      authorAvatar: '',
      owner: 'asmith',
      status: 'open',
      checkStatus: 'pending',
      newComments: 1,
      reviewers: ['jdoe'],
      createdAt: '2 days ago',
      updatedAt: '5 hours ago',
      url: '#',
    },
    {
      id: 3,
      title: 'fix: update Prometheus remote-write endpoint',
      repo: 'kaas-platform/monitoring-config',
      author: 'mchen',
      authorAvatar: '',
      owner: 'mchen',
      status: 'approved',
      checkStatus: 'passing',
      newComments: 0,
      reviewers: ['jdoe', 'asmith'],
      createdAt: '3 days ago',
      updatedAt: '1 day ago',
      url: '#',
    },
    {
      id: 4,
      title: 'feat: provision new GKE cluster for wealth-mgmt',
      repo: 'kaas-clusters/wealth-mgmt-gke',
      author: 'jdoe',
      authorAvatar: '',
      owner: 'jdoe',
      status: 'open',
      checkStatus: 'failing',
      newComments: 4,
      reviewers: ['mchen'],
      createdAt: '1 day ago',
      updatedAt: '1 day ago',
      url: '#',
    },
  ]);

  const tabConfig = [
    { label: 'Pull Requests', key: 'pull-requests' },
    { label: 'Code Reviews', key: 'code-reviews' },
    { label: 'Recently Merged', key: 'recently-merged' },
    { label: 'Find Any Commit', key: 'find-any-commit' },
  ];

  const dataByTab = [
    pullRequests,
    pullRequests.filter(pr => pr.status === 'review'),
    pullRequests.filter(pr => pr.status === 'approved'),
    pullRequests,
  ];

  const visibleRows = dataByTab[activeTab].filter(pr =>
    `${pr.title} ${pr.repo} ${pr.owner}`.toLowerCase().includes(filterQuery.toLowerCase()),
  );

  const checkChip = (status: PullRequest['checkStatus']) => {
    if (status === 'passing') {
      return <Chip size="small" label="Passing" className={classes.githubChipCompact} style={{ backgroundColor: 'rgba(76,175,80,0.18)', color: '#66BB6A' }} />;
    }
    if (status === 'failing') {
      return <Chip size="small" label="Failing" className={classes.githubChipCompact} style={{ backgroundColor: 'rgba(244,67,54,0.18)', color: '#EF5350' }} />;
    }
    return <Chip size="small" label="Pending" className={classes.githubChipCompact} style={{ backgroundColor: 'rgba(255,152,0,0.18)', color: '#FFB74D' }} />;
  };

  const reviewerColor = (reviewer: string) => {
    const palette = ['#1F6FEB', '#7C3AED', '#0EA5A4', '#DC2626', '#D97706', '#2E7D32'];
    const hash = reviewer
      .split('')
      .reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0);
    return palette[hash % palette.length];
  };

  return (
    <Card className={`${classes.widgetCard} ${classes.widgetMedium}`}>
      <CardHeader
        title="GitHub"
        titleTypographyProps={{ variant: 'h6' }}
        avatar={<GitHubIcon />}
        action={
          <Chip
            size="small"
            label={`${pullRequests.filter(pr => pr.status === 'open' || pr.status === 'review').length} open`}
            color="primary"
            variant="outlined"
          />
        }
      />
      <Divider />
      <CardContent style={{ padding: 0 }} className={classes.widgetBody}>
        <Box className={classes.githubToolbar}>
          <Box className={classes.githubFilter}>
            <SearchIcon style={{ fontSize: 16, opacity: 0.7 }} />
            <InputBase
              placeholder="Filter issues"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              className={classes.githubFilterInput}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Tooltip title="Expand">
              <IconButton size="small">
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          className={classes.githubTabs}
        >
          {tabConfig.map(tab => (
            <Tab key={tab.key} label={tab.label} />
          ))}
        </Tabs>

        <Box className={classes.githubTableHeader}>
          <Typography className={classes.githubHeaderText}>Title</Typography>
          <Typography className={classes.githubHeaderText}>Repo</Typography>
          <Typography className={classes.githubHeaderText}>Owner</Typography>
          <Typography className={classes.githubHeaderText}>Check/Build</Typography>
          <Typography className={classes.githubHeaderText}>Comments</Typography>
          <Typography className={classes.githubHeaderText}>Reviewers</Typography>
          <Typography className={classes.githubHeaderText}>Created</Typography>
          <Typography className={classes.githubHeaderText}>Updated</Typography>
        </Box>

        {visibleRows.map(pr => (
          <Box key={pr.id} className={classes.githubRow}>
            <Box>
              <a href={pr.url} target="_blank" rel="noopener noreferrer" className={classes.githubTitleLink}>
                {pr.title}
              </a>
            </Box>
            <Typography className={classes.githubCellText}>{pr.repo}</Typography>
            <Typography className={classes.githubCellText}>{pr.owner}</Typography>
            <Box>{checkChip(pr.checkStatus)}</Box>
            <Typography className={classes.githubCellText}>{pr.newComments}</Typography>
            <Box className={classes.githubReviewers}>
              {pr.reviewers.length === 0 && (
                <Typography className={classes.githubReviewerEmpty}>—</Typography>
              )}
              {pr.reviewers.slice(0, 2).map(reviewer => (
                <Tooltip key={reviewer} title={reviewer}>
                  <Avatar
                    className={classes.githubReviewerAvatar}
                    style={{ backgroundColor: reviewerColor(reviewer) }}
                  >
                    {reviewer.slice(0, 2).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
              {pr.reviewers.length > 2 && (
                <Chip
                  size="small"
                  label={`+${pr.reviewers.length - 2}`}
                  className={classes.githubReviewerMore}
                  variant="outlined"
                />
              )}
            </Box>
            <Typography className={classes.githubCellText}>{pr.createdAt}</Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" style={{ gap: 8 }}>
              <Typography className={classes.githubCellText}>{pr.updatedAt}</Typography>
              <Tooltip title="Open in GitHub">
                <IconButton size="small" href={pr.url} target="_blank" rel="noopener noreferrer">
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))}

        {visibleRows.length === 0 && (
          <Box className={classes.emptyState}>
            <Typography variant="body2">No matching GitHub items.</Typography>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" endIcon={<ArrowForwardIcon />}>
          Open GitHub
        </Button>
      </CardActions>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// Security Findings Widget
// ---------------------------------------------------------------------------
const SecurityFindingsWidget = () => {
  const classes = useStyles();

  // In production, these would come from a security scanning backend (Trivy, Falco, etc.)
  const [findings] = useState<SecurityFinding[]>([
    {
      id: 'CVE-2026-1234',
      title: 'Critical container image vulnerability in nginx:1.24',
      severity: 'critical',
      cluster: 'prod-trading-aks',
      category: 'Container Image',
      age: '2 days',
    },
    {
      id: 'POL-5678',
      title: 'Pod running as root in namespace payments',
      severity: 'high',
      cluster: 'prod-trading-aks',
      category: 'Pod Security',
      age: '5 days',
    },
    {
      id: 'NET-9012',
      title: 'Missing network policy for namespace analytics',
      severity: 'high',
      cluster: 'staging-risk-eks',
      category: 'Network Policy',
      age: '1 week',
    },
    {
      id: 'SEC-3456',
      title: 'TLS certificate expiring in 14 days',
      severity: 'medium',
      cluster: 'dev-platform-gke',
      category: 'Certificate',
      age: '3 days',
    },
    {
      id: 'RBAC-7890',
      title: 'Over-privileged service account in namespace ci-cd',
      severity: 'medium',
      cluster: 'staging-risk-eks',
      category: 'RBAC',
      age: '2 weeks',
    },
  ]);

  const severityCounts = findings.reduce(
    (acc, f) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const severityClass = (sev: string) =>
    sev === 'critical' ? classes.criticalFinding :
    sev === 'high' ? classes.highFinding :
    classes.mediumFinding;

  const severityIcon = (sev: string) =>
    sev === 'critical' ? <ErrorIcon style={{ color: '#F44336' }} /> :
    sev === 'high' ? <WarningIcon style={{ color: '#FF9800' }} /> :
    <WarningIcon style={{ color: '#FFC107' }} />;

  return (
    <Card className={`${classes.widgetCard} ${classes.widgetTall}`}>
      <CardHeader
        title="Security Findings"
        titleTypographyProps={{ variant: 'h6' }}
        avatar={<SecurityIcon color="error" />}
        action={
          <Box display="flex" gridGap={4}>
            {severityCounts.critical && (
              <Chip size="small" label={`${severityCounts.critical} Critical`} style={{ backgroundColor: '#F44336', color: '#fff', fontWeight: 600, fontSize: '0.7rem' }} />
            )}
            {severityCounts.high && (
              <Chip size="small" label={`${severityCounts.high} High`} style={{ backgroundColor: '#FF9800', color: '#fff', fontWeight: 600, fontSize: '0.7rem' }} />
            )}
            {severityCounts.medium && (
              <Chip size="small" label={`${severityCounts.medium} Medium`} style={{ backgroundColor: '#FFC107', color: '#000', fontWeight: 600, fontSize: '0.7rem' }} />
            )}
          </Box>
        }
      />
      <Divider />
      <CardContent style={{ padding: 0 }} className={classes.widgetBody}>
        <List disablePadding>
          {findings.map(finding => (
            <ListItem key={finding.id} className={severityClass(finding.severity)}>
              <ListItemIcon>{severityIcon(finding.severity)}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" style={{ fontWeight: 500 }}>
                    {finding.title}
                  </Typography>
                }
                secondary={
                  <span>
                    <Chip size="small" label={finding.id} variant="outlined" style={{ marginRight: 6, fontSize: '0.65rem', height: 20 }} />
                    {finding.cluster} · {finding.category} · {finding.age} old
                  </span>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" endIcon={<ArrowForwardIcon />}>
          View all findings
        </Button>
      </CardActions>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// Cluster Cost Widget
// ---------------------------------------------------------------------------
interface ClusterCost {
  name: string;
  csp: string;
  monthlyCost: number;
  trend: number; // percent change from previous month
}

const ClusterCostWidget = () => {
  const classes = useStyles();

  // In production, costs would come from cloud billing APIs (Azure Cost Management,
  // AWS Cost Explorer, GCP Billing) via the proxy backend.
  const [costs] = useState<ClusterCost[]>([
    { name: 'prod-trading-aks', csp: 'azure', monthlyCost: 12450, trend: 3.2 },
    { name: 'prod-settlement-aks', csp: 'azure', monthlyCost: 8920, trend: -1.5 },
    { name: 'staging-risk-eks', csp: 'aws', monthlyCost: 6340, trend: 12.1 },
    { name: 'prod-analytics-eks', csp: 'aws', monthlyCost: 9870, trend: -4.3 },
    { name: 'dev-platform-gke', csp: 'gcp', monthlyCost: 3210, trend: 0.8 },
    { name: 'staging-wealth-gke', csp: 'gcp', monthlyCost: 4560, trend: 5.6 },
  ]);

  const totalCost = costs.reduce((sum, c) => sum + c.monthlyCost, 0);
  const avgTrend = costs.reduce((sum, c) => sum + c.trend, 0) / costs.length;

  const cspTotals = costs.reduce(
    (acc, c) => {
      acc[c.csp] = (acc[c.csp] || 0) + c.monthlyCost;
      return acc;
    },
    {} as Record<string, number>,
  );

  const cspColors: Record<string, string> = {
    azure: '#0078D4',
    aws: '#FF9900',
    gcp: '#34A853',
  };

  const formatCost = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toLocaleString()}`;

  return (
    <Card className={`${classes.widgetCard} ${classes.widgetMedium}`}>
      <CardHeader
        title="Cluster Costs"
        titleTypographyProps={{ variant: 'h6' }}
        avatar={<AttachMoneyIcon style={{ color: '#4CAF50' }} />}
        subheader="Monthly estimated spend"
      />
      <Divider />
      <CardContent className={classes.widgetBody}>
        {/* Total + Trend */}
        <Box className={classes.costHeader}>
          <Box>
            <Typography className={classes.costTotal}>
              ${totalCost.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              this month
            </Typography>
          </Box>
          <Box className={avgTrend >= 0 ? classes.costTrendUp : classes.costTrendDown}>
            {avgTrend >= 0 ? (
              <TrendingUpIcon style={{ fontSize: 16 }} />
            ) : (
              <TrendingDownIcon style={{ fontSize: 16 }} />
            )}
            {Math.abs(avgTrend).toFixed(1)}% vs last month
          </Box>
        </Box>

        {/* CSP Breakdown Bar */}
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          {Object.entries(cspTotals).map(([csp, total]) => (
            <Box key={csp} display="flex" alignItems="center" style={{ gap: 4 }}>
              <Box
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: cspColors[csp] || '#999',
                }}
              />
              <Typography variant="caption" style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                {csp} — {formatCost(total)}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box className={classes.costBar}>
          {Object.entries(cspTotals).map(([csp, total]) => (
            <Box
              key={csp}
              className={classes.costBarSegment}
              style={{
                width: `${(total / totalCost) * 100}%`,
                backgroundColor: cspColors[csp] || '#999',
              }}
            />
          ))}
        </Box>

        {/* Per-Cluster Costs */}
        <Typography variant="subtitle2" color="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1.2, fontSize: '0.7rem', marginBottom: 4 }}>
          Per Cluster
        </Typography>
        {costs
          .sort((a, b) => b.monthlyCost - a.monthlyCost)
          .map(c => (
            <Box key={c.name} className={classes.costClusterRow}>
              <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                <Typography className={classes.costClusterName}>{c.name}</Typography>
                <CspChip csp={c.csp} />
              </Box>
              <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                <Typography className={classes.costClusterAmount}>
                  {formatCost(c.monthlyCost)}
                </Typography>
                <Typography
                  variant="caption"
                  className={c.trend >= 0 ? classes.costTrendUp : classes.costTrendDown}
                >
                  {c.trend >= 0 ? '+' : ''}{c.trend.toFixed(1)}%
                </Typography>
              </Box>
            </Box>
          ))}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" endIcon={<ArrowForwardIcon />}>
          View detailed cost report
        </Button>
      </CardActions>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// PagerDuty Widget (inspired by Pinterest's PinConsole PagerDuty integration)
// ---------------------------------------------------------------------------
interface PagerDutyIncident {
  id: string;
  title: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'triggered' | 'acknowledged' | 'resolved';
  service: string;
  cluster: string;
  assignee: string;
  createdAt: string;
  url: string;
}

const PagerDutyWidget = () => {
  const classes = useStyles();

  // In production, this would use the PagerDuty REST API via proxy backend
  const [incidents] = useState<PagerDutyIncident[]>([
    {
      id: 'INC-4521',
      title: 'High API latency on prod-trading-aks',
      severity: 'P2',
      status: 'acknowledged',
      service: 'trading-api',
      cluster: 'prod-trading-aks',
      assignee: 'jdoe',
      createdAt: '35 min ago',
      url: '#',
    },
    {
      id: 'INC-4519',
      title: 'etcd leader election failures on staging-risk-eks',
      severity: 'P1',
      status: 'triggered',
      service: 'kubernetes-control-plane',
      cluster: 'staging-risk-eks',
      assignee: 'oncall-infra',
      createdAt: '12 min ago',
      url: '#',
    },
    {
      id: 'INC-4517',
      title: 'Pod CrashLoopBackOff in namespace wealth-api',
      severity: 'P3',
      status: 'acknowledged',
      service: 'wealth-api',
      cluster: 'staging-wealth-gke',
      assignee: 'asmith',
      createdAt: '2 hours ago',
      url: '#',
    },
  ]);

  const onCallSchedule = [
    {
      role: 'Primary On-Call',
      name: 'Jane Doe (jdoe)',
      email: 'jdoe@morganstanley.com',
      teamsUser: 'jdoe@morganstanley.com',
      until: 'Feb 17, 09:00',
    },
    {
      role: 'Secondary On-Call',
      name: 'Alex Smith (asmith)',
      email: 'asmith@morganstanley.com',
      teamsUser: 'asmith@morganstanley.com',
      until: 'Feb 17, 09:00',
    },
  ];

  const sevColor = (sev: string) =>
    sev === 'P1' ? '#F44336' :
    sev === 'P2' ? '#FF9800' :
    sev === 'P3' ? '#FFC107' : '#8BC34A';

  const statusLabel = (status: string) => {
    if (status === 'triggered') return <Chip size="small" label="Triggered" style={{ backgroundColor: '#F44336', color: '#fff', fontWeight: 600, fontSize: '0.65rem', height: 20 }} />;
    if (status === 'acknowledged') return <Chip size="small" label="Ack'd" style={{ backgroundColor: '#FF9800', color: '#fff', fontWeight: 600, fontSize: '0.65rem', height: 20 }} />;
    return <Chip size="small" label="Resolved" style={{ backgroundColor: '#4CAF50', color: '#fff', fontWeight: 600, fontSize: '0.65rem', height: 20 }} />;
  };

  return (
    <Card className={`${classes.widgetCard} ${classes.widgetTall}`}>
      <CardHeader
        title="PagerDuty"
        titleTypographyProps={{ variant: 'h6' }}
        avatar={<NotificationsActiveIcon style={{ color: '#06AC38' }} />}
        action={
          <Chip
            size="small"
            label={`${incidents.filter(i => i.status !== 'resolved').length} active`}
            style={{ backgroundColor: '#F44336', color: '#fff', fontWeight: 600, fontSize: '0.7rem' }}
          />
        }
      />
      <Divider />
      <CardContent className={classes.widgetBody}>
        {/* On-call status */}
        <Typography variant="caption" color="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1.2, fontSize: '0.65rem', fontWeight: 600 }}>
          On-Call Now
        </Typography>
        <Box mt={0.5} mb={2}>
          {onCallSchedule.map(oc => (
            <Box key={oc.role} className={classes.onCallBadge}>
              <PhoneInTalkIcon style={{ color: '#4CAF50', fontSize: 18 }} />
              <Box flex={1}>
                <Typography variant="body2" style={{ fontWeight: 600, fontSize: '0.8rem' }}>{oc.name}</Typography>
                <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.7rem' }}>
                  {oc.role} · until {oc.until}
                </Typography>
              </Box>
              <Box className={classes.onCallActions}>
                <Tooltip title="Chat in Microsoft Teams">
                  <IconButton
                    size="small"
                    className={classes.teamsIconButton}
                    href={`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(oc.teamsUser)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/logos/microsoft-teams.svg"
                      alt="Microsoft Teams"
                      className={classes.teamsIcon}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Send email">
                  <IconButton
                    size="small"
                    href={`mailto:${oc.email}`}
                    aria-label={`Email ${oc.name}`}
                  >
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Active incidents */}
        <Typography variant="caption" color="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1.2, fontSize: '0.65rem', fontWeight: 600 }}>
          Active Incidents
        </Typography>
        <Box mt={0.5}>
          {incidents.map(inc => (
            <Box key={inc.id} className={classes.incidentRow}>
              <Box className={classes.incidentSev} style={{ backgroundColor: sevColor(inc.severity) }} />
              <Box flex={1}>
                <Box display="flex" alignItems="center" style={{ gap: 6 }} mb={0.25}>
                  <Chip
                    size="small"
                    label={inc.severity}
                    style={{
                      backgroundColor: sevColor(inc.severity),
                      color: inc.severity === 'P3' ? '#000' : '#fff',
                      fontWeight: 700,
                      fontSize: '0.6rem',
                      height: 18,
                      minWidth: 28,
                    }}
                  />
                  {statusLabel(inc.status)}
                </Box>
                <Typography variant="body2" style={{ fontWeight: 500 }}>{inc.title}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {inc.service} · {inc.cluster} · {inc.assignee} · {inc.createdAt}
                </Typography>
              </Box>
              <Tooltip title="Open in PagerDuty">
                <IconButton size="small" href={inc.url} target="_blank" rel="noopener">
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" endIcon={<ArrowForwardIcon />}>
          Open PagerDuty
        </Button>
      </CardActions>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// Observability Quick-Links (Pinterest-inspired Statsboard widget)
// ---------------------------------------------------------------------------
const ObservabilityWidget = () => {
  const classes = useStyles();

  const dashboards = [
    { name: 'Cluster Overview', cluster: 'prod-trading-aks', lastViewed: '10 min ago', url: '/monitoring' },
    { name: 'API Gateway Latency', cluster: 'prod-trading-aks', lastViewed: '25 min ago', url: '/monitoring' },
    { name: 'Node Resource Usage', cluster: 'prod-analytics-eks', lastViewed: '1 hour ago', url: '/monitoring' },
    { name: 'Pod Scaling Events', cluster: 'staging-risk-eks', lastViewed: '2 hours ago', url: '/monitoring' },
  ];

  return (
    <Card className={`${classes.widgetCard} ${classes.widgetCompact}`}>
      <CardHeader
        title="Recent Dashboards"
        titleTypographyProps={{ variant: 'h6' }}
        avatar={<TimelineIcon style={{ color: '#9C27B0' }} />}
        subheader="Quick access to monitoring views"
      />
      <Divider />
      <CardContent style={{ padding: 0 }} className={classes.widgetBody}>
        <List disablePadding>
          {dashboards.map((d, i) => (
            <ListItem key={i} button component={Link} to={d.url}>
              <ListItemIcon>
                <TimelineIcon style={{ color: '#9C27B0' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" style={{ fontWeight: 500 }}>{d.name}</Typography>
                }
                secondary={`${d.cluster} · viewed ${d.lastViewed}`}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Open dashboard">
                  <IconButton size="small" component={Link} to={d.url}>
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" endIcon={<ArrowForwardIcon />} component={Link} to="/monitoring">
          Open Monitoring
        </Button>
      </CardActions>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// Quick Actions Bar
// ---------------------------------------------------------------------------
const QuickActions = () => {
  const classes = useStyles();

  const actions = [
    { icon: <CloudIcon className={classes.quickActionIcon} />, label: 'Deploy Cluster', to: '/create/templates/default/kubernetes-cluster-provisioner' },
    { icon: <UpdateIcon className={classes.quickActionIcon} />, label: 'Upgrade Cluster', to: '/create/templates/default/kubernetes-cluster-upgrade' },
    { icon: <TrendingUpIcon className={classes.quickActionIcon} />, label: 'Scale Cluster', to: '/create/templates/default/kubernetes-cluster-scale' },
    { icon: <SecurityIcon className={classes.quickActionIcon} />, label: 'Request Namespace', to: '/create/templates/default/kubernetes-namespace-request' },
    { icon: <AddCircleOutlineIcon className={classes.quickActionIcon} />, label: 'Manage Add-ons', to: '/create/templates/default/kubernetes-addon-management' },
    { icon: <StorageIcon className={classes.quickActionIcon} />, label: 'Browse Add-ons', to: '/addons' },
  ];

  return (
    <Paper variant="outlined" style={{ borderRadius: 12 }}>
      <Box px={2} pt={2} pb={1}>
        <Typography variant="subtitle2" color="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.7rem' }}>
          Quick Actions
        </Typography>
      </Box>
      <Grid container>
        {actions.map(action => (
          <Grid item xs={4} sm={2} key={action.label}>
            <Link to={action.to} className={classes.quickAction}>
              {action.icon}
              <Typography variant="caption" style={{ fontWeight: 500, textAlign: 'center' }}>
                {action.label}
              </Typography>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// ---------------------------------------------------------------------------
// Platform Stats — per-CSP cluster cards with 7-day histogram
// ---------------------------------------------------------------------------
type CspHistogramDay = { day: string; delta: number };
type CspStat = {
  provider: string;
  logo: string;
  color: string;
  count: number;
  histogram: CspHistogramDay[];
};

const MOCK_CSP_HISTOGRAM: Record<string, CspHistogramDay[]> = {
  azure: [
    { day: 'Mon', delta: 2 },
    { day: 'Tue', delta: 0 },
    { day: 'Wed', delta: -1 },
    { day: 'Thu', delta: 3 },
    { day: 'Fri', delta: 1 },
    { day: 'Sat', delta: 0 },
    { day: 'Sun', delta: -1 },
  ],
  aws: [
    { day: 'Mon', delta: 1 },
    { day: 'Tue', delta: 2 },
    { day: 'Wed', delta: 0 },
    { day: 'Thu', delta: -2 },
    { day: 'Fri', delta: 1 },
    { day: 'Sat', delta: 0 },
    { day: 'Sun', delta: 1 },
  ],
  gcp: [
    { day: 'Mon', delta: 0 },
    { day: 'Tue', delta: 1 },
    { day: 'Wed', delta: 1 },
    { day: 'Thu', delta: 0 },
    { day: 'Fri', delta: -1 },
    { day: 'Sat', delta: 0 },
    { day: 'Sun', delta: 2 },
  ],
};

const CSP_META: { key: string; provider: string; logo: string; color: string; filter: string }[] = [
  { key: 'azure', provider: 'Azure', logo: '/logos/azure.svg', color: '#0078D4', filter: 'azure' },
  { key: 'aws', provider: 'AWS', logo: '/logos/aws.svg', color: '#FF9900', filter: 'aws' },
  { key: 'gcp', provider: 'Google Cloud', logo: '/logos/gcp.svg', color: '#34A853', filter: 'gcp' },
];

const MiniHistogram = ({ data, color }: { data: CspHistogramDay[]; color: string }) => {
  const maxAbs = Math.max(...data.map(d => Math.abs(d.delta)), 1);
  const barMaxH = 32;
  return (
    <Box display="flex" alignItems="flex-end" justifyContent="center" gridGap={4}>
      {data.map(d => {
        const h = Math.max((Math.abs(d.delta) / maxAbs) * barMaxH, 4);
        const isNeg = d.delta < 0;
        return (
          <Tooltip key={d.day} title={`${d.day}: ${d.delta >= 0 ? '+' : ''}${d.delta}`} arrow>
            <Box
              style={{
                width: 14,
                height: h,
                borderRadius: 3,
                backgroundColor: isNeg ? '#EF5350' : color,
                opacity: d.delta === 0 ? 0.2 : 0.9,
                transition: 'height 0.3s ease',
                cursor: 'default',
              }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
};

// ---------------------------------------------------------------------------
// News Ticker Component
// ---------------------------------------------------------------------------
const NewsTicker = () => {
  const classes = useStyles();

  const newsItems = [
    {
      id: 1,
      type: 'tip',
      icon: <TipsAndUpdatesIcon />,
      text: '💡 Pro Tip: Use resource quotas to prevent namespaces from consuming excessive cluster resources',
      color: '#FF9800',
    },
    {
      id: 2,
      type: 'update',
      icon: <UpdateIcon />,
      text: '🚀 New: ArgoCD v2.10 now available with enhanced security features and improved GitOps workflows',
      color: '#2196F3',
    },
    {
      id: 3,
      type: 'news',
      icon: <AnnouncementIcon />,
      text: '📢 Platform News: Auto-scaling policies updated for GPU workloads - 35% efficiency improvement',
      color: '#9C27B0',
    },
    {
      id: 4,
      type: 'tip',
      icon: <TipsAndUpdatesIcon />,
      text: '💡 Best Practice: Enable pod security policies to enforce security standards across all namespaces',
      color: '#FF9800',
    },
    {
      id: 5,
      type: 'security',
      icon: <SecurityIcon />,
      text: '🔒 Security Alert: CVE-2024-21626 patches available - Update your container runtime to v1.7.14+',
      color: '#F44336',
    },
    {
      id: 6,
      type: 'performance',
      icon: <SpeedIcon />,
      text: '⚡ Performance: Horizontal Pod Autoscaling reduces costs by 20% during off-peak hours',
      color: '#4CAF50',
    },
    {
      id: 7,
      type: 'docs',
      icon: <SchoolIcon />,
      text: '📚 New Documentation: Kubernetes 1.30 migration guide with step-by-step instructions now available',
      color: '#00BCD4',
    },
    {
      id: 8,
      type: 'event',
      icon: <EventIcon />,
      text: '📅 Upcoming: Quarterly infrastructure review scheduled for Feb 28 - All teams invited',
      color: '#FF5722',
    },
    {
      id: 9,
      type: 'feature',
      icon: <NewReleasesIcon />,
      text: '✨ New Feature: AI Chat Bot now provides intelligent troubleshooting for cluster issues',
      color: '#E91E63',
    },
    {
      id: 10,
      type: 'tip',
      icon: <TipsAndUpdatesIcon />,
      text: '💡 Quick Tip: Use kubectl top nodes to monitor resource usage and identify bottlenecks',
      color: '#FF9800',
    },
    {
      id: 11,
      type: 'cost',
      icon: <TrendingUpIcon />,
      text: '💰 Cost Optimization: Spot instances can reduce compute costs by up to 70% for non-critical workloads',
      color: '#4CAF50',
    },
    {
      id: 12,
      type: 'tip',
      icon: <TipsAndUpdatesIcon />,
      text: '💡 Did you know? Liveness probes prevent zombie pods and improve overall cluster health',
      color: '#FF9800',
    },
  ];

  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...newsItems, ...newsItems];

  return (
    <Box className={classes.newsTicker}>
      <Box className={classes.tickerLabel}>
        <TimelineIcon style={{ fontSize: 16, color: '#1976D2' }} />
        <Typography className={classes.tickerLabelText}>
          Platform News
        </Typography>
      </Box>
      <Box className={classes.tickerScroll}>
        {duplicatedItems.map((item, idx) => (
          <Box key={`${item.id}-${idx}`} className={classes.tickerItem}>
            <Box className={classes.tickerIcon} style={{ color: item.color }}>
              {item.icon}
            </Box>
            <Typography className={classes.tickerText}>
              {item.text}
            </Typography>
            {idx < duplicatedItems.length - 1 && (
              <Box className={classes.tickerDivider} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const PlatformStats = () => {
  const catalogApi = useApi(catalogApiRef);
  const [cspStats, setCspStats] = useState<CspStat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await catalogApi.getEntities({
          filter: { kind: 'Resource', 'spec.type': 'kubernetes-cluster' },
        });
        const counts: Record<string, number> = { azure: 0, aws: 0, gcp: 0 };
        const workloadClusters = res.items.filter(e => {
          const tags = ((e.metadata?.tags ?? []) as string[]).map(t => t.toLowerCase());
          return !tags.includes('management-cluster');
        });
        workloadClusters.forEach(e => {
          const cspAnno = (
            (e.metadata?.annotations?.['morgan-stanley.com/csp'] as string) ??
            (e.metadata?.annotations?.['morgan-stanley.com/cloud-provider'] as string) ??
            ''
          ).toLowerCase();
          const system = ((e.spec as any)?.system ?? '').toLowerCase();
          const tags = ((e.metadata?.tags ?? []) as string[]).map(t => t.toLowerCase());
          const name = (e.metadata?.name ?? '').toLowerCase();

          if (cspAnno.includes('azure') || system.includes('azure') || tags.includes('azure') || name.includes('aks') || name.includes('azure'))
            counts.azure++;
          else if (cspAnno.includes('aws') || system.includes('aws') || tags.includes('aws') || name.includes('eks') || name.includes('aws'))
            counts.aws++;
          else if (cspAnno.includes('gcp') || system.includes('gcp') || tags.includes('gcp') || name.includes('gke') || name.includes('gcp'))
            counts.gcp++;
        });
        setCspStats(
          CSP_META.map(m => ({
            provider: m.provider,
            logo: m.logo,
            color: m.color,
            count: counts[m.key],
            histogram: MOCK_CSP_HISTOGRAM[m.key],
          })),
        );
      } catch {
        setCspStats(
          CSP_META.map(m => ({
            provider: m.provider,
            logo: m.logo,
            color: m.color,
            count: 0,
            histogram: MOCK_CSP_HISTOGRAM[m.key],
          })),
        );
      }
    };
    fetchStats();
  }, [catalogApi]);

  const weekNet = (h: CspHistogramDay[]) => h.reduce((s, d) => s + d.delta, 0);

  return (
    <Grid container spacing={3}>
      {cspStats.map(csp => {
        const net = weekNet(csp.histogram);
        return (
          <Grid item xs={12} sm={4} key={csp.provider}>
            <Link
              to={`/clusters?provider=${csp.provider.toLowerCase().replace(/\s+/g, '-')}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <Paper
                variant="outlined"
                style={{
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderBottom: `3px solid ${csp.color}`,
                  padding: '20px 24px 16px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  background: `linear-gradient(135deg, rgba(${csp.color === '#0078D4' ? '0,120,212' : csp.color === '#FF9900' ? '255,153,0' : '52,168,83'}, 0.06) 0%, transparent 60%)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(${csp.color === '#0078D4' ? '0,120,212' : csp.color === '#FF9900' ? '255,153,0' : '52,168,83'}, 0.2)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Top row: Logo + Provider name */}
                <Box display="flex" alignItems="center" gridGap={12} mb={2}>
                  <Box
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={csp.logo}
                      alt={csp.provider}
                      style={{ height: 32, width: 32, objectFit: 'contain' }}
                    />
                  </Box>
                  <Typography
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#fff',
                      letterSpacing: 0.3,
                    }}
                  >
                    {csp.provider}
                  </Typography>
                </Box>

                {/* Count row */}
                <Box display="flex" alignItems="baseline" gridGap={8} mb={1.5}>
                  <Typography
                    style={{
                      fontSize: '3rem',
                      fontWeight: 800,
                      lineHeight: 1,
                      color: csp.color,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {csp.count}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    clusters
                  </Typography>
                </Box>

                {/* Histogram + net change */}
                <Box
                  display="flex"
                  alignItems="flex-end"
                  justifyContent="space-between"
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: 12,
                  }}
                >
                  <MiniHistogram data={csp.histogram} color={csp.color} />
                  <Typography
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: net >= 0 ? '#66BB6A' : '#EF5350',
                      whiteSpace: 'nowrap',
                      marginLeft: 8,
                    }}
                  >
                    {net >= 0 ? `▲ +${net}` : `▼ ${net}`}
                    <span style={{ fontWeight: 400, opacity: 0.7, marginLeft: 3 }}>7d</span>
                  </Typography>
                </Box>
              </Paper>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
};

// ---------------------------------------------------------------------------
// Main Dashboard Page
// ---------------------------------------------------------------------------
export const KaasDashboard = () => {
  const classes = useStyles();

  return (
    <Page themeId="home">
      <Header
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <img src="/logos/kubernetes.svg" alt="Kubernetes" style={{ height: 36, width: 36 }} />
            Kubernetes Platform
          </span>
        }
        subtitle={
          <HeaderBannerLogos layout="dashboard" text="Morgan Stanley Kubernetes as a Service" />
        }
      />
      <Content>
        {/* Welcome Banner */}
        <Box className={classes.welcomeBanner}>
          <Box position="relative" zIndex={2}>
            <Box flex={1}>
              <Typography className={classes.welcomeTitle}>
                Welcome to the Kubernetes Platform
              </Typography>
              <Typography className={classes.welcomeSubtitle}>
                Deploy, manage, and monitor Kubernetes clusters across Azure, AWS, and GCP —
                all from a single pane of glass.
              </Typography>
              <Box display="flex" gridGap={12}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#FFFFFF', color: '#002F6C', fontWeight: 600 }}
                  startIcon={<CloudIcon />}
                  component={Link}
                  to="/create/templates/default/kubernetes-cluster-provisioner"
                >
                  Deploy a Cluster
                </Button>
                <Button
                  variant="outlined"
                  style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#FFFFFF' }}
                  component={Link}
                  to="/docs"
                >
                  Read the Docs
                </Button>
              </Box>
            </Box>
          </Box>
          <img
            src="/logos/rick-morty.png"
            alt="Rick and Morty"
            className={classes.welcomeMascot}
            style={{ right: 900, height: 200 }}
          />
          <img
            src="/logos/minions.png"
            alt="Minions mascot"
            className={classes.welcomeMascot}
          />
          <img
            src="/logos/dexter-lab.png"
            alt="Dexter Laboratory"
            className={classes.welcomeMascot}
            style={{ right: 100, height: 100 }}
          />
        </Box>

        {/* News Ticker */}
        <NewsTicker />

        {/* Platform Stats */}
        <Box mb={3}>
          <PlatformStats />
        </Box>

        {/* Quick Actions */}
        <Box mb={3}>
          <QuickActions />
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left column: Clusters + PRs + Observability */}
          <Grid item xs={12} md={7}>
            <Box className={classes.dashboardColumn}>
              <MyClustersWidget />
              <PullRequestsWidget />
              <ObservabilityWidget />
            </Box>
          </Grid>

          {/* Right column: PagerDuty + Costs + Security */}
          <Grid item xs={12} md={5}>
            <Box className={classes.dashboardColumn}>
              <PagerDutyWidget />
              <ClusterCostWidget />
              <SecurityFindingsWidget />
            </Box>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
