import { useState } from 'react';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';
import {
  Grid,
  Typography,
  Card,
  makeStyles,
  Box,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  Paper,
} from '@material-ui/core';
import SpeedIcon from '@material-ui/icons/Speed';
import TimelineIcon from '@material-ui/icons/Timeline';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import BuildIcon from '@material-ui/icons/Build';
import SecurityIcon from '@material-ui/icons/Security';
import LoopIcon from '@material-ui/icons/Loop';
import SettingsIcon from '@material-ui/icons/Settings';
import PeopleIcon from '@material-ui/icons/People';
import SchoolIcon from '@material-ui/icons/School';
import StorageIcon from '@material-ui/icons/Storage';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';

// ============================================================================
// Types
// ============================================================================
type MetricTier = 'elite' | 'high' | 'medium' | 'low';

interface DoraMetric {
  id: string;
  label: string;
  shortLabel: string;
  value: string;
  numericValue: number;
  unit: string;
  trend: number; // % change from last period
  trendLabel: string;
  tier: MetricTier;
  description: string;
  category: 'throughput' | 'stability';
  sparkline: number[]; // 12 data points (weeks)
  benchmarks: Record<MetricTier, string>;
}

interface CspDoraData {
  csp: string;
  cspLabel: string;
  color: string;
  logo: string;
  deploymentFrequency: string;
  leadTime: string;
  recoveryTime: string;
  changeFailRate: string;
  reworkRate: string;
  tier: MetricTier;
}

interface TeamArchetype {
  name: string;
  description: string;
  color: string;
  throughput: number; // 0-100
  stability: number; // 0-100
  wellbeing: number; // 0-100
  isCurrentTeam: boolean;
}

interface AiCapability {
  name: string;
  icon: React.ReactElement;
  score: number; // 0-100
  description: string;
  color: string;
}

// ============================================================================
// Styles
// ============================================================================
const useStyles = makeStyles(theme => ({
  // ------ Hero Metrics Cards ------
  heroCard: {
    borderRadius: 14,
    padding: theme.spacing(2.5),
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  },
  heroCardElite: {
    border: '1px solid rgba(46,125,50,0.15)',
  },
  heroCardHigh: {
    border: '1px solid rgba(0,120,212,0.15)',
  },
  heroCardMedium: {
    border: '1px solid rgba(255,143,0,0.15)',
  },
  heroCardLow: {
    border: '1px solid rgba(198,40,40,0.15)',
  },
  metricCategory: {
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
    marginBottom: theme.spacing(0.5),
  },
  metricLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
    lineHeight: 1.2,
  },
  gaugeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    margin: '8px 0',
    flex: 1,
  },
  gaugeValue: {
    fontSize: '1.6rem',
    fontWeight: 800,
    lineHeight: 1,
  },
  gaugeUnit: {
    fontSize: '0.65rem',
    fontWeight: 600,
    opacity: 0.7,
    marginTop: 2,
  },
  metricTrend: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: '0.72rem',
    fontWeight: 600,
  },
  sparkline: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 2,
    height: 28,
    marginTop: theme.spacing(1),
  },
  sparkBar: {
    flex: 1,
    borderRadius: 2,
    minWidth: 3,
    transition: 'height 0.3s ease',
  },
  tierBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    padding: '2px 8px',
    borderRadius: 6,
  },

  // ------ Section Headers ------
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
    marginTop: theme.spacing(4),
  },
  sectionIcon: {
    fontSize: 28,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  sectionSubtitle: {
    fontSize: '0.82rem',
    color: theme.palette.text.secondary,
    marginTop: -4,
  },

  // ------ Performance Tier Banner ------
  tierBanner: {
    borderRadius: 16,
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
  },
  tierBannerElite: {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
    color: '#fff',
  },
  tierBannerContent: {
    flex: 1,
  },
  tierBannerBadge: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  tierBannerLabel: {
    fontSize: '2.4rem',
    fontWeight: 900,
    letterSpacing: '-0.03em',
    lineHeight: 1,
  },
  tierBannerSub: {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
    opacity: 0.85,
    marginTop: 4,
  },
  tierBannerGlow: {
    position: 'absolute' as const,
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
  },
  tierBannerGlow2: {
    position: 'absolute' as const,
    bottom: -60,
    left: -20,
    width: 160,
    height: 160,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
  },

  // ------ CSP Comparison Table ------
  cspCard: {
    borderRadius: 14,
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[6],
    },
  },
  cspHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2, 2.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  cspLogo: {
    width: 36,
    height: 36,
    objectFit: 'contain' as const,
  },
  cspMetricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.2, 2.5),
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  cspMetricLabel: {
    fontSize: '0.78rem',
    color: theme.palette.text.secondary,
  },
  cspMetricValue: {
    fontSize: '0.85rem',
    fontWeight: 700,
  },
  cspTierChip: {
    borderRadius: 8,
    fontWeight: 700,
    fontSize: '0.65rem',
    letterSpacing: 0.8,
  },

  // ------ Team Archetypes ------
  archetypeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(2),
  },
  archetypeCard: {
    borderRadius: 14,
    padding: theme.spacing(2),
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'transform 0.2s ease',
    border: '1px solid transparent',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  archetypeActive: {
    border: '2px solid #2E7D32 !important',
    boxShadow: '0 0 20px rgba(46,125,50,0.2)',
  },
  archetypeName: {
    fontSize: '0.78rem',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    lineHeight: 1.2,
  },
  archetypeBarGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    marginTop: theme.spacing(1),
  },
  archetypeBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    background: 'rgba(128,128,128,0.15)',
  },
  archetypeBarFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.6s ease',
  },
  archetypeBarLabel: {
    fontSize: '0.6rem',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    color: theme.palette.text.secondary,
    textAlign: 'left' as const,
    display: 'flex',
    justifyContent: 'space-between',
  },
  archetypeYouBadge: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    fontSize: '0.55rem',
    fontWeight: 800,
    background: '#2E7D32',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },

  // ------ AI Capabilities ------
  aiCapGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: theme.spacing(2),
  },
  aiCapCard: {
    borderRadius: 14,
    padding: theme.spacing(2),
    textAlign: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  aiCapIcon: {
    fontSize: 32,
    marginBottom: theme.spacing(1),
  },
  aiCapName: {
    fontSize: '0.75rem',
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: theme.spacing(1),
  },
  aiCapScoreRing: {
    position: 'relative' as const,
    width: 56,
    height: 56,
    margin: '0 auto',
    marginBottom: theme.spacing(1),
  },
  aiCapScoreText: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '0.85rem',
    fontWeight: 800,
  },

  // ------ Benchmark Table ------
  benchmarkTable: {
    borderRadius: 14,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
  },
  benchmarkHeader: {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr',
    gap: 0,
    padding: theme.spacing(1.5, 2),
    background: 'rgba(0,47,108,0.06)',
    fontSize: '0.68rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: theme.palette.text.secondary,
  },
  benchmarkRow: {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr',
    gap: 0,
    padding: theme.spacing(1.5, 2),
    fontSize: '0.78rem',
    borderTop: `1px solid ${theme.palette.divider}`,
    transition: 'background 0.2s ease',
    '&:hover': {
      background: 'rgba(0,47,108,0.03)',
    },
  },
  benchmarkRowHighlight: {
    background: 'rgba(46,125,50,0.06)',
    fontWeight: 600,
    '&:hover': {
      background: 'rgba(46,125,50,0.1)',
    },
  },
  benchmarkTierCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontWeight: 700,
  },
  benchmarkDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },

  // ------ Trend Chart ------
  trendContainer: {
    borderRadius: 14,
    padding: theme.spacing(2.5),
    height: '100%',
  },
  trendChart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 3,
    height: 120,
    padding: '8px 0',
  },
  trendBar: {
    flex: 1,
    borderRadius: 3,
    minWidth: 6,
    transition: 'height 0.4s ease',
    cursor: 'pointer',
  },
  trendAxisLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.6rem',
    color: theme.palette.text.secondary,
    marginTop: 4,
  },
  trendTitle: {
    fontSize: '0.82rem',
    fontWeight: 700,
    marginBottom: theme.spacing(0.5),
  },
  trendValue: {
    fontSize: '1.4rem',
    fontWeight: 800,
    lineHeight: 1,
  },
}));

