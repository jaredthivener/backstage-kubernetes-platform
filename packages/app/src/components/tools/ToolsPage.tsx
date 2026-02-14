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
  Button,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SearchIcon from '@material-ui/icons/Search';
import StorageIcon from '@material-ui/icons/Storage';
import TimelineIcon from '@material-ui/icons/Timeline';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PeopleIcon from '@material-ui/icons/People';
import ScheduleIcon from '@material-ui/icons/Schedule';
import CodeIcon from '@material-ui/icons/Code';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import SettingsIcon from '@material-ui/icons/Settings';
import FolderIcon from '@material-ui/icons/Folder';
import BugReportIcon from '@material-ui/icons/BugReport';
import BuildIcon from '@material-ui/icons/Build';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import HistoryIcon from '@material-ui/icons/History';
import SecurityIcon from '@material-ui/icons/Security';
import AssessmentIcon from '@material-ui/icons/Assessment';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useStyles = makeStyles(theme => ({
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
    flexWrap: 'wrap' as const,
  },
  envChip: {
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  toolCard: {
    borderRadius: 14,
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'box-shadow 0.2s, transform 0.15s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[8],
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  toolLogo: {
    height: 36,
    width: 36,
    borderRadius: 8,
  },
  toolName: {
    fontWeight: 700,
    fontSize: '1.15rem',
  },
  toolDescription: {
    fontSize: '0.82rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    lineHeight: 1.5,
  },
  linkRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 0),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderRadius: 6,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      marginLeft: theme.spacing(-1),
      marginRight: theme.spacing(-1),
    },
  },
  linkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: '0.84rem',
    fontWeight: 500,
  },
  linkIcon: {
    fontSize: 18,
    color: theme.palette.text.secondary,
  },
  envBadge: {
    fontSize: '0.6rem',
    height: 18,
    fontWeight: 600,
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  accentStripe: {
    height: 4,
    borderRadius: '14px 14px 0 0',
    width: '100%',
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  linksContainer: {
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: 6,
  },
}));

// ---------------------------------------------------------------------------
// Environment config
// ---------------------------------------------------------------------------
type Env = 'production' | 'staging' | 'development';

const envConfig: Record<Env, { label: string; color: string; short: string }> = {
  production:  { label: 'Production',  color: '#F44336', short: 'PROD' },
  staging:     { label: 'Staging',     color: '#FF9800', short: 'STG' },
  development: { label: 'Development', color: '#4CAF50', short: 'DEV' },
};

// ---------------------------------------------------------------------------
// Tool link definitions — URLs vary by environment
// ---------------------------------------------------------------------------
interface ToolLink {
  label: string;
  icon: JSX.Element;
  urls: Record<Env, string>;
  description?: string;
}

interface ToolCardDef {
  name: string;
  logo: string;
  accent: string;
  description: string;
  sections: {
    title: string;
    links: ToolLink[];
  }[];
}

