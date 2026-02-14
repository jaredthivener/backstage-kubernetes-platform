import { useState } from 'react';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  makeStyles,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Button,
  LinearProgress,
  Divider,
} from '@material-ui/core';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PhoneIcon from '@material-ui/icons/Phone';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AddIcon from '@material-ui/icons/Add';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useStyles = makeStyles(theme => ({
  heroBanner: {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #43A047 100%)',
    borderRadius: 16,
    padding: theme.spacing(4, 5),
    color: '#fff',
    marginBottom: theme.spacing(3),
    position: 'relative' as const,
    overflow: 'hidden',
  },
  heroPattern: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: '40%',
    opacity: 0.06,
    background:
      'repeating-linear-gradient(45deg, #fff 0px, #fff 2px, transparent 2px, transparent 16px)',
  },
  statCard: {
    borderRadius: 12,
    height: '100%',
    transition: 'box-shadow 0.2s',
    '&:hover': { boxShadow: theme.shadows[4] },
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.1,
  },
  statLabel: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  onCallCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  onCallRow: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': { borderBottom: 'none' },
    '&:hover': { backgroundColor: theme.palette.action.hover },
  },
  onCallAvatar: {
    marginRight: theme.spacing(1.5),
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  activeIndicator: {
    color: '#4CAF50',
    fontSize: 10,
    marginRight: 4,
  },
  inactiveIndicator: {
    color: '#9E9E9E',
    fontSize: 10,
    marginRight: 4,
  },
  typeChip: {
    fontWeight: 600,
    fontSize: '0.7rem',
  },
  kubernetesChip: {
    backgroundColor: '#326CE5',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.7rem',
  },
  meshChip: {
    backgroundColor: '#8061C3',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.7rem',
  },
  escalationChip: {
    backgroundColor: '#F44336',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.7rem',
  },
  priorityHigh: {
    color: '#F44336',
    fontWeight: 600,
  },
  priorityMedium: {
    color: '#FF9800',
    fontWeight: 600,
  },
  priorityLow: {
    color: '#4CAF50',
    fontWeight: 600,
  },
  tableCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  requestTypeSummary: {
    borderRadius: 12,
    padding: theme.spacing(2.5),
    height: '100%',
    transition: 'box-shadow 0.2s',
    '&:hover': { boxShadow: theme.shadows[4] },
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: theme.spacing(1),
  },
  tabRoot: {
    minWidth: 100,
    textTransform: 'none' as const,
    fontWeight: 600,
  },
}));

// ---------------------------------------------------------------------------
// Type badge helper
// ---------------------------------------------------------------------------
const TypeBadge = ({ type, classes }: { type: string; classes: ReturnType<typeof useStyles> }) => {
  const chipClass =
    type === 'kubernetes'
      ? classes.kubernetesChip
      : type === 'service-mesh'
      ? classes.meshChip
      : classes.escalationChip;
  const label =
    type === 'kubernetes'
      ? 'Kubernetes'
      : type === 'service-mesh'
      ? 'Service Mesh'
      : 'Escalation';
  return <Chip size="small" label={label} className={chipClass} />;
};

// ---------------------------------------------------------------------------
// Mock data — support requests
// ---------------------------------------------------------------------------
const supportRequests = [
  { id: 'SUP-4291', title: 'Pod eviction loop on prod-us-east-1', type: 'kubernetes', priority: 'high', status: 'open', assignee: 'Sarah Chen', created: '2 hours ago', cluster: 'prod-us-east-1' },
  { id: 'SUP-4290', title: 'Cilium network policy blocking cross-namespace traffic', type: 'service-mesh', priority: 'high', status: 'in-progress', assignee: 'James Rivera', created: '4 hours ago', cluster: 'prod-eu-west-1' },
  { id: 'SUP-4289', title: 'HPA not scaling — metrics-server OOM', type: 'kubernetes', priority: 'medium', status: 'open', assignee: 'Priya Agarwal', created: '6 hours ago', cluster: 'staging-us-west-2' },
  { id: 'SUP-4288', title: 'mTLS cert rotation failure in prod', type: 'service-mesh', priority: 'high', status: 'in-progress', assignee: 'David Kim', created: '8 hours ago', cluster: 'prod-ap-south-1' },
  { id: 'SUP-4287', title: 'P1 escalation — deployment pipeline blocked', type: 'escalation', priority: 'high', status: 'escalated', assignee: 'Sarah Chen', created: '10 hours ago', cluster: 'prod-us-east-1' },
  { id: 'SUP-4286', title: 'Ingress controller 502 errors after upgrade', type: 'kubernetes', priority: 'medium', status: 'open', assignee: 'Marcus Johnson', created: '12 hours ago', cluster: 'prod-eu-central-1' },
  { id: 'SUP-4285', title: 'Service mesh sidecar injection not working', type: 'service-mesh', priority: 'medium', status: 'resolved', assignee: 'Amara Okafor', created: '1 day ago', cluster: 'dev-us-east-2' },
  { id: 'SUP-4284', title: 'Node not-ready after kernel patch', type: 'kubernetes', priority: 'low', status: 'resolved', assignee: 'James Rivera', created: '1 day ago', cluster: 'staging-eu-west-1' },
  { id: 'SUP-4283', title: 'P1 escalation — data plane latency spike', type: 'escalation', priority: 'high', status: 'in-progress', assignee: 'David Kim', created: '1 day ago', cluster: 'prod-us-west-2' },
  { id: 'SUP-4282', title: 'Envoy proxy crash on canary deployment', type: 'service-mesh', priority: 'low', status: 'resolved', assignee: 'Priya Agarwal', created: '2 days ago', cluster: 'staging-ap-east-1' },
];