// ============================================================================
// DORA Color Constants
// ============================================================================
const TIER_COLORS: Record<MetricTier, string> = {
  elite: '#2E7D32',
  high: '#0078D4',
  medium: '#FF8F00',
  low: '#C62828',
};

const TIER_LABELS: Record<MetricTier, string> = {
  elite: 'Elite',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const CSP_COLORS = {
  azure: '#0078D4',
  aws: '#FF9900',
  gcp: '#4285F4',
};

// ============================================================================
// Mock Data — 5 DORA Metrics (2025 model)
// ============================================================================
const DORA_METRICS: DoraMetric[] = [
  {
    id: 'deployment-frequency',
    label: 'Deployment Frequency',
    shortLabel: 'Deploy Freq',
    value: '8.4',
    numericValue: 8.4,
    unit: 'deploys / day',
    trend: 12.3,
    trendLabel: 'vs last quarter',
    tier: 'elite',
    description: 'Average number of deployments across all KaaS clusters per day. Elite teams deploy multiple times per day.',
    category: 'throughput',
    sparkline: [5.2, 5.8, 6.1, 6.4, 6.2, 7.0, 7.3, 7.8, 7.5, 8.1, 8.0, 8.4],
    benchmarks: { elite: 'Multiple / day', high: '1x / day - 1x / week', medium: '1x / week - 1x / month', low: '< 1x / month' },
  },
  {
    id: 'change-lead-time',
    label: 'Change Lead Time',
    shortLabel: 'Lead Time',
    value: '42',
    numericValue: 42,
    unit: 'minutes',
    trend: -18.5,
    trendLabel: 'vs last quarter',
    tier: 'elite',
    description: 'Median time from code commit to running in production. Includes CI/CD pipeline, review, and deployment.',
    category: 'throughput',
    sparkline: [95, 88, 82, 76, 71, 65, 58, 55, 52, 48, 45, 42],
    benchmarks: { elite: '< 1 hour', high: '1 day - 1 week', medium: '1 week - 1 month', low: '> 1 month' },
  },
  {
    id: 'failed-deployment-recovery-time',
    label: 'Failed Deployment Recovery Time',
    shortLabel: 'Recovery Time',
    value: '18',
    numericValue: 18,
    unit: 'minutes',
    trend: -24.0,
    trendLabel: 'vs last quarter',
    tier: 'elite',
    description: 'Median time to recover from a failed deployment. Previously called MTTR. Fast recovery is a hallmark of elite teams.',
    category: 'throughput',
    sparkline: [45, 42, 38, 35, 31, 28, 26, 24, 22, 21, 19, 18],
    benchmarks: { elite: '< 1 hour', high: '< 1 day', medium: '1 day - 1 week', low: '> 1 week' },
  },
  {
    id: 'change-failure-rate',
    label: 'Change Failure Rate',
    shortLabel: 'Fail Rate',
    value: '2.8',
    numericValue: 2.8,
    unit: '%',
    trend: -8.2,
    trendLabel: 'vs last quarter',
    tier: 'elite',
    description: 'Percentage of deployments that require immediate intervention (rollback or hotfix). Lower is better.',
    category: 'stability',
    sparkline: [5.1, 4.8, 4.5, 4.2, 3.9, 3.6, 3.4, 3.2, 3.1, 3.0, 2.9, 2.8],
    benchmarks: { elite: '< 5%', high: '5% - 10%', medium: '10% - 15%', low: '> 15%' },
  },
  {
    id: 'deployment-rework-rate',
    label: 'Deployment Rework Rate',
    shortLabel: 'Rework Rate',
    value: '1.4',
    numericValue: 1.4,
    unit: '%',
    trend: -15.0,
    trendLabel: 'vs last quarter',
    tier: 'elite',
    description: 'Percentage of deployments that are unplanned but happen as a result of a production incident. New in the 2025 DORA model.',
    category: 'stability',
    sparkline: [3.8, 3.5, 3.2, 2.9, 2.7, 2.4, 2.2, 2.0, 1.8, 1.6, 1.5, 1.4],
    benchmarks: { elite: '< 2%', high: '2% - 5%', medium: '5% - 10%', low: '> 10%' },
  },
];

// ============================================================================
// Mock Data — Per-CSP DORA
// ============================================================================
const CSP_DORA: CspDoraData[] = [
  {
    csp: 'azure',
    cspLabel: 'Azure (AKS)',
    color: CSP_COLORS.azure,
    logo: '/logos/azure.svg',
    deploymentFrequency: '9.2 / day',
    leadTime: '38 min',
    recoveryTime: '14 min',
    changeFailRate: '2.1%',
    reworkRate: '0.9%',
    tier: 'elite',
  },
  {
    csp: 'aws',
    cspLabel: 'AWS (EKS)',
    color: CSP_COLORS.aws,
    logo: '/logos/aws.svg',
    deploymentFrequency: '8.1 / day',
    leadTime: '44 min',
    recoveryTime: '19 min',
    changeFailRate: '3.2%',
    reworkRate: '1.6%',
    tier: 'elite',
  },
  {
    csp: 'gcp',
    cspLabel: 'GCP (GKE)',
    color: CSP_COLORS.gcp,
    logo: '/logos/gcp.svg',
    deploymentFrequency: '7.8 / day',
    leadTime: '46 min',
    recoveryTime: '22 min',
    changeFailRate: '3.4%',
    reworkRate: '1.8%',
    tier: 'elite',
  },
];

// ============================================================================
// Mock Data — 7 Team Archetypes (2025 DORA Report)
// ============================================================================
const TEAM_ARCHETYPES: TeamArchetype[] = [
  { name: 'Foundational Challenges', description: 'Trapped in survival mode with significant process gaps', color: '#C62828', throughput: 15, stability: 25, wellbeing: 20, isCurrentTeam: false },
  { name: 'Emerging Practitioners', description: 'Building foundational practices, gaining momentum', color: '#E65100', throughput: 30, stability: 40, wellbeing: 35, isCurrentTeam: false },
  { name: 'Steady Operators', description: 'Consistent delivery with room for improvement', color: '#FF8F00', throughput: 50, stability: 60, wellbeing: 55, isCurrentTeam: false },
  { name: 'Fast Movers', description: 'High throughput but stability needs attention', color: '#F9A825', throughput: 80, stability: 45, wellbeing: 50, isCurrentTeam: false },
  { name: 'Balanced Performers', description: 'Good across all dimensions with stable delivery', color: '#0078D4', throughput: 65, stability: 70, wellbeing: 70, isCurrentTeam: false },
  { name: 'Resilient Guardians', description: 'Exceptional stability and reliability focus', color: '#1565C0', throughput: 60, stability: 90, wellbeing: 75, isCurrentTeam: false },
  { name: 'Harmonious High Achievers', description: 'Excel across throughput, stability, and well-being', color: '#2E7D32', throughput: 92, stability: 94, wellbeing: 90, isCurrentTeam: true },
];

// ============================================================================
// Mock Data — DORA AI Capabilities Model (2025)
// ============================================================================
const AI_CAPABILITIES: AiCapability[] = [
  { name: 'Automated Testing', icon: <CheckCircleIcon />, score: 92, description: 'Comprehensive automated test suites with >90% coverage', color: '#2E7D32' },
  { name: 'Version Control', icon: <StorageIcon />, score: 96, description: 'Mature Git workflows with branch protection and signed commits', color: '#1B5E20' },
  { name: 'Fast Feedback Loops', icon: <LoopIcon />, score: 88, description: 'CI pipelines complete in <10 min with immediate notifications', color: '#0078D4' },
  { name: 'Loosely Coupled Architecture', icon: <SettingsIcon />, score: 85, description: 'Microservices with well-defined APIs and independent deployability', color: '#1565C0' },
  { name: 'Platform Engineering', icon: <BuildIcon />, score: 94, description: 'Internal developer platform with self-service capabilities', color: '#2E7D32' },
  { name: 'User-Centric Focus', icon: <PeopleIcon />, score: 82, description: 'Feature flags, A/B testing, and user feedback integration', color: '#0078D4' },
  { name: 'Continuous Learning', icon: <SchoolIcon />, score: 78, description: 'Blameless postmortems, knowledge sharing, and training programs', color: '#FF8F00' },
];

// ============================================================================
// Mock Data — Trend data (12 weeks)
// ============================================================================
const WEEK_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];