const toolCards: ToolCardDef[] = [
  {
    name: 'Grafana',
    logo: '/logos/grafana.svg',
    accent: '#F46800',
    description: 'Unified observability dashboards for metrics, logs, and traces across all Kubernetes clusters.',
    sections: [
      {
        title: 'Dashboards',
        links: [
          {
            label: 'Cluster Overview',
            icon: <DashboardIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://grafana.prod.ms.com/d/cluster-overview',
              staging: 'https://grafana.stg.ms.com/d/cluster-overview',
              development: 'https://grafana.dev.ms.com/d/cluster-overview',
            },
          },
          {
            label: 'Node Exporter',
            icon: <AssessmentIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://grafana.prod.ms.com/d/node-exporter',
              staging: 'https://grafana.stg.ms.com/d/node-exporter',
              development: 'https://grafana.dev.ms.com/d/node-exporter',
            },
          },
          {
            label: 'Pod Resources',
            icon: <StorageIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://grafana.prod.ms.com/d/pod-resources',
              staging: 'https://grafana.stg.ms.com/d/pod-resources',
              development: 'https://grafana.dev.ms.com/d/pod-resources',
            },
          },
        ],
      },
      {
        title: 'Data Sources',
        links: [
          {
            label: 'Prometheus Query',
            icon: <SearchIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://grafana.prod.ms.com/explore?orgId=1&left=["now-1h","now","Prometheus"]',
              staging: 'https://grafana.stg.ms.com/explore?orgId=1&left=["now-1h","now","Prometheus"]',
              development: 'https://grafana.dev.ms.com/explore?orgId=1&left=["now-1h","now","Prometheus"]',
            },
          },
          {
            label: 'Loki Logs',
            icon: <ListAltIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://grafana.prod.ms.com/explore?orgId=1&left=["now-1h","now","Loki"]',
              staging: 'https://grafana.stg.ms.com/explore?orgId=1&left=["now-1h","now","Loki"]',
              development: 'https://grafana.dev.ms.com/explore?orgId=1&left=["now-1h","now","Loki"]',
            },
          },
          {
            label: 'Jaeger Traces',
            icon: <TimelineIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://grafana.prod.ms.com/explore?orgId=1&left=["now-1h","now","Jaeger"]',
              staging: 'https://grafana.stg.ms.com/explore?orgId=1&left=["now-1h","now","Jaeger"]',
              development: 'https://grafana.dev.ms.com/explore?orgId=1&left=["now-1h","now","Jaeger"]',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'PagerDuty',
    logo: '/logos/pagerduty.svg',
    accent: '#06AC38',
    description: 'Incident management, on-call scheduling, and alerting for the Kubernetes platform team.',
    sections: [
      {
        title: 'Incidents',
        links: [
          {
            label: 'Active Incidents',
            icon: <NotificationsActiveIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://morganstanley.pagerduty.com/incidents?status=triggered,acknowledged&service=kaas-prod',
              staging: 'https://morganstanley.pagerduty.com/incidents?status=triggered,acknowledged&service=kaas-staging',
              development: 'https://morganstanley.pagerduty.com/incidents?status=triggered,acknowledged&service=kaas-dev',
            },
          },
          {
            label: 'Incident History',
            icon: <HistoryIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://morganstanley.pagerduty.com/incidents?status=resolved&service=kaas-prod',
              staging: 'https://morganstanley.pagerduty.com/incidents?status=resolved&service=kaas-staging',
              development: 'https://morganstanley.pagerduty.com/incidents?status=resolved&service=kaas-dev',
            },
          },
          {
            label: 'Suppressed Alerts',
            icon: <SecurityIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://morganstanley.pagerduty.com/alerts?service=kaas-prod&status=suppressed',
              staging: 'https://morganstanley.pagerduty.com/alerts?service=kaas-staging&status=suppressed',
              development: 'https://morganstanley.pagerduty.com/alerts?service=kaas-dev&status=suppressed',
            },
          },
        ],
      },
      {
        title: 'Schedules & Services',
        links: [
          {
            label: 'On-Call Schedules',
            icon: <ScheduleIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://morganstanley.pagerduty.com/schedules#kaas-prod',
              staging: 'https://morganstanley.pagerduty.com/schedules#kaas-staging',
              development: 'https://morganstanley.pagerduty.com/schedules#kaas-dev',
            },
          },
          {
            label: 'Escalation Policies',
            icon: <PeopleIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://morganstanley.pagerduty.com/escalation_policies#kaas-prod',
              staging: 'https://morganstanley.pagerduty.com/escalation_policies#kaas-staging',
              development: 'https://morganstanley.pagerduty.com/escalation_policies#kaas-dev',
            },
          },
          {
            label: 'Service Directory',
            icon: <BookmarkIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://morganstanley.pagerduty.com/service-directory?query=kaas-prod',
              staging: 'https://morganstanley.pagerduty.com/service-directory?query=kaas-staging',
              development: 'https://morganstanley.pagerduty.com/service-directory?query=kaas-dev',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'GitHub',
    logo: '/logos/github.svg',
    accent: '#24292F',
    description: 'Source code repositories, pull requests, issues, and CI workflows for all KaaS platform components.',
    sections: [
      {
        title: 'Repositories',
        links: [
          {
            label: 'Platform Repo',
            icon: <CodeIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://github.morganstanley.com/kaas/platform',
              staging: 'https://github.morganstanley.com/kaas/platform/tree/staging',
              development: 'https://github.morganstanley.com/kaas/platform/tree/develop',
            },
          },
          {
            label: 'Cluster Definitions',
            icon: <FolderIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://github.morganstanley.com/kaas/cluster-definitions/tree/main',
              staging: 'https://github.morganstanley.com/kaas/cluster-definitions/tree/staging',
              development: 'https://github.morganstanley.com/kaas/cluster-definitions/tree/develop',
            },
          },
          {
            label: 'Addon Catalog',
            icon: <FolderIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://github.morganstanley.com/kaas/addon-catalog',
              staging: 'https://github.morganstanley.com/kaas/addon-catalog/tree/staging',
              development: 'https://github.morganstanley.com/kaas/addon-catalog/tree/develop',
            },
          },
        ],
      },
      {
        title: 'Workflows',
        links: [
          {
            label: 'Pull Requests',
            icon: <MergeTypeIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://github.morganstanley.com/kaas/platform/pulls?q=is:open+base:main',
              staging: 'https://github.morganstanley.com/kaas/platform/pulls?q=is:open+base:staging',
              development: 'https://github.morganstanley.com/kaas/platform/pulls?q=is:open+base:develop',
            },
          },
          {
            label: 'Open Issues',
            icon: <BugReportIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://github.morganstanley.com/kaas/platform/issues?q=is:open+label:production',
              staging: 'https://github.morganstanley.com/kaas/platform/issues?q=is:open+label:staging',
              development: 'https://github.morganstanley.com/kaas/platform/issues?q=is:open+label:development',
            },
          },
          {
            label: 'Actions / CI Runs',
            icon: <PlayArrowIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://github.morganstanley.com/kaas/platform/actions?query=branch:main',
              staging: 'https://github.morganstanley.com/kaas/platform/actions?query=branch:staging',
              development: 'https://github.morganstanley.com/kaas/platform/actions?query=branch:develop',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'Jenkins',
    logo: '/logos/jenkins.svg',
    accent: '#D33833',
    description: 'CI/CD pipelines, build history, and deployment automation for Kubernetes workloads and infrastructure.',
    sections: [
      {
        title: 'Pipelines',
        links: [
          {
            label: 'Platform Pipeline',
            icon: <BuildIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://jenkins.prod.ms.com/job/kaas-platform/job/main',
              staging: 'https://jenkins.stg.ms.com/job/kaas-platform/job/staging',
              development: 'https://jenkins.dev.ms.com/job/kaas-platform/job/develop',
            },
          },
          {
            label: 'Cluster Provisioning',
            icon: <BuildIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://jenkins.prod.ms.com/job/kaas-cluster-provision',
              staging: 'https://jenkins.stg.ms.com/job/kaas-cluster-provision',
              development: 'https://jenkins.dev.ms.com/job/kaas-cluster-provision',
            },
          },
          {
            label: 'Addon Deployment',
            icon: <BuildIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://jenkins.prod.ms.com/job/kaas-addon-deploy',
              staging: 'https://jenkins.stg.ms.com/job/kaas-addon-deploy',
              development: 'https://jenkins.dev.ms.com/job/kaas-addon-deploy',
            },
          },
        ],
      },
      {
        title: 'Operations',
        links: [
          {
            label: 'Build History',
            icon: <HistoryIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://jenkins.prod.ms.com/job/kaas-platform/job/main/builds',
              staging: 'https://jenkins.stg.ms.com/job/kaas-platform/job/staging/builds',
              development: 'https://jenkins.dev.ms.com/job/kaas-platform/job/develop/builds',
            },
          },
          {
            label: 'Pipeline Configuration',
            icon: <SettingsIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://jenkins.prod.ms.com/job/kaas-platform/configure',
              staging: 'https://jenkins.stg.ms.com/job/kaas-platform/configure',
              development: 'https://jenkins.dev.ms.com/job/kaas-platform/configure',
            },
          },
          {
            label: 'Blue Ocean View',
            icon: <DashboardIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://jenkins.prod.ms.com/blue/organizations/kaas-platform/pipelines',
              staging: 'https://jenkins.stg.ms.com/blue/organizations/kaas-platform/pipelines',
              development: 'https://jenkins.dev.ms.com/blue/organizations/kaas-platform/pipelines',
            },
          },
        ],
      },
    ],
  },
  {
    name: 'Terraform Enterprise',
    logo: '/logos/terraform.svg',
    accent: '#7B42BC',
    description: 'Infrastructure as Code — provision, manage, and version cloud infrastructure for Kubernetes clusters and supporting services.',
    sections: [
      {
        title: 'Workspaces',
        links: [
          {
            label: 'All Workspaces',
            icon: <DashboardIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://tfe.prod.ms.com/app/kaas/workspaces',
              staging: 'https://tfe.stg.ms.com/app/kaas/workspaces',
              development: 'https://tfe.dev.ms.com/app/kaas/workspaces',
            },
          },
          {
            label: 'Cluster Infrastructure',
            icon: <StorageIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://tfe.prod.ms.com/app/kaas/workspaces?search=cluster',
              staging: 'https://tfe.stg.ms.com/app/kaas/workspaces?search=cluster',
              development: 'https://tfe.dev.ms.com/app/kaas/workspaces?search=cluster',
            },
          },
          {
            label: 'Networking',
            icon: <SettingsIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://tfe.prod.ms.com/app/kaas/workspaces?search=network',
              staging: 'https://tfe.stg.ms.com/app/kaas/workspaces?search=network',
              development: 'https://tfe.dev.ms.com/app/kaas/workspaces?search=network',
            },
          },
        ],
      },
      {
        title: 'Runs & State',
        links: [
          {
            label: 'Recent Runs',
            icon: <PlayArrowIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://tfe.prod.ms.com/app/kaas/workspaces?status=applied',
              staging: 'https://tfe.stg.ms.com/app/kaas/workspaces?status=applied',
              development: 'https://tfe.dev.ms.com/app/kaas/workspaces?status=applied',
            },
          },
          {
            label: 'Failed Plans',
            icon: <BugReportIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://tfe.prod.ms.com/app/kaas/workspaces?status=errored',
              staging: 'https://tfe.stg.ms.com/app/kaas/workspaces?status=errored',
              development: 'https://tfe.dev.ms.com/app/kaas/workspaces?status=errored',
            },
          },
          {
            label: 'Module Registry',
            icon: <FolderIcon style={{ fontSize: 18 }} />,
            urls: {
              production: 'https://tfe.prod.ms.com/app/kaas/registry/modules',
              staging: 'https://tfe.stg.ms.com/app/kaas/registry/modules',
              development: 'https://tfe.dev.ms.com/app/kaas/registry/modules',
            },
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Tool Card Component
// ---------------------------------------------------------------------------
const ToolCardComponent = ({
  tool,
  env,
}: {
  tool: ToolCardDef;
  env: Env;
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.toolCard} variant="outlined">
      <Box className={classes.accentStripe} style={{ backgroundColor: tool.accent }} />
      <CardContent className={classes.cardContent}>
        <Box className={classes.cardHeader}>
          <img src={tool.logo} alt={tool.name} className={classes.toolLogo} />
          <Box flex={1}>
            <Typography className={classes.toolName}>{tool.name}</Typography>
          </Box>
          <Chip
            size="small"
            label={envConfig[env].short}
            className={classes.envBadge}
            style={{ backgroundColor: envConfig[env].color, color: '#fff' }}
          />
        </Box>
        <Typography className={classes.toolDescription}>
          {tool.description}
        </Typography>
        <Box className={classes.linksContainer}>
          {tool.sections.map((section, si) => (
            <Box key={section.title}>
              {si > 0 && <Divider style={{ margin: '8px 0' }} />}
              <Typography className={classes.sectionTitle}>
                {section.title}
              </Typography>
              {section.links.map(link => (
                <Box key={link.label} className={classes.linkRow}>
                  <Box className={classes.linkLabel}>
                    {link.icon}
                    <Typography variant="body2" style={{ fontWeight: 500, fontSize: '0.84rem' }}>
                      {link.label}
                    </Typography>
                  </Box>
                  <Tooltip title={`Open in ${envConfig[env].label}`}>
                    <IconButton
                      size="small"
                      href={link.urls[env]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewIcon style={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// Quick Access Buttons
// ---------------------------------------------------------------------------
const quickLinks = [
  { label: 'Grafana Home', icon: <DashboardIcon />, envUrls: { production: 'https://grafana.prod.ms.com', staging: 'https://grafana.stg.ms.com', development: 'https://grafana.dev.ms.com' } },
  { label: 'PagerDuty', icon: <NotificationsActiveIcon />, envUrls: { production: 'https://morganstanley.pagerduty.com', staging: 'https://morganstanley.pagerduty.com', development: 'https://morganstanley.pagerduty.com' } },
  { label: 'Jenkins', icon: <BuildIcon />, envUrls: { production: 'https://jenkins.prod.ms.com', staging: 'https://jenkins.stg.ms.com', development: 'https://jenkins.dev.ms.com' } },
  { label: 'GitHub', icon: <CodeIcon />, envUrls: { production: 'https://github.morganstanley.com/kaas', staging: 'https://github.morganstanley.com/kaas', development: 'https://github.morganstanley.com/kaas' } },
  { label: 'Terraform', icon: <StorageIcon />, envUrls: { production: 'https://tfe.prod.ms.com', staging: 'https://tfe.stg.ms.com', development: 'https://tfe.dev.ms.com' } },
];

// ---------------------------------------------------------------------------
// Main Tools Page
// ---------------------------------------------------------------------------
export const ToolsPage = () => {
  const classes = useStyles();
  const [env, setEnv] = useState<Env>('production');
  const [tabValue, setTabValue] = useState(0);

  const categories = ['All Tools', 'Observability', 'CI/CD', 'Infrastructure'];
  const filteredTools =
    tabValue === 0
      ? toolCards
      : tabValue === 1
        ? toolCards.filter(t => ['Grafana', 'PagerDuty'].includes(t.name))
        : tabValue === 2
          ? toolCards.filter(t => ['GitHub', 'Jenkins'].includes(t.name))
          : toolCards.filter(t => ['Terraform Enterprise'].includes(t.name));

  return (
    <Page themeId="tool">
      <Header
        title="Tools"
        subtitle={
          <HeaderBannerLogos layout="cost" text="Centralized access to platform tooling across all environments" />
        }
      />
      <Content>
        {/* Quick Access Bar */}
        <Box display="flex" flexWrap="wrap" gridGap={10} mb={3}>
          {quickLinks.map(ql => (
            <Button
              key={ql.label}
              variant="outlined"
              size="small"
              startIcon={ql.icon}
              href={ql.envUrls[env]}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderRadius: 20, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
            >
              {ql.label}
            </Button>
          ))}
        </Box>

        {/* Environment Filter + Category Tabs */}
        <Box className={classes.filterBar}>
          <Typography variant="body2" style={{ fontWeight: 600, marginRight: 4 }}>
            Environment:
          </Typography>
          {(Object.keys(envConfig) as Env[]).map(e => (
            <Chip
              key={e}
              label={envConfig[e].label}
              className={classes.envChip}
              onClick={() => setEnv(e)}
              style={{
                backgroundColor: env === e ? envConfig[e].color : 'transparent',
                color: env === e ? '#fff' : envConfig[e].color,
                border: `2px solid ${envConfig[e].color}`,
              }}
            />
          ))}
          <Box flex={1} />
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            indicatorColor="primary"
            textColor="primary"
          >
            {categories.map(c => (
              <Tab key={c} label={c} style={{ textTransform: 'none', fontWeight: 600, minWidth: 'auto' }} />
            ))}
          </Tabs>
        </Box>

        {/* Tool Cards Grid */}
        <Grid container spacing={3}>
          {filteredTools.map(tool => (
            <Grid item xs={12} sm={6} md={4} key={tool.name}>
              <ToolCardComponent tool={tool} env={env} />
            </Grid>
          ))}
        </Grid>
      </Content>
    </Page>
  );
};