// ---------------------------------------------------------------------------
// Mock data — on-call schedule
// ---------------------------------------------------------------------------
const onCallSchedule = [
  {
    name: 'Sarah Chen',
    initials: 'SC',
    type: 'kubernetes',
    timezone: 'America/New_York (EST)',
    utcOffset: 'UTC-5',
    onCallStart: '06:00',
    onCallEnd: '18:00',
    isCurrentlyActive: true,
    phone: '+1 (212) 555-0142',
    slackHandle: '@sarah.chen',
    avatarColor: '#1976D2',
  },
  {
    name: 'James Rivera',
    initials: 'JR',
    type: 'kubernetes',
    timezone: 'America/Los_Angeles (PST)',
    utcOffset: 'UTC-8',
    onCallStart: '18:00',
    onCallEnd: '06:00',
    isCurrentlyActive: false,
    phone: '+1 (415) 555-0198',
    slackHandle: '@james.rivera',
    avatarColor: '#0097A7',
  },
  {
    name: 'David Kim',
    initials: 'DK',
    type: 'service-mesh',
    timezone: 'America/New_York (EST)',
    utcOffset: 'UTC-5',
    onCallStart: '06:00',
    onCallEnd: '18:00',
    isCurrentlyActive: true,
    phone: '+1 (646) 555-0311',
    slackHandle: '@david.kim',
    avatarColor: '#7B1FA2',
  },
  {
    name: 'Amara Okafor',
    initials: 'AO',
    type: 'service-mesh',
    timezone: 'Europe/London (GMT)',
    utcOffset: 'UTC+0',
    onCallStart: '08:00',
    onCallEnd: '20:00',
    isCurrentlyActive: true,
    phone: '+44 20 7946 0958',
    slackHandle: '@amara.okafor',
    avatarColor: '#C62828',
  },
  {
    name: 'Priya Agarwal',
    initials: 'PA',
    type: 'kubernetes',
    timezone: 'Asia/Kolkata (IST)',
    utcOffset: 'UTC+5:30',
    onCallStart: '09:00',
    onCallEnd: '21:00',
    isCurrentlyActive: false,
    phone: '+91 22 2652 1414',
    slackHandle: '@priya.agarwal',
    avatarColor: '#E65100',
  },
  {
    name: 'Marcus Johnson',
    initials: 'MJ',
    type: 'kubernetes',
    timezone: 'America/Chicago (CST)',
    utcOffset: 'UTC-6',
    onCallStart: '07:00',
    onCallEnd: '19:00',
    isCurrentlyActive: true,
    phone: '+1 (312) 555-0277',
    slackHandle: '@marcus.johnson',
    avatarColor: '#2E7D32',
  },
  {
    name: 'Yuki Tanaka',
    initials: 'YT',
    type: 'service-mesh',
    timezone: 'Asia/Tokyo (JST)',
    utcOffset: 'UTC+9',
    onCallStart: '09:00',
    onCallEnd: '21:00',
    isCurrentlyActive: false,
    phone: '+81 3 1234 5678',
    slackHandle: '@yuki.tanaka',
    avatarColor: '#AD1457',
  },
  {
    name: 'Liam O\'Brien',
    initials: 'LO',
    type: 'kubernetes',
    timezone: 'Europe/Dublin (IST)',
    utcOffset: 'UTC+1',
    onCallStart: '08:00',
    onCallEnd: '20:00',
    isCurrentlyActive: true,
    phone: '+353 1 234 5678',
    slackHandle: '@liam.obrien',
    avatarColor: '#00695C',
  },
];