// ============================================================================
// Sub-Components
// ============================================================================

/** SVG gauge ring used in metric cards */
const GaugeRing = ({ value, max, color, size = 88 }: { value: number; max: number; color: string; size?: number }) => {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const dashOffset = circumference * (1 - pct);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(128,128,128,0.12)" strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={dashOffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
};

/** Small sparkline bar chart */
const Sparkline = ({ data, color, height = 28 }: { data: number[]; color: string; height?: number }) => {
  const classes = useStyles();
  const max = Math.max(...data);
  return (
    <div className={classes.sparkline} style={{ height }}>
      {data.map((v, i) => (
        <Tooltip key={i} title={`Week ${i + 1}: ${v}`} arrow>
          <div
            className={classes.sparkBar}
            style={{
              height: `${(v / max) * 100}%`,
              background: `${color}${i === data.length - 1 ? '' : '80'}`,
              opacity: i === data.length - 1 ? 1 : 0.5 + (i / data.length) * 0.5,
            }}
          />
        </Tooltip>
      ))}
    </div>
  );
};

/** Trend chart with larger bars */
const TrendChart = ({ data, color, label, currentValue, unit }: {
  data: number[];
  color: string;
  label: string;
  currentValue: string;
  unit: string;
}) => {
  const classes = useStyles();
  const max = Math.max(...data) * 1.15;
  return (
    <Card className={classes.trendContainer} variant="outlined">
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography className={classes.trendTitle}>{label}</Typography>
        </Box>
        <Box textAlign="right">
          <Typography className={classes.trendValue} style={{ color }}>{currentValue}</Typography>
          <Typography variant="caption" color="textSecondary">{unit}</Typography>
        </Box>
      </Box>
      <div className={classes.trendChart}>
        {data.map((v, i) => (
          <Tooltip key={i} title={`${WEEK_LABELS[i]}: ${v}${unit === 'minutes' || unit === 'min' ? ' min' : unit === '%' ? '%' : ''}`} arrow>
            <div
              className={classes.trendBar}
              style={{
                height: `${(v / max) * 100}%`,
                background: i === data.length - 1
                  ? color
                  : `${color}${Math.round(30 + (i / data.length) * 50).toString(16).padStart(2, '0')}`,
                borderRadius: '3px 3px 0 0',
              }}
            />
          </Tooltip>
        ))}
      </div>
      <div className={classes.trendAxisLabels}>
        <span>12 weeks ago</span>
        <span>Now</span>
      </div>
    </Card>
  );
};

