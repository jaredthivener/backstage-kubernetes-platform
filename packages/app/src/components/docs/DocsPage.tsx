import { useState } from 'react';
import { HeaderBannerLogos } from '../shared/HeaderBannerLogos';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  makeStyles,
  Box,
  Chip,
  InputBase,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import CloudIcon from '@material-ui/icons/Cloud';
import SecurityIcon from '@material-ui/icons/Security';
import BuildIcon from '@material-ui/icons/Build';
import CodeIcon from '@material-ui/icons/Code';
import SchoolIcon from '@material-ui/icons/School';
import SpeedIcon from '@material-ui/icons/Speed';
import SettingsIcon from '@material-ui/icons/Settings';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  heroBanner: {
    background: 'linear-gradient(135deg, #1A237E 0%, #283593 35%, #3949AB 70%, #E8EAF6 100%)',
    borderRadius: 16,
    padding: theme.spacing(5, 4),
    color: '#fff',
    marginBottom: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -60,
      right: -60,
      width: 220,
      height: 220,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.06)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -40,
      left: '30%',
      width: 160,
      height: 160,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.04)',
    },
  },
  heroBannerArt: {
    position: 'absolute',
    right: theme.spacing(7),
    bottom: theme.spacing(1),
    height: 180,
    width: 'auto',
    opacity: 1,
    pointerEvents: 'none',
    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.22))',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  heroSubtitle: {
    fontSize: '1.05rem',
    opacity: 0.85,
    marginBottom: theme.spacing(3),
    maxWidth: 600,
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: theme.spacing(1, 2),
    maxWidth: 500,
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.2s',
    '&:focus-within': {
      backgroundColor: 'rgba(255,255,255,0.25)',
      borderColor: 'rgba(255,255,255,0.4)',
    },
  },
  searchInput: {
    color: '#fff',
    flex: 1,
    marginLeft: theme.spacing(1),
    fontSize: '1rem',
    '&::placeholder': {
      color: 'rgba(255,255,255,0.6)',
    },
  },
  categoryCard: {
    borderRadius: 12,
    height: '100%',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
    display: 'flex',
    flexDirection: 'column',
  },
  categoryCardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  categoryTitle: {
    fontWeight: 600,
    fontSize: '1.05rem',
    marginBottom: theme.spacing(0.5),
  },
  categoryDescription: {
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
    flex: 1,
  },
  articleCount: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: theme.spacing(1.5),
  },
  quickStartCard: {
    borderRadius: 12,
    borderLeft: '4px solid',
    transition: 'all 0.2s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 240,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  quickStartCardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  quickStartTitle: {
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  sectionHeader: {
    fontWeight: 700,
    fontSize: '1.25rem',
    marginBottom: theme.spacing(0.5),
  },
  sectionSubheader: {
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    marginBottom: theme.spacing(2.5),
  },
  popularArticle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    transition: 'background 0.15s',
    borderRadius: 4,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  articleTitleLink: {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  popularRank: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.8rem',
    flexShrink: 0,
  },
  statCard: {
    textAlign: 'center',
    padding: theme.spacing(2.5),
    borderRadius: 12,
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: theme.palette.text.secondary,
    marginTop: 4,
  },
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
interface DocCategory {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  articleCount: number;
  to: string;
}

const docCategories: DocCategory[] = [
  {
    title: 'Getting Started',
    description: 'Onboarding guides, first cluster deployment, and platform quickstarts.',
    icon: <PlayCircleOutlineIcon style={{ fontSize: 26, color: '#fff' }} />,
    color: '#4CAF50',
    articleCount: 12,
    to: '/docs/default/component/getting-started',
  },
  {
    title: 'Cluster Operations',
    description: 'Provisioning, upgrading, scaling, and managing Kubernetes clusters across CSPs.',
    icon: <CloudIcon style={{ fontSize: 26, color: '#fff' }} />,
    color: '#1976D2',
    articleCount: 24,
    to: '/docs/default/component/cluster-ops',
  },
  {
    title: 'Security & Compliance',
    description: 'Pod security standards, network policies, RBAC, vulnerability management, and audit.',
    icon: <SecurityIcon style={{ fontSize: 26, color: '#fff' }} />,
    color: '#F44336',
    articleCount: 18,
    to: '/docs/default/component/security',
  },
  {
    title: 'GitOps & CI/CD',
    description: 'ArgoCD workflows, GitHub Actions, deployment strategies, and pipeline best practices.',
    icon: <CodeIcon style={{ fontSize: 26, color: '#fff' }} />,
    color: '#FF9800',
    articleCount: 15,
    to: '/docs/default/component/gitops',
  },
  {
    title: 'Networking',
    description: 'Cilium, service mesh, ingress controllers, DNS, and multi-cluster networking.',
    icon: <SpeedIcon style={{ fontSize: 26, color: '#fff' }} />,
    color: '#9C27B0',
    articleCount: 11,
    to: '/docs/default/component/networking',
  },
  {
    title: 'Observability',
    description: 'Prometheus, Grafana, alerting, log aggregation, and distributed tracing.',
    icon: <TrendingUpIcon style={{ fontSize: 26, color: '#fff' }} />,
    color: '#E91E63',
    articleCount: 14,
    to: '/docs/default/component/observability',
  },
  {
    title: 'Platform Engineering',
    description: 'Backstage plugins, templates, catalog configuration, and platform APIs.',
    icon: <BuildIcon style={{ fontSize: 26, color: '#fff' }} />,
    color: '#00796B',
    articleCount: 9,
    to: '/docs/default/component/platform',
  },
  {
    title: 'Configuration Reference',
    description: 'Helm charts, add-on configs, app-config.yaml reference, and environment settings.',
    icon: <SettingsIcon style={{ fontSize: 26, color: '#fff' }} />,
    color: '#546E7A',
    articleCount: 21,
    to: '/docs/default/component/config-ref',
  },
];

interface QuickStart {
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
  to: string;
}

const quickStarts: QuickStart[] = [
  {
    title: 'Deploy Your First Cluster',
    description: 'Step-by-step guide to provision a production-ready AKS, EKS, or GKE cluster in under 10 minutes.',
    duration: '10 min',
    level: 'Beginner',
    color: '#4CAF50',
    to: '/create',
  },
  {
    title: 'Set Up GitOps with ArgoCD',
    description: 'Configure ArgoCD for automated deployments from your GitHub repository.',
    duration: '15 min',
    level: 'Intermediate',
    color: '#FF9800',
    to: '/docs/default/component/gitops',
  },
  {
    title: 'Harden Cluster Security',
    description: 'Apply pod security standards, network policies, RBAC, and vulnerability scanning.',
    duration: '20 min',
    level: 'Advanced',
    color: '#F44336',
    to: '/docs/default/component/security',
  },
  {
    title: 'Configure Monitoring Stack',
    description: 'Deploy Prometheus + Grafana with custom dashboards for Kubernetes observability.',
    duration: '12 min',
    level: 'Intermediate',
    color: '#E91E63',
    to: '/docs/default/component/observability',
  },
];

const popularArticles = [
  { id: 'cilium-networking', title: 'Multi-cluster Networking with Cilium', views: '2.4k', category: 'Networking', to: '/docs/articles/cilium-networking' },
  { id: 'cost-optimization', title: 'Cost Optimization: Right-sizing Node Pools', views: '1.8k', category: 'Operations', to: '/docs/articles/cost-optimization' },
  { id: 'migration-eks-aks', title: 'Migrating from EKS to AKS', views: '1.5k', category: 'Migration', to: '/docs/articles/migration-eks-aks' },
  { id: 'pci-dss', title: 'PCI-DSS Compliance for Kubernetes', views: '1.3k', category: 'Security', to: '/docs/articles/pci-dss' },
  { id: 'canary-deployments', title: 'Canary Deployments with ArgoCD Rollouts', views: '1.1k', category: 'GitOps', to: '/docs/articles/canary-deployments' },
  { id: 'gpu-pools', title: 'GPU Node Pools for ML Workloads', views: '980', category: 'AI/ML', to: '/docs/articles/gpu-pools' },
  { id: 'etcd-troubleshooting', title: 'Troubleshooting etcd Performance', views: '870', category: 'Operations', to: '/docs/articles/etcd-troubleshooting' },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Favorite {
  id: string;
  title: string;
  views: string;
  category: string;
  to?: string;
}

// ---------------------------------------------------------------------------
// Main Docs Page
// ---------------------------------------------------------------------------
export const DocsPage = () => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const isFavorited = (articleId: string): boolean => {
    return favorites.some(fav => fav.id === articleId);
  };

  const toggleFavorite = (article: Favorite) => {
    if (isFavorited(article.id)) {
      setFavorites(favorites.filter(fav => fav.id !== article.id));
    } else {
      setFavorites([...favorites, article]);
    }
  };

  const filteredCategories = searchQuery
    ? docCategories.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : docCategories;

  const levelColor = (level: string) =>
    level === 'Beginner' ? '#4CAF50' : level === 'Intermediate' ? '#FF9800' : '#F44336';

  return (
    <Page themeId="documentation">
      <Header
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <MenuBookIcon />
            Documentation
          </span>
        }
        subtitle={
          <HeaderBannerLogos layout="docs" text="Everything you need to know about the Kubernetes Platform" />
        }
      />
      <Content>
        {/* Hero Banner */}
        <Box className={classes.heroBanner}>
          <img src="/logos/docs-banner-hiclipart-transparent.png" alt="" className={classes.heroBannerArt} />
          <Box className={classes.heroContent}>
            <Typography className={classes.heroTitle}>
              Knowledge Base
            </Typography>
            <Typography className={classes.heroSubtitle}>
              Guides, tutorials, and reference documentation for deploying and managing
              Kubernetes clusters at Morgan Stanley. From first cluster to production-grade infrastructure.
            </Typography>
            <Box className={classes.searchBox}>
              <SearchIcon style={{ color: 'rgba(255,255,255,0.7)' }} />
              <InputBase
                placeholder="Search documentation... (e.g., 'network policy', 'ArgoCD')"
                className={classes.searchInput}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </Box>
          </Box>
        </Box>

        {/* Stats Row */}
        <Grid container spacing={2} style={{ marginBottom: 32 }}>
          {[
            { value: '124', label: 'Articles', color: '#1976D2' },
            { value: '8', label: 'Categories', color: '#7B1FA2' },
            { value: '32', label: 'Tutorials', color: '#388E3C' },
            { value: '4.8k', label: 'Monthly Readers', color: '#E91E63' },
          ].map(stat => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper className={classes.statCard} variant="outlined">
                <Typography className={classes.statValue} style={{ color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography className={classes.statLabel}>{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Quick Start Guides */}
        <Box mb={4}>
          <Typography className={classes.sectionHeader}>
            <Box display="flex" alignItems="center" gridGap={8}>
              <SchoolIcon color="primary" /> Quick Start Guides
            </Box>
          </Typography>
          <Typography className={classes.sectionSubheader}>
            Hands-on tutorials to get you productive fast
          </Typography>
          <Grid container spacing={2}>
            {quickStarts.map(qs => (
              <Grid item xs={12} sm={6} md={3} key={qs.title}>
                <Card
                  className={classes.quickStartCard}
                  style={{ borderLeftColor: qs.color }}
                  component={Link}
                  {...({ to: qs.to, style: { textDecoration: 'none', borderLeftColor: qs.color } } as any)}
                >
                  <CardContent className={classes.quickStartCardContent}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Chip
                        size="small"
                        label={qs.level}
                        style={{
                          backgroundColor: `${levelColor(qs.level)}18`,
                          color: levelColor(qs.level),
                          fontWeight: 600,
                          fontSize: '0.65rem',
                          height: 20,
                        }}
                      />
                      <Box display="flex" alignItems="center" gridGap={4}>
                        <AccessTimeIcon style={{ fontSize: 14, color: '#999' }} />
                        <Typography variant="caption" color="textSecondary">{qs.duration}</Typography>
                      </Box>
                    </Box>
                    <Typography className={classes.quickStartTitle}>{qs.title}</Typography>
                    <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.8rem', marginTop: 4, flex: 1 }}>
                      {qs.description}
                    </Typography>
                  </CardContent>
                  <CardActions style={{ justifyContent: 'flex-end', paddingTop: 0 }}>
                    <Tooltip title={`${isFavorited(qs.title) ? 'Remove' : 'Add'} to bookmarks`}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite({ id: qs.title, title: qs.title, views: '', category: 'Quick Start', to: qs.to });
                        }}
                        style={{ color: isFavorited(qs.title) ? '#FFB300' : '#999' }}
                      >
                        {isFavorited(qs.title) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Browse by Category + Popular Articles */}
        <Grid container spacing={4}>
          {/* Categories */}
          <Grid item xs={12} md={8}>
            <Typography className={classes.sectionHeader}>
              <Box display="flex" alignItems="center" gridGap={8}>
                <MenuBookIcon color="primary" /> Browse by Category
              </Box>
            </Typography>
            <Typography className={classes.sectionSubheader}>
              Deep-dive into any topic area
            </Typography>
            <Grid container spacing={2}>
              {filteredCategories.map(cat => (
                <Grid item xs={12} sm={6} key={cat.title}>
                  <Card className={classes.categoryCard} component={Link} {...({ to: cat.to, style: { textDecoration: 'none' } } as any)}>
                    <CardContent className={classes.categoryCardContent}>
                      <Box className={classes.categoryIcon} style={{ backgroundColor: cat.color }}>
                        {cat.icon}
                      </Box>
                      <Typography className={classes.categoryTitle}>{cat.title}</Typography>
                      <Typography className={classes.categoryDescription}>{cat.description}</Typography>
                      <Typography className={classes.articleCount}>{cat.articleCount} articles</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary" endIcon={<ArrowForwardIcon />}>
                        Explore
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Popular Articles Sidebar */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography className={classes.sectionHeader}>
                <Box display="flex" alignItems="center" gridGap={8}>
                  <StarIcon style={{ color: '#FFB300' }} /> {showFavoritesOnly ? 'Bookmarked Articles' : 'Popular Articles'}
                </Box>
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gridGap={8} mb={2}>
              <Chip
                label={`Popular (${popularArticles.length})`}
                onClick={() => setShowFavoritesOnly(false)}
                color={!showFavoritesOnly ? 'primary' : 'default'}
                variant={!showFavoritesOnly ? 'default' : 'outlined'}
                size="small"
              />
              <Chip
                label={`Bookmarked (${favorites.length})`}
                onClick={() => setShowFavoritesOnly(true)}
                color={showFavoritesOnly ? 'primary' : 'default'}
                variant={showFavoritesOnly ? 'default' : 'outlined'}
                size="small"
                disabled={favorites.length === 0}
              />
            </Box>
            {showFavoritesOnly && favorites.length === 0 ? (
              <Card style={{ borderRadius: 12, textAlign: 'center', padding: '24px' }}>
                <StarBorderIcon style={{ fontSize: 32, color: '#ccc', marginBottom: 8 }} />
                <Typography color="textSecondary">
                  No bookmarked articles yet. Click the star icon to save articles.
                </Typography>
              </Card>
            ) : (
              <Card style={{ borderRadius: 12 }}>
                <CardContent>
                  {(showFavoritesOnly ? favorites : popularArticles).map((article, i) => (
                    <Box key={article.id || article.title} className={classes.popularArticle}>
                      {!showFavoritesOnly && (
                        <Box
                          className={classes.popularRank}
                          style={{
                            backgroundColor: i < 3 ? '#1976D2' : '#E0E0E0',
                            color: i < 3 ? '#fff' : '#666',
                          }}
                        >
                          {i + 1}
                        </Box>
                      )}
                      <Box flex={1}>
                        {article.to ? (
                          <Typography
                            variant="body2"
                            className={classes.articleTitleLink}
                            component={Link}
                            to={article.to}
                            style={{ fontWeight: 600, fontSize: '0.85rem' }}
                          >
                            {article.title}
                          </Typography>
                        ) : (
                          <Typography variant="body2" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {article.title}
                          </Typography>
                        )}
                        <Box display="flex" alignItems="center" gridGap={8} mt={0.5}>
                          <Chip
                            size="small"
                            label={article.category}
                            variant="outlined"
                            style={{ fontSize: '0.6rem', height: 18 }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {article.views} views
                          </Typography>
                        </Box>
                      </Box>
                      <Tooltip title={isFavorited(article.id) ? 'Remove bookmark' : 'Add bookmark'}>
                        <IconButton
                          size="small"
                          onClick={() => toggleFavorite(article)}
                          style={{ color: isFavorited(article.id) ? '#FFB300' : '#999' }}
                        >
                          {isFavorited(article.id) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Contributing */}
            <Box mt={3}>
              <Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
                <CardContent>
                  <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 4, color: '#1565C0' }}>
                    Contribute to Docs
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: 12, color: '#37474F' }}>
                    Found something missing? Have expertise to share?
                    All documentation lives in Git — submit a PR to improve it.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    href="https://github.com/morgan-stanley/kubernetes-platform-docs"
                    target="_blank"
                    startIcon={<CodeIcon />}
                  >
                    Open on GitHub
                  </Button>
                </CardContent>
              </Card>
            </Box>

            {/* Recently Updated */}
            <Box mt={3}>
              <Card style={{ borderRadius: 12 }}>
                <CardContent>
                  <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: 12 }}>
                    <Box display="flex" alignItems="center" gridGap={6}>
                      <AccessTimeIcon style={{ fontSize: 18 }} /> Recently Updated
                    </Box>
                  </Typography>
                  {[
                    { title: 'Kubernetes 1.30 Upgrade Guide', time: '2 days ago' },
                    { title: 'Cilium 1.16 Migration Steps', time: '5 days ago' },
                    { title: 'Cost Optimization Playbook', time: '1 week ago' },
                    { title: 'ArgoCD ApplicationSets', time: '2 weeks ago' },
                  ].map(doc => (
                    <Box key={doc.title} py={0.75} display="flex" justifyContent="space-between" borderBottom="1px solid #eee">
                      <Typography variant="body2" style={{ fontWeight: 500, fontSize: '0.85rem' }}>{doc.title}</Typography>
                      <Typography variant="caption" color="textSecondary" style={{ flexShrink: 0, marginLeft: 8 }}>{doc.time}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>

        <Divider style={{ margin: '32px 0' }} />

        {/* Need Help */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
            Can't find what you're looking for?
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
            Reach out to the Platform Engineering team via Microsoft Teams or open a support ticket.
          </Typography>
          <Box display="flex" justifyContent="center" gridGap={12}>
            <Button variant="outlined" color="primary" component={Link} to="/create">
              Open Support Ticket
            </Button>
            <Button variant="text" color="primary" href="https://teams.microsoft.com" target="_blank">
              #kubernetes-platform on Microsoft Teams
            </Button>
          </Box>
        </Box>
      </Content>
    </Page>
  );
};