// ---------------------------------------------------------------------------
// Summary statistics
// ---------------------------------------------------------------------------
const summaryStats = {
  kubernetes: { total: 42, open: 12, inProgress: 8, resolved: 22, avgResolution: '4.2h' },
  serviceMesh: { total: 28, open: 7, inProgress: 5, resolved: 16, avgResolution: '3.8h' },
  escalation: { total: 11, open: 3, inProgress: 4, resolved: 4, avgResolution: '1.5h' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const SupportPage = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [onCallFilter, setOnCallFilter] = useState<'all' | 'kubernetes' | 'service-mesh'>('all');

  const filteredRequests =
    tab === 0
      ? supportRequests
      : tab === 1
      ? supportRequests.filter(r => r.type === 'kubernetes')
      : tab === 2
      ? supportRequests.filter(r => r.type === 'service-mesh')
      : supportRequests.filter(r => r.type === 'escalation');

  const filteredOnCall =
    onCallFilter === 'all'
      ? onCallSchedule
      : onCallSchedule.filter(p => p.type === onCallFilter);

  const statusChip = (status: string) => {
    const colorMap: Record<string, string> = {
      open: '#2196F3',
      'in-progress': '#FF9800',
      resolved: '#4CAF50',
      escalated: '#F44336',
    };
    return (
      <Chip
        size="small"
        label={status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
        style={{ backgroundColor: colorMap[status] || '#9E9E9E', color: '#fff', fontWeight: 600, fontSize: '0.7rem' }}
      />
    );
  };

  const priorityLabel = (p: string) => {
    const cls = p === 'high' ? classes.priorityHigh : p === 'medium' ? classes.priorityMedium : classes.priorityLow;
    return <Typography variant="body2" className={cls}>{p.charAt(0).toUpperCase() + p.slice(1)}</Typography>;
  };

  return (
    <Page themeId="home">
      <Header
        title="Support"
        subtitle={
          <HeaderBannerLogos layout="support" text="On-call schedules, support requests & escalations" />
        }
      />
      <Content>
        {/* Hero Banner */}
        <Box className={classes.heroBanner}>
          <Box className={classes.heroPattern} />
          <Box position="relative" zIndex={1}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" style={{ fontWeight: 700, marginBottom: 8 }}>
                  <HeadsetMicIcon style={{ fontSize: 32, marginRight: 10, verticalAlign: 'middle' }} />
                  Platform Support Center
                </Typography>
                <Typography variant="body1" style={{ opacity: 0.85, maxWidth: 600, marginBottom: 16 }}>
                  Track active incidents, view on-call schedules across all time zones,
                  and manage support requests for Kubernetes and Service Mesh infrastructure.
                </Typography>
                <Box display="flex" gridGap={12}>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#fff', color: '#1B5E20', fontWeight: 600 }}
                    startIcon={<AddIcon />}
                  >
                    New Request
                  </Button>
                  <Button
                    variant="outlined"
                    style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
                    startIcon={<OpenInNewIcon />}
                  >
                    PagerDuty Dashboard
                  </Button>
                </Box>
              </Box>
              <Box display="flex" gridGap={16} style={{ flexShrink: 0 }}>
                {[
                  { label: 'Active On-Call', value: onCallSchedule.filter(p => p.isCurrentlyActive).length, color: '#A5D6A7' },
                  { label: 'Open Tickets', value: supportRequests.filter(r => r.status === 'open').length, color: '#90CAF9' },
                  { label: 'In Progress', value: supportRequests.filter(r => r.status === 'in-progress').length, color: '#FFCC80' },
                  { label: 'Escalations', value: supportRequests.filter(r => r.type === 'escalation' && r.status !== 'resolved').length, color: '#EF9A9A' },
                ].map(s => (
                  <Box key={s.label} textAlign="center" style={{ minWidth: 80 }}>
                    <Typography variant="h4" style={{ fontWeight: 800, color: s.color }}>{s.value}</Typography>
                    <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Request Type Summary Cards */}
        <Box mb={3}>
          <Typography className={classes.sectionTitle}>
            <TrendingUpIcon style={{ fontSize: 20 }} /> Requests by Type — Last 30 Days
          </Typography>
          <Grid container spacing={2}>
            {[
              { key: 'kubernetes', label: 'Kubernetes', color: '#326CE5', icon: '☸', stats: summaryStats.kubernetes },
              { key: 'serviceMesh', label: 'Service Mesh', color: '#8061C3', icon: '🔗', stats: summaryStats.serviceMesh },
              { key: 'escalation', label: 'Escalations', color: '#F44336', icon: '🔥', stats: summaryStats.escalation },
            ].map(cat => (
              <Grid item xs={12} md={4} key={cat.key}>
                <Card className={classes.requestTypeSummary} style={{ borderTop: `4px solid ${cat.color}` }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="subtitle2" style={{ color: cat.color, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {cat.icon} {cat.label}
                      </Typography>
                      <Typography className={classes.statValue} style={{ color: cat.color }}>{cat.stats.total}</Typography>
                      <Typography className={classes.statLabel}>total requests</Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="caption" style={{ fontWeight: 600 }}>
                        Avg Resolution
                      </Typography>
                      <Typography variant="h6" style={{ fontWeight: 700, color: '#333' }}>
                        {cat.stats.avgResolution}
                      </Typography>
                    </Box>
                  </Box>
                  <Box mt={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption" color="textSecondary">
                        Open: {cat.stats.open} &nbsp;|&nbsp; In Progress: {cat.stats.inProgress} &nbsp;|&nbsp; Resolved: {cat.stats.resolved}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(cat.stats.resolved / cat.stats.total) * 100}
                      className={classes.progressBar}
                      style={{
                        backgroundColor: `${cat.color}22`,
                      }}
                    />
                    <Typography variant="caption" color="textSecondary" style={{ marginTop: 4, display: 'block' }}>
                      {Math.round((cat.stats.resolved / cat.stats.total) * 100)}% resolved
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {/* Left column — Support Requests Table */}
          <Grid item xs={12} md={7}>
            <Card className={classes.tableCard}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    <WarningIcon style={{ fontSize: 20, marginRight: 6, verticalAlign: 'middle', color: '#FF9800' }} />
                    Support Requests
                  </Typography>
                  <Chip size="small" label={`${filteredRequests.length} tickets`} style={{ backgroundColor: '#E3F2FD', color: '#1565C0', fontWeight: 600 }} />
                </Box>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary" textColor="primary">
                  <Tab label="All" className={classes.tabRoot} />
                  <Tab label="Kubernetes" className={classes.tabRoot} />
                  <Tab label="Service Mesh" className={classes.tabRoot} />
                  <Tab label="Escalations" className={classes.tabRoot} />
                </Tabs>
                <Divider style={{ marginBottom: 8 }} />
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Title</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Priority</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Assignee</TableCell>
                        <TableCell style={{ fontWeight: 600 }}>Created</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRequests.map(req => (
                        <TableRow key={req.id} hover>
                          <TableCell>
                            <Typography variant="body2" style={{ fontWeight: 600, color: '#1976D2', fontFamily: 'monospace' }}>
                              {req.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" style={{ fontWeight: 500 }}>
                                {req.title}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {req.cluster}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <TypeBadge type={req.type} classes={classes} />
                          </TableCell>
                          <TableCell>{priorityLabel(req.priority)}</TableCell>
                          <TableCell>{statusChip(req.status)}</TableCell>
                          <TableCell>
                            <Typography variant="body2">{req.assignee}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="textSecondary">{req.created}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Right column — On-Call Schedule */}
          <Grid item xs={12} md={5}>
            <Card className={classes.onCallCard}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    <PhoneIcon style={{ fontSize: 20, marginRight: 6, verticalAlign: 'middle', color: '#4CAF50' }} />
                    Active On-Call Schedule
                  </Typography>
                  <Chip
                    size="small"
                    label={`${onCallSchedule.filter(p => p.isCurrentlyActive).length} active`}
                    style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }}
                  />
                </Box>
                <Box display="flex" gridGap={6} mb={2}>
                  {(['all', 'kubernetes', 'service-mesh'] as const).map(f => (
                    <Chip
                      key={f}
                      size="small"
                      label={f === 'all' ? 'All' : f === 'kubernetes' ? 'Kubernetes' : 'Service Mesh'}
                      onClick={() => setOnCallFilter(f)}
                      variant={onCallFilter === f ? 'default' : 'outlined'}
                      style={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        backgroundColor: onCallFilter === f ? (f === 'kubernetes' ? '#326CE5' : f === 'service-mesh' ? '#8061C3' : '#607D8B') : undefined,
                        color: onCallFilter === f ? '#fff' : undefined,
                      }}
                    />
                  ))}
                </Box>
                {filteredOnCall.map(person => (
                  <Box key={person.name} className={classes.onCallRow}>
                    <Tooltip title={person.slackHandle}>
                      <Avatar
                        className={classes.onCallAvatar}
                        style={{ backgroundColor: person.avatarColor, width: 38, height: 38 }}
                      >
                        {person.initials}
                      </Avatar>
                    </Tooltip>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gridGap={6}>
                        <FiberManualRecordIcon
                          className={person.isCurrentlyActive ? classes.activeIndicator : classes.inactiveIndicator}
                        />
                        <Typography variant="body2" style={{ fontWeight: 600 }}>
                          {person.name}
                        </Typography>
                        <TypeBadge type={person.type} classes={classes} />
                      </Box>
                      <Box display="flex" alignItems="center" gridGap={8} mt={0.5}>
                        <Typography variant="caption" color="textSecondary" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <AccessTimeIcon style={{ fontSize: 12 }} />
                          {person.onCallStart}–{person.onCallEnd} ({person.utcOffset})
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {person.timezone}
                      </Typography>
                    </Box>
                    <Tooltip title={`Call ${person.phone}`}>
                      <PhoneIcon style={{ fontSize: 16, color: '#9E9E9E', cursor: 'pointer' }} />
                    </Tooltip>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Box mt={3}>
              <Card className={classes.statCard}>
                <CardContent>
                  <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 12 }}>
                    <AccessTimeIcon style={{ fontSize: 20, marginRight: 6, verticalAlign: 'middle' }} />
                    Response Metrics
                  </Typography>
                  {[
                    { label: 'Mean Time to Acknowledge', value: '8 min', trend: '↓ 12%', trendColor: '#4CAF50' },
                    { label: 'Mean Time to Resolve', value: '3.4 hrs', trend: '↓ 8%', trendColor: '#4CAF50' },
                    { label: 'Escalation Rate', value: '13.6%', trend: '↑ 2%', trendColor: '#F44336' },
                    { label: 'SLA Compliance', value: '97.2%', trend: '↑ 1.5%', trendColor: '#4CAF50' },
                    { label: 'Open > 24h', value: '3', trend: '↓ 1', trendColor: '#4CAF50' },
                  ].map(metric => (
                    <Box key={metric.label} display="flex" justifyContent="space-between" alignItems="center" py={0.8}
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                    >
                      <Typography variant="body2" color="textSecondary">{metric.label}</Typography>
                      <Box display="flex" alignItems="center" gridGap={8}>
                        <Typography variant="body2" style={{ fontWeight: 700 }}>{metric.value}</Typography>
                        <Typography variant="caption" style={{ color: metric.trendColor, fontWeight: 600 }}>
                          {metric.trend}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>

            {/* Escalation Contacts */}
            <Box mt={3}>
              <Card className={classes.statCard}>
                <CardContent>
                  <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 12 }}>
                    <ErrorIcon style={{ fontSize: 20, marginRight: 6, verticalAlign: 'middle', color: '#F44336' }} />
                    Escalation Contacts
                  </Typography>
                  {[
                    { name: 'VP of Infrastructure', person: 'Richard Torres', phone: '+1 (212) 555-0100' },
                    { name: 'Director of SRE', person: 'Elena Volkov', phone: '+1 (212) 555-0200' },
                    { name: 'Platform Engineering Lead', person: 'Kevin Walsh', phone: '+1 (415) 555-0300' },
                    { name: 'Security Incident Response', person: 'Nadia Patel', phone: '+1 (646) 555-0400' },
                  ].map(contact => (
                    <Box key={contact.name} display="flex" justifyContent="space-between" alignItems="center" py={1}
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                    >
                      <Box>
                        <Typography variant="body2" style={{ fontWeight: 600 }}>{contact.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{contact.person}</Typography>
                      </Box>
                      <Tooltip title={`Call ${contact.phone}`}>
                        <Typography variant="caption" style={{ color: '#1976D2', cursor: 'pointer', fontWeight: 500 }}>
                          {contact.phone}
                        </Typography>
                      </Tooltip>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