// ============================================================================
// Main DORA Metrics Page
// ============================================================================
export const DoraMetricsPage = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);

  const throughputMetrics = DORA_METRICS.filter(m => m.category === 'throughput');
  const stabilityMetrics = DORA_METRICS.filter(m => m.category === 'stability');
  const overallTier: MetricTier = 'elite';

  return (
    <Page themeId="service">
      <Header
        title="DORA Metrics"
        subtitle={
          <HeaderBannerLogos layout="dora" text="Software Delivery Performance — 2025 DORA Model" />
        }
      />
      <Content>
        {/* ============================================================= */}
        {/* PERFORMANCE TIER BANNER */}
        {/* ============================================================= */}
        <Paper className={`${classes.tierBanner} ${classes.tierBannerElite}`} elevation={0}>
          <div className={classes.tierBannerGlow} />
          <div className={classes.tierBannerGlow2} />
          <div className={classes.tierBannerContent}>
            <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 4 }}>
              Kubernetes Platform Performance
            </Typography>
            <Typography variant="body2" style={{ opacity: 0.9, maxWidth: 600 }}>
              Your team is classified as an <strong>Elite Performer</strong> across all five DORA metrics.
              Elite teams deploy multiple times per day, recover from failures in under an hour,
              and maintain change failure rates below 5%. Based on the 2025 DORA Report methodology.
            </Typography>
          </div>
          <Box className={classes.tierBannerBadge}>
            <SpeedIcon style={{ fontSize: 36, marginBottom: 4, opacity: 0.9 }} />
            <Typography className={classes.tierBannerLabel}>ELITE</Typography>
            <Typography className={classes.tierBannerSub}>Performance Tier</Typography>
          </Box>
        </Paper>

        {/* ============================================================= */}
        {/* TABS */}
        {/* ============================================================= */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          indicatorColor="primary"
          textColor="primary"
          style={{ marginBottom: 24 }}
        >
          <Tab label="Overview" />
          <Tab label="Per-CSP Breakdown" />
          <Tab label="Team Archetypes" />
          <Tab label="AI Capabilities" />
        </Tabs>

        {/* ============================================================= */}
        {/* TAB 0: OVERVIEW */}
        {/* ============================================================= */}
        {activeTab === 0 && (
          <>
            {/* ----- Throughput Metrics ----- */}
            <Box className={classes.sectionHeader}>
              <TrendingUpIcon className={classes.sectionIcon} style={{ color: TIER_COLORS.elite }} />
              <Box>
                <Typography className={classes.sectionTitle}>Throughput</Typography>
                <Typography className={classes.sectionSubtitle}>How fast changes move through the system</Typography>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {throughputMetrics.map(metric => (
                <Grid item xs={12} sm={6} md={4} key={metric.id}>
                  <Tooltip title={metric.description} arrow placement="top">
                    <Card className={`${classes.heroCard} ${classes[`heroCard${metric.tier.charAt(0).toUpperCase()}${metric.tier.slice(1)}` as keyof typeof classes]}`}>
                      <Typography className={classes.metricCategory} style={{ color: TIER_COLORS[metric.tier] }}>
                        {metric.category}
                      </Typography>
                      <Typography className={classes.metricLabel}>{metric.label}</Typography>

                      <Box className={classes.gaugeContainer}>
                        <Box position="relative" display="inline-flex">
                          <GaugeRing
                            value={metric.id === 'deployment-frequency' ? metric.numericValue : (100 - metric.numericValue)}
                            max={metric.id === 'deployment-frequency' ? 12 : 100}
                            color={TIER_COLORS[metric.tier]}
                          />
                          <Box position="absolute" top={0} left={0} right={0} bottom={0} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <Typography className={classes.gaugeValue} style={{ color: TIER_COLORS[metric.tier] }}>
                              {metric.value}
                            </Typography>
                            <Typography className={classes.gaugeUnit}>{metric.unit}</Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <span
                          className={classes.tierBadge}
                          style={{
                            background: `${TIER_COLORS[metric.tier]}18`,
                            color: TIER_COLORS[metric.tier],
                          }}
                        >
                          {TIER_LABELS[metric.tier]}
                        </span>
                        <span
                          className={classes.metricTrend}
                          style={{ color: metric.trend < 0 ? '#2E7D32' : metric.category === 'throughput' ? '#2E7D32' : '#C62828' }}
                        >
                          {(metric.category === 'stability' || metric.id.includes('time'))
                            ? (metric.trend < 0 ? <TrendingDownIcon style={{ fontSize: 14 }} /> : <TrendingUpIcon style={{ fontSize: 14 }} />)
                            : (metric.trend > 0 ? <TrendingUpIcon style={{ fontSize: 14 }} /> : <TrendingDownIcon style={{ fontSize: 14 }} />)
                          }
                          {Math.abs(metric.trend)}% {metric.trendLabel}
                        </span>
                      </Box>

                      <Sparkline data={metric.sparkline} color={TIER_COLORS[metric.tier]} />
                    </Card>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>

            {/* ----- Stability Metrics ----- */}
            <Box className={classes.sectionHeader}>
              <SecurityIcon className={classes.sectionIcon} style={{ color: TIER_COLORS.elite }} />
              <Box>
                <Typography className={classes.sectionTitle}>Stability</Typography>
                <Typography className={classes.sectionSubtitle}>How safe and reliable changes are</Typography>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {stabilityMetrics.map(metric => (
                <Grid item xs={12} sm={6} key={metric.id}>
                  <Tooltip title={metric.description} arrow placement="top">
                    <Card className={`${classes.heroCard} ${classes[`heroCard${metric.tier.charAt(0).toUpperCase()}${metric.tier.slice(1)}` as keyof typeof classes]}`}>
                      <Typography className={classes.metricCategory} style={{ color: TIER_COLORS[metric.tier] }}>
                        {metric.category}
                      </Typography>
                      <Typography className={classes.metricLabel}>{metric.label}</Typography>

                      <Box className={classes.gaugeContainer}>
                        <Box position="relative" display="inline-flex">
                          <GaugeRing
                            value={100 - metric.numericValue}
                            max={100}
                            color={TIER_COLORS[metric.tier]}
                          />
                          <Box position="absolute" top={0} left={0} right={0} bottom={0} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <Typography className={classes.gaugeValue} style={{ color: TIER_COLORS[metric.tier] }}>
                              {metric.value}
                            </Typography>
                            <Typography className={classes.gaugeUnit}>{metric.unit}</Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <span
                          className={classes.tierBadge}
                          style={{
                            background: `${TIER_COLORS[metric.tier]}18`,
                            color: TIER_COLORS[metric.tier],
                          }}
                        >
                          {TIER_LABELS[metric.tier]}
                        </span>
                        <span className={classes.metricTrend} style={{ color: '#2E7D32' }}>
                          <TrendingDownIcon style={{ fontSize: 14 }} />
                          {Math.abs(metric.trend)}% {metric.trendLabel}
                        </span>
                      </Box>

                      <Sparkline data={metric.sparkline} color={TIER_COLORS[metric.tier]} />
                    </Card>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>

            {/* ----- Trend Charts ----- */}
            <Box className={classes.sectionHeader}>
              <TimelineIcon className={classes.sectionIcon} style={{ color: '#0078D4' }} />
              <Box>
                <Typography className={classes.sectionTitle}>12-Week Trends</Typography>
                <Typography className={classes.sectionSubtitle}>Weekly metric progression across the KaaS platform</Typography>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {DORA_METRICS.map(metric => (
                <Grid item xs={12} sm={6} md={4} key={`trend-${metric.id}`}>
                  <TrendChart
                    data={metric.sparkline}
                    color={TIER_COLORS[metric.tier]}
                    label={metric.shortLabel}
                    currentValue={metric.value}
                    unit={metric.unit}
                  />
                </Grid>
              ))}
            </Grid>

            {/* ----- Industry Benchmarks ----- */}
            <Box className={classes.sectionHeader}>
              <GroupWorkIcon className={classes.sectionIcon} style={{ color: '#0078D4' }} />
              <Box>
                <Typography className={classes.sectionTitle}>Industry Benchmarks</Typography>
                <Typography className={classes.sectionSubtitle}>How the KaaS team compares to DORA's 2025 performance tiers</Typography>
              </Box>
            </Box>
            <Card className={classes.benchmarkTable} variant="outlined">
              <div className={classes.benchmarkHeader}>
                <span>Metric</span>
                <span>Elite</span>
                <span>High</span>
                <span>Medium</span>
                <span>Low</span>
              </div>
              {DORA_METRICS.map(metric => (
                <div
                  key={`bench-${metric.id}`}
                  className={`${classes.benchmarkRow} ${metric.tier === overallTier ? classes.benchmarkRowHighlight : ''}`}
                >
                  <span style={{ fontWeight: 600 }}>{metric.shortLabel}</span>
                  {(['elite', 'high', 'medium', 'low'] as MetricTier[]).map(tier => (
                    <span
                      key={tier}
                      className={classes.benchmarkTierCell}
                      style={{
                        color: metric.tier === tier ? TIER_COLORS[tier] : undefined,
                        fontWeight: metric.tier === tier ? 800 : 400,
                      }}
                    >
                      {metric.tier === tier && (
                        <span className={classes.benchmarkDot} style={{ background: TIER_COLORS[tier] }} />
                      )}
                      {metric.benchmarks[tier]}
                    </span>
                  ))}
                </div>
              ))}
            </Card>
          </>
        )}

        {/* ============================================================= */}
        {/* TAB 1: PER-CSP BREAKDOWN */}
        {/* ============================================================= */}
        {activeTab === 1 && (
          <>
            <Box className={classes.sectionHeader}>
              <CloudDoneIcon className={classes.sectionIcon} style={{ color: '#0078D4' }} />
              <Box>
                <Typography className={classes.sectionTitle}>Cloud Provider Comparison</Typography>
                <Typography className={classes.sectionSubtitle}>DORA metrics broken down by CSP across all workload clusters</Typography>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {CSP_DORA.map(csp => (
                <Grid item xs={12} md={4} key={csp.csp}>
                  <Card className={classes.cspCard} variant="outlined">
                    <Box className={classes.cspHeader} style={{ borderBottom: `3px solid ${csp.color}` }}>
                      <img src={csp.logo} alt={csp.cspLabel} className={classes.cspLogo} />
                      <Box flex={1}>
                        <Typography variant="subtitle1" style={{ fontWeight: 700 }}>{csp.cspLabel}</Typography>
                      </Box>
                      <Chip
                        label={TIER_LABELS[csp.tier]}
                        size="small"
                        className={classes.cspTierChip}
                        style={{
                          background: `${TIER_COLORS[csp.tier]}18`,
                          color: TIER_COLORS[csp.tier],
                        }}
                      />
                    </Box>
                    <Box>
                      {[
                        { label: 'Deployment Frequency', value: csp.deploymentFrequency },
                        { label: 'Change Lead Time', value: csp.leadTime },
                        { label: 'Recovery Time', value: csp.recoveryTime },
                        { label: 'Change Failure Rate', value: csp.changeFailRate },
                        { label: 'Rework Rate', value: csp.reworkRate },
                      ].map(row => (
                        <div key={row.label} className={classes.cspMetricRow}>
                          <span className={classes.cspMetricLabel}>{row.label}</span>
                          <span className={classes.cspMetricValue} style={{ color: csp.color }}>{row.value}</span>
                        </div>
                      ))}
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* ----- Per-Metric CSP Comparison Charts ----- */}
            <Box className={classes.sectionHeader} style={{ marginTop: 40 }}>
              <TimelineIcon className={classes.sectionIcon} style={{ color: '#0078D4' }} />
              <Box>
                <Typography className={classes.sectionTitle}>Metric Comparison</Typography>
                <Typography className={classes.sectionSubtitle}>Side-by-side CSP performance for each DORA metric</Typography>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {[
                { label: 'Deploy Frequency', unit: '/ day', values: [9.2, 8.1, 7.8], max: 12 },
                { label: 'Lead Time', unit: 'min', values: [38, 44, 46], max: 60, invert: true },
                { label: 'Recovery Time', unit: 'min', values: [14, 19, 22], max: 30, invert: true },
                { label: 'Change Fail Rate', unit: '%', values: [2.1, 3.2, 3.4], max: 5, invert: true },
                { label: 'Rework Rate', unit: '%', values: [0.9, 1.6, 1.8], max: 3, invert: true },
              ].map(metric => (
                <Grid item xs={12} sm={6} md={4} key={metric.label}>
                  <Card variant="outlined" style={{ borderRadius: 14, padding: 16 }}>
                    <Typography style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 12 }}>
                      {metric.label}
                    </Typography>
                    {CSP_DORA.map((csp, i) => (
                      <Box key={csp.csp} display="flex" alignItems="center" mb={1}>
                        <img src={csp.logo} alt="" style={{ width: 20, height: 20, marginRight: 8, objectFit: 'contain' }} />
                        <Box flex={1} mr={1}>
                          <Box
                            style={{
                              height: 14,
                              borderRadius: 7,
                              background: 'rgba(128,128,128,0.1)',
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              style={{
                                height: '100%',
                                width: `${metric.invert ? ((metric.max - metric.values[i]) / metric.max) * 100 : (metric.values[i] / metric.max) * 100}%`,
                                background: `linear-gradient(90deg, ${csp.color}90, ${csp.color})`,
                                borderRadius: 7,
                                transition: 'width 0.6s ease',
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography style={{ fontSize: '0.75rem', fontWeight: 700, minWidth: 52, textAlign: 'right' }}>
                          {metric.values[i]} {metric.unit}
                        </Typography>
                      </Box>
                    ))}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* ============================================================= */}
        {/* TAB 2: TEAM ARCHETYPES */}
        {/* ============================================================= */}
        {activeTab === 2 && (
          <>
            <Box className={classes.sectionHeader}>
              <GroupWorkIcon className={classes.sectionIcon} style={{ color: '#2E7D32' }} />
              <Box>
                <Typography className={classes.sectionTitle}>Seven Team Archetypes</Typography>
                <Typography className={classes.sectionSubtitle}>
                  From the 2025 DORA Report — cluster analysis of team profiles by performance, stability, and well-being
                </Typography>
              </Box>
            </Box>

            <Box mb={3}>
              <Paper variant="outlined" style={{ borderRadius: 14, padding: 20 }}>
                <Typography variant="body2" color="textSecondary" style={{ lineHeight: 1.7 }}>
                  The 2025 DORA Report identified <strong>seven common team profiles</strong> through cluster analysis
                  of performance, stability, and well-being data from nearly 5,000 technology professionals worldwide.
                  Simple delivery metrics alone tell you <em>what</em> is happening but not <em>why</em>.
                  These archetypes connect performance data to team experience, giving leaders a diagnostic
                  framework for applying the right interventions.
                </Typography>
              </Paper>
            </Box>

            <div className={classes.archetypeGrid}>
              {TEAM_ARCHETYPES.map(arch => (
                <Card
                  key={arch.name}
                  className={`${classes.archetypeCard} ${arch.isCurrentTeam ? classes.archetypeActive : ''}`}
                  variant="outlined"
                  style={{ borderColor: `${arch.color}30` }}
                >
                  {arch.isCurrentTeam && (
                    <span className={classes.archetypeYouBadge}>You</span>
                  )}
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: `${arch.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                    }}
                  >
                    <Box
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: arch.color,
                      }}
                    />
                  </Box>
                  <Typography className={classes.archetypeName} style={{ color: arch.color }}>
                    {arch.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ display: 'block', fontSize: '0.65rem', marginBottom: 8, lineHeight: 1.3 }}
                  >
                    {arch.description}
                  </Typography>
                  <Divider style={{ margin: '8px 0' }} />
                  <div className={classes.archetypeBarGroup}>
                    {[
                      { label: 'Throughput', value: arch.throughput, color: '#0078D4' },
                      { label: 'Stability', value: arch.stability, color: '#2E7D32' },
                      { label: 'Well-being', value: arch.wellbeing, color: '#FF8F00' },
                    ].map(bar => (
                      <Box key={bar.label}>
                        <div className={classes.archetypeBarLabel}>
                          <span>{bar.label}</span>
                          <span>{bar.value}%</span>
                        </div>
                        <div className={classes.archetypeBar}>
                          <div
                            className={classes.archetypeBarFill}
                            style={{ width: `${bar.value}%`, background: bar.color }}
                          />
                        </div>
                      </Box>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ============================================================= */}
        {/* TAB 3: AI CAPABILITIES */}
        {/* ============================================================= */}
        {activeTab === 3 && (
          <>
            <Box className={classes.sectionHeader}>
              <EmojiObjectsIcon className={classes.sectionIcon} style={{ color: '#FF8F00' }} />
              <Box>
                <Typography className={classes.sectionTitle}>DORA AI Capabilities Model</Typography>
                <Typography className={classes.sectionSubtitle}>
                  Seven capabilities that magnify AI's positive impact on software delivery — 2025 DORA Report
                </Typography>
              </Box>
            </Box>

            <Box mb={3}>
              <Paper variant="outlined" style={{ borderRadius: 14, padding: 20 }}>
                <Typography variant="body2" color="textSecondary" style={{ lineHeight: 1.7 }}>
                  The 2025 DORA Report reveals that <strong>AI doesn't fix a team — it amplifies what's already there</strong>.
                  Strong teams use AI to become even better and more efficient; struggling teams find AI only highlights
                  existing problems. The greatest return comes not from the AI tools themselves, but from a strategic
                  focus on these seven foundational capabilities. 90% of organizations now use AI,
                  but only those with robust foundations unlock its full potential.
                </Typography>
              </Paper>
            </Box>

            <div className={classes.aiCapGrid}>
              {AI_CAPABILITIES.map(cap => (
                <Card key={cap.name} className={classes.aiCapCard} variant="outlined">
                  <Box className={classes.aiCapScoreRing}>
                    <GaugeRing value={cap.score} max={100} color={cap.color} size={56} />
                    <Typography className={classes.aiCapScoreText} style={{ color: cap.color }}>
                      {cap.score}
                    </Typography>
                  </Box>
                  <Box className={classes.aiCapIcon} style={{ color: cap.color }}>
                    {cap.icon}
                  </Box>
                  <Typography className={classes.aiCapName}>
                    {cap.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.65rem', lineHeight: 1.3 }}>
                    {cap.description}
                  </Typography>
                </Card>
              ))}
            </div>

            {/* AI Adoption Stats */}
            <Box className={classes.sectionHeader} style={{ marginTop: 40 }}>
              <SpeedIcon className={classes.sectionIcon} style={{ color: '#0078D4' }} />
              <Box>
                <Typography className={classes.sectionTitle}>AI Adoption Insights</Typography>
                <Typography className={classes.sectionSubtitle}>Key findings from the 2025 DORA research on AI in software development</Typography>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {[
                { stat: '90%', label: 'AI Adoption', desc: 'of survey respondents report using AI at work', color: '#2E7D32' },
                { stat: '80%+', label: 'Productivity Gain', desc: 'believe AI has increased their productivity', color: '#0078D4' },
                { stat: '70%', label: 'Trust in AI Code', desc: 'report meaningful trust in AI-generated code', color: '#FF8F00' },
                { stat: '90%', label: 'Platform Adoption', desc: 'of organizations have adopted at least one platform', color: '#1565C0' },
              ].map(item => (
                <Grid item xs={6} sm={3} key={item.label}>
                  <Card variant="outlined" style={{ borderRadius: 14, padding: 20, textAlign: 'center' }}>
                    <Typography style={{ fontSize: '2.2rem', fontWeight: 900, color: item.color, lineHeight: 1 }}>
                      {item.stat}
                    </Typography>
                    <Typography style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: 4 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" style={{ fontSize: '0.65rem' }}>
                      {item.desc}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* DORA Key Insight */}
            <Box mt={4}>
              <Paper
                elevation={0}
                style={{
                  borderRadius: 14,
                  padding: 24,
                  background: 'linear-gradient(135deg, rgba(0,47,108,0.06) 0%, rgba(0,120,212,0.04) 100%)',
                  border: '1px solid rgba(0,120,212,0.15)',
                }}
              >
                <Box display="flex" alignItems="flex-start" style={{ gap: 16 }}>
                  <ErrorOutlineIcon style={{ color: '#0078D4', fontSize: 28, marginTop: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" style={{ fontWeight: 700, marginBottom: 4 }}>
                      Key Insight from the 2025 DORA Report
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ lineHeight: 1.7 }}>
                      "AI accelerates software development, but that acceleration can expose weaknesses downstream.
                      Without robust control systems — strong automated testing, mature version control practices,
                      and fast feedback loops — an increase in change volume leads to instability.
                      Teams working in loosely coupled architectures with fast feedback loops see gains,
                      while those constrained by tightly coupled systems and slow processes see little or no benefit."
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="caption" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                        — 2025 DORA Report: State of AI-Assisted Software Development
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </>
        )}
      </Content>
    </Page>
  );
};
