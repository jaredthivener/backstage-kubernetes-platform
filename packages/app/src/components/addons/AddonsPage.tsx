import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Header, Page, Content } from '@backstage/core-components';
import { Link } from 'react-router-dom';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';

const useStyles = makeStyles(theme => ({
  '@keyframes glow': {
    '0%, 100%': {
      boxShadow: '0 0 8px rgba(255, 107, 53, 0.6), 0 0 12px rgba(255, 107, 53, 0.4)',
    },
    '50%': {
      boxShadow: '0 0 12px rgba(255, 107, 53, 0.8), 0 0 20px rgba(255, 107, 53, 0.6)',
    },
  },
  subtitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  },
  card: {
    height: '100%',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${theme.palette.divider}`,
  },
  cardContent: {
    flex: 1,
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1.5),
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  logoWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    flexShrink: 0,
  },
  logo: {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
  },
  addonName: {
    fontWeight: 700,
    fontSize: '1rem',
  },
  addonDesc: {
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
    lineHeight: 1.5,
  },
  linksRow: {
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(0, 2, 2),
  },
  versionContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
  },
  newBadge: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 900,
    padding: '2px 6px',
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    animation: '$glow 2s ease-in-out infinite',
  },
}));

type Addon = {
  name: string;
  version: string;
  description: string;
  logoSrc: string;
  logoStyle?: React.CSSProperties;
  logoWrapStyle?: React.CSSProperties;
  docsUrl: string;
  quickStartUrl?: string;
  isNew?: boolean;
};

const addons: Addon[] = [
  {
    name: 'Istio Service Mesh',
    version: '1.24.2',
    description: 'Traffic management, mTLS, policy enforcement, and service-level observability.',
    logoSrc: '/logos/istio.svg',
    docsUrl: 'https://istio.io/latest/docs/',
    quickStartUrl: '/docs',
  },
  {
    name: 'KEDA',
    version: '2.16.0',
    description: 'Event-driven autoscaling for Kubernetes workloads using external metrics and triggers.',
    logoSrc: '/logos/keda.svg',
    docsUrl: 'https://keda.sh/docs/latest/',
    quickStartUrl: '/docs',
  },
  {
    name: 'Karpenter',
    version: '1.2.1',
    description: 'Node autoscaling and right-sizing to optimize cluster capacity and workload placement.',
    logoSrc: '/logos/karpenter.svg',
    logoStyle: { width: '100%', height: '100%' },
    docsUrl: 'https://karpenter.sh/docs/',
    quickStartUrl: '/docs',
    isNew: true,
  },
  {
    name: 'ArgoCD',
    version: '2.10.0',
    description: 'GitOps continuous delivery for Kubernetes applications and cluster add-ons.',
    logoSrc: '/logos/argo.svg',
    logoStyle: { width: '100%', height: '100%' },
    docsUrl: 'https://argo-cd.readthedocs.io/en/stable/',
    quickStartUrl: '/docs',
  },
  {
    name: 'Prometheus',
    version: '2.54.1',
    description: 'Metrics collection, alerting rules, and platform telemetry at cluster scale.',
    logoSrc: '/logos/prometheus.svg',
    docsUrl: 'https://prometheus.io/docs/introduction/overview/',
    quickStartUrl: '/docs',
  },
  {
    name: 'Grafana',
    version: '11.2.0',
    description: 'Dashboards and visualization for metrics, logs, and traces across environments.',
    logoSrc: '/logos/grafana.svg',
    docsUrl: 'https://grafana.com/docs/',
    quickStartUrl: '/docs',
  },
  {
    name: 'HashiCorp Vault',
    version: '1.18.3',
    description: 'Secrets management, dynamic credentials, and encryption for workloads.',
    logoSrc: '/logos/hashicorp.svg',
    logoStyle: { filter: 'invert(1) brightness(0.95)' },
    docsUrl: 'https://developer.hashicorp.com/vault/docs',
    quickStartUrl: '/docs',
  },
  {
    name: 'external-dns',
    version: '0.15.0',
    description: 'Automated DNS record management for Kubernetes Ingress and Service resources.',
    logoSrc: '/logos/external-dns.png',
    logoStyle: { width: '100%', height: '100%' },
    docsUrl: 'https://kubernetes-sigs.github.io/external-dns/latest/',
    quickStartUrl: '/docs',
    isNew: true,
  },
  {
    name: 'cert-manager',
    version: '1.16.1',
    description: 'TLS certificate automation and lifecycle management for cluster services.',
    logoSrc: '/logos/cert-manager.svg',
    logoStyle: { width: '100%', height: '100%' },
    docsUrl: 'https://cert-manager.io/docs/',
    quickStartUrl: '/docs',
  },
  {
    name: 'Jaeger',
    version: '1.61.0',
    description: 'Distributed tracing and request flow analysis for service-to-service observability.',
    logoSrc: '/logos/jaeger.svg',
    docsUrl: 'https://www.jaegertracing.io/docs/latest/',
    quickStartUrl: '/docs',
  },
  {
    name: 'Loki',
    version: '3.2.0',
    description: 'Scalable log aggregation for Kubernetes workloads with LogQL-powered querying.',
    logoSrc: '/logos/loki.png',
    logoStyle: { width: '100%', height: '100%' },
    logoWrapStyle: { background: '#ffffff' },
    docsUrl: 'https://grafana.com/docs/loki/latest/',
    quickStartUrl: '/docs',
    isNew: true,
  },
];

export const AddonsPage = () => {
  const classes = useStyles();

  return (
    <Page themeId="tool">
      <Header
        title="Browse Add-ons"
        subtitle={
          <HeaderBannerLogos
            layout="dashboard"
            text="Discover supported Kubernetes add-ons, versions, and setup documentation"
          />
        }
      />
      <Content>
        <Typography variant="body2" className={classes.subtitle}>
          Available platform add-ons with current approved versions and direct links to documentation and quick starts.
        </Typography>

        <Grid container spacing={2}>
          {addons.map(addon => (
            <Grid item xs={12} sm={6} md={4} key={addon.name}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Box className={classes.headerRow}>
                    <Box className={classes.titleRow}>
                      <Box className={classes.logoWrap} style={addon.logoWrapStyle}>
                        <img src={addon.logoSrc} alt={`${addon.name} logo`} className={classes.logo} style={addon.logoStyle} />
                      </Box>
                      <Typography className={classes.addonName}>{addon.name}</Typography>
                    </Box>
                    <Box className={classes.versionContainer}>
                      <Chip size="small" color="primary" label={`v${addon.version}`} />
                      {addon.isNew && <span className={classes.newBadge}>NEW</span>}
                    </Box>
                  </Box>
                  <Typography className={classes.addonDesc}>{addon.description}</Typography>
                </CardContent>
                <CardActions className={classes.linksRow}>
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    href={addon.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<OpenInNewIcon style={{ fontSize: 16 }} />}
                  >
                    Documentation
                  </Button>
                  {addon.quickStartUrl && (
                    <Button
                      size="small"
                      color="primary"
                      component={Link}
                      to={addon.quickStartUrl}
                    >
                      Quick Start
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Content>
    </Page>
  );
};
