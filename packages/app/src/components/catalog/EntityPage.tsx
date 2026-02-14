import React from 'react';
import {
  Button,
  Grid,
  Typography,
  Chip,
  makeStyles,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Box,
} from '@material-ui/core';
import MemoryIcon from '@material-ui/icons/Memory';
import StorageIcon from '@material-ui/icons/Storage';
import SecurityIcon from '@material-ui/icons/Security';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import UpdateIcon from '@material-ui/icons/Update';
import SettingsIcon from '@material-ui/icons/Settings';
import DnsIcon from '@material-ui/icons/Dns';
import {
  EntityApiDefinitionCard,
  EntityConsumedApisCard,
  EntityConsumingComponentsCard,
  EntityHasApisCard,
  EntityProvidedApisCard,
  EntityProvidingComponentsCard,
} from '@backstage/plugin-api-docs';
import {
  EntityAboutCard,
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityHasSubcomponentsCard,
  EntityHasSystemsCard,
  EntityLayout,
  EntityLinksCard,
  EntitySwitch,
  EntityOrphanWarning,
  EntityProcessingErrorsPanel,
  isComponentType,
  isKind,
  hasCatalogProcessingErrors,
  isOrphan,
  hasRelationWarnings,
  EntityRelationWarning,
} from '@backstage/plugin-catalog';
import {
  EntityUserProfileCard,
  EntityGroupProfileCard,
  EntityMembersListCard,
  EntityOwnershipCard,
} from '@backstage/plugin-org';
import { useEntity } from '@backstage/plugin-catalog-react';
import { EntityTechdocsContent } from '@backstage/plugin-techdocs';
import {
  EmptyState,
  InfoCard,
  StatusOK,
  StatusError,
  StatusWarning,
} from '@backstage/core-components';
import {
  Direction,
  EntityCatalogGraphCard,
} from '@backstage/plugin-catalog-graph';
import {
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
} from '@backstage/catalog-model';

import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';

import {
  EntityKubernetesContent,
  isKubernetesAvailable,
} from '@backstage/plugin-kubernetes';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useClusterStyles = makeStyles(theme => ({
  statusChip: {
    fontWeight: 600,
  },
  metricCard: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
  metricLabel: {
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cspAvatar: {
    width: 40,
    height: 40,
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  azureAvatar: { backgroundColor: '#0078D4' },
  awsAvatar: { backgroundColor: '#FF9900', color: '#232F3E' },
  gcpAvatar: { backgroundColor: '#34A853' },
  sectionTitle: {
    marginBottom: theme.spacing(1),
    fontWeight: 600,
  },
}));

// ---------------------------------------------------------------------------
// Helper: CSP Badge
// ---------------------------------------------------------------------------
const CspBadge = ({ csp }: { csp: string }) => {
  const classes = useClusterStyles();
  const label = csp?.toUpperCase() || 'N/A';
  const avatarClass =
    csp === 'azure'
      ? classes.azureAvatar
      : csp === 'aws'
        ? classes.awsAvatar
        : csp === 'gcp'
          ? classes.gcpAvatar
          : undefined;
  return <Avatar className={`${classes.cspAvatar} ${avatarClass || ''}`}>{label.slice(0, 3)}</Avatar>;
};

// ---------------------------------------------------------------------------
// Cluster Overview Card — rendered for Resource kind = kubernetes-cluster
// ---------------------------------------------------------------------------
const ClusterOverviewCard = () => {
  const { entity } = useEntity();
  const classes = useClusterStyles();
  const metadata = entity.metadata;
  const annotations = metadata.annotations || {};
  const spec = (entity as any).spec || {};

  const csp = annotations['morgan-stanley.com/csp'] || spec.csp || 'unknown';
  const environment = annotations['morgan-stanley.com/environment'] || spec.environment || '—';
  const region = annotations['morgan-stanley.com/region'] || spec.region || '—';
  const k8sVersion = annotations['morgan-stanley.com/kubernetes-version'] || spec.kubernetesVersion || '—';
  const clusterType = annotations['morgan-stanley.com/cluster-type'] || spec.type || 'workload';
  const nodeCount = annotations['morgan-stanley.com/node-count'] || spec.nodeCount || '—';
  const instanceType = annotations['morgan-stanley.com/instance-type'] || spec.instanceType || '—';

  return (
    <InfoCard title="Cluster Overview" variant="gridItem">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gridGap={16}>
            <CspBadge csp={csp} />
            <Box>
              <Typography variant="h6">{metadata.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {metadata.description || 'Kubernetes cluster managed by Morgan Stanley KaaS'}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography className={classes.metricLabel}>CSP</Typography>
          <Typography variant="body1"><strong>{csp.toUpperCase()}</strong></Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography className={classes.metricLabel}>Environment</Typography>
          <Chip label={environment} size="small" color={environment === 'production' ? 'secondary' : 'default'} />
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography className={classes.metricLabel}>Region</Typography>
          <Typography variant="body1">{region}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography className={classes.metricLabel}>K8s Version</Typography>
          <Chip label={k8sVersion} size="small" variant="outlined" />
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography className={classes.metricLabel}>Cluster Type</Typography>
          <Typography variant="body1">{clusterType}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography className={classes.metricLabel}>Node Count</Typography>
          <Typography variant="body1">{nodeCount}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography className={classes.metricLabel}>Instance Type</Typography>
          <Typography variant="body1">{instanceType}</Typography>
        </Grid>
      </Grid>
    </InfoCard>
  );
};

// ---------------------------------------------------------------------------
// Cluster Add-ons Card
// ---------------------------------------------------------------------------
const ClusterAddonsCard = () => {
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations || {};
  const addonsRaw = annotations['morgan-stanley.com/addons'] || '';
  const addons = addonsRaw ? addonsRaw.split(',').map((a: string) => a.trim()) : [];

  const addonIcons: Record<string, React.ReactNode> = {
    'kube-prometheus-stack': <MemoryIcon />,
    'vault-agent': <SecurityIcon />,
    'network-policies': <NetworkCheckIcon />,
    'namespace-operator': <DnsIcon />,
    'cert-manager': <SecurityIcon />,
    'external-dns': <DnsIcon />,
    'ingress-nginx': <NetworkCheckIcon />,
    'argocd': <UpdateIcon />,
  };

  return (
    <InfoCard title="Installed Add-ons" variant="gridItem">
      {addons.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No add-on annotations found. Add-ons are tracked via the{' '}
          <code>morgan-stanley.com/addons</code> annotation.
        </Typography>
      ) : (
        <List dense>
          {addons.map((addon: string) => (
            <ListItem key={addon}>
              <ListItemIcon>{addonIcons[addon] || <SettingsIcon />}</ListItemIcon>
              <ListItemText primary={addon} />
              <StatusOK>Running</StatusOK>
            </ListItem>
          ))}
        </List>
      )}
    </InfoCard>
  );
};

// ---------------------------------------------------------------------------
// Cluster Networking Card
// ---------------------------------------------------------------------------
const ClusterNetworkingCard = () => {
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations || {};
  const vnetCidr = annotations['morgan-stanley.com/vnet-cidr'] || '10.0.0.0/16';
  const podCidr = annotations['morgan-stanley.com/pod-cidr'] || '10.244.0.0/16';
  const serviceCidr = annotations['morgan-stanley.com/service-cidr'] || '10.96.0.0/12';
  const dnsZone = annotations['morgan-stanley.com/dns-zone'] || '—';
  const networkPolicy = annotations['morgan-stanley.com/network-policy'] || 'PCI-DSS';

  return (
    <InfoCard title="Networking" variant="gridItem">
      <List dense>
        <ListItem>
          <ListItemIcon><NetworkCheckIcon /></ListItemIcon>
          <ListItemText primary="VNet / VPC CIDR" secondary={vnetCidr} />
        </ListItem>
        <ListItem>
          <ListItemIcon><DnsIcon /></ListItemIcon>
          <ListItemText primary="Pod CIDR" secondary={podCidr} />
        </ListItem>
        <ListItem>
          <ListItemIcon><DnsIcon /></ListItemIcon>
          <ListItemText primary="Service CIDR" secondary={serviceCidr} />
        </ListItem>
        <ListItem>
          <ListItemIcon><DnsIcon /></ListItemIcon>
          <ListItemText primary="DNS Zone" secondary={dnsZone} />
        </ListItem>
        <ListItem>
          <ListItemIcon><SecurityIcon /></ListItemIcon>
          <ListItemText primary="Network Policy" secondary={networkPolicy} />
        </ListItem>
      </List>
    </InfoCard>
  );
};

// ---------------------------------------------------------------------------
// Cluster Security Card
// ---------------------------------------------------------------------------
const ClusterSecurityCard = () => {
  const { entity } = useEntity();
  const annotations = entity.metadata.annotations || {};
  const authProvider = annotations['morgan-stanley.com/auth-provider'] || 'Entra ID';
  const vaultPath = annotations['morgan-stanley.com/vault-path'] || '—';
  const complianceStatus = annotations['morgan-stanley.com/compliance-status'] || 'compliant';
  const pciCompliant = annotations['morgan-stanley.com/pci-compliant'] || 'true';

  return (
    <InfoCard title="Security & Compliance" variant="gridItem">
      <List dense>
        <ListItem>
          <ListItemIcon><SecurityIcon /></ListItemIcon>
          <ListItemText
            primary="Identity Provider"
            secondary={authProvider}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon><StorageIcon /></ListItemIcon>
          <ListItemText
            primary="Vault Secret Path"
            secondary={vaultPath}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon><SecurityIcon /></ListItemIcon>
          <ListItemText
            primary="Compliance Status"
            secondary={
              complianceStatus === 'compliant' ? (
                <StatusOK>Compliant</StatusOK>
              ) : (
                <StatusWarning>Review Required</StatusWarning>
              )
            }
          />
        </ListItem>
        <ListItem>
          <ListItemIcon><SecurityIcon /></ListItemIcon>
          <ListItemText
            primary="PCI-DSS"
            secondary={
              pciCompliant === 'true' ? (
                <StatusOK>Compliant</StatusOK>
              ) : (
                <StatusError>Non-Compliant</StatusError>
              )
            }
          />
        </ListItem>
      </List>
    </InfoCard>
  );
};

// ---------------------------------------------------------------------------
// Cluster Quick Actions Card
// ---------------------------------------------------------------------------
const ClusterQuickActionsCard = () => {
  const { entity } = useEntity();
  const clusterName = entity.metadata.name;
  const clusterRef = `resource:default/${clusterName}`;
  const templateUrl = (templateName: string, formData: Record<string, string>) =>
    `/create/templates/default/${templateName}?formData=${encodeURIComponent(JSON.stringify(formData))}`;

  return (
    <InfoCard title="Quick Actions" variant="gridItem">
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<UpdateIcon />}
            href={templateUrl('kubernetes-cluster-upgrade', { scope: 'single', clusterRef })}
          >
            Upgrade
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<MemoryIcon />}
            href={templateUrl('kubernetes-cluster-scale', { clusterRef })}
          >
            Scale
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<SettingsIcon />}
            href={templateUrl('kubernetes-addon-management', { clusterRef })}
          >
            Manage Add-ons
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<DnsIcon />}
            href={templateUrl('kubernetes-namespace-request', { clusterRef })}
          >
            Request Namespace
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            startIcon={<SecurityIcon />}
            href={templateUrl('kubernetes-cluster-destroy', { clusterRef, confirmClusterName: clusterName })}
          >
            Decommission Cluster
          </Button>
        </Grid>
      </Grid>
    </InfoCard>
  );
};

// ---------------------------------------------------------------------------
// Helper: is a kubernetes-cluster resource
// ---------------------------------------------------------------------------
function isKubernetesCluster(entity: any): boolean {
  return (
    entity?.kind?.toLowerCase() === 'resource' &&
    entity?.spec?.type?.toLowerCase() === 'kubernetes-cluster'
  );
}

const techdocsContent = (
  <EntityTechdocsContent>
    <TechDocsAddons>
      <ReportIssue />
    </TechDocsAddons>
  </EntityTechdocsContent>
);

const cicdContent = (
  // This is an example of how you can implement your company's logic in entity page.
  // You can for example enforce that all components of type 'service' should use GitHubActions
  <EntitySwitch>
    {/*
      Here you can add support for different CI/CD services, for example
      using @backstage-community/plugin-github-actions as follows:
      <EntitySwitch.Case if={isGithubActionsAvailable}>
        <EntityGithubActionsContent />
      </EntitySwitch.Case>
     */}
    <EntitySwitch.Case>
      <EmptyState
        title="No CI/CD available for this entity"
        missing="info"
        description="You need to add an annotation to your component if you want to enable CI/CD for it. You can read more about annotations in Backstage by clicking the button below."
        action={
          <Button
            variant="contained"
            color="primary"
            href="https://backstage.io/docs/features/software-catalog/well-known-annotations"
          >
            Read more
          </Button>
        }
      />
    </EntitySwitch.Case>
  </EntitySwitch>
);

const entityWarningContent = (
  <>
    <EntitySwitch>
      <EntitySwitch.Case if={isOrphan}>
        <Grid item xs={12}>
          <EntityOrphanWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={hasRelationWarnings}>
        <Grid item xs={12}>
          <EntityRelationWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={hasCatalogProcessingErrors}>
        <Grid item xs={12}>
          <EntityProcessingErrorsPanel />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </>
);

const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    {entityWarningContent}
    <Grid item md={6}>
      <EntityAboutCard variant="gridItem" />
    </Grid>
    <Grid item md={6} xs={12}>
      <EntityCatalogGraphCard variant="gridItem" height={400} />
    </Grid>

    <Grid item md={4} xs={12}>
      <EntityLinksCard />
    </Grid>
    <Grid item md={8} xs={12}>
      <EntityHasSubcomponentsCard variant="gridItem" />
    </Grid>
  </Grid>
);

const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route
      path="/kubernetes"
      title="Kubernetes"
      if={isKubernetesAvailable}
    >
      <EntityKubernetesContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/api" title="API">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityProvidedApisCard />
        </Grid>
        <Grid item md={6}>
          <EntityConsumedApisCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/dependencies" title="Dependencies">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityDependsOnComponentsCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityDependsOnResourcesCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
      {techdocsContent}
    </EntityLayout.Route>
  </EntityLayout>
);

const websiteEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/ci-cd" title="CI/CD">
      {cicdContent}
    </EntityLayout.Route>

    <EntityLayout.Route
      path="/kubernetes"
      title="Kubernetes"
      if={isKubernetesAvailable}
    >
      <EntityKubernetesContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/dependencies" title="Dependencies">
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <EntityDependsOnComponentsCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityDependsOnResourcesCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
      {techdocsContent}
    </EntityLayout.Route>
  </EntityLayout>
);

/**
 * NOTE: This page is designed to work on small screens such as mobile devices.
 * This is based on Material UI Grid. If breakpoints are used, each grid item must set the `xs` prop to a column size or to `true`,
 * since this does not default. If no breakpoints are used, the items will equitably share the available space.
 * https://material-ui.com/components/grid/#basic-grid.
 */

const defaultEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {overviewContent}
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
      {techdocsContent}
    </EntityLayout.Route>
  </EntityLayout>
);

const componentPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isComponentType('service')}>
      {serviceEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case if={isComponentType('website')}>
      {websiteEntityPage}
    </EntitySwitch.Case>

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);

const apiPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid item md={6}>
          <EntityAboutCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid item md={4} xs={12}>
          <EntityLinksCard />
        </Grid>
        <Grid container item md={12}>
          <Grid item md={6}>
            <EntityProvidingComponentsCard />
          </Grid>
          <Grid item md={6}>
            <EntityConsumingComponentsCard />
          </Grid>
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route path="/definition" title="Definition">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EntityApiDefinitionCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

const userPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid item xs={12} md={6}>
          <EntityUserProfileCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityOwnershipCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

const groupPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        {entityWarningContent}
        <Grid item xs={12} md={6}>
          <EntityGroupProfileCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityOwnershipCard variant="gridItem" />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityMembersListCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <EntityLinksCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

const systemPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {entityWarningContent}
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid item md={4} xs={12}>
          <EntityLinksCard />
        </Grid>
        <Grid item md={8}>
          <EntityHasComponentsCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasApisCard variant="gridItem" />
        </Grid>
        <Grid item md={6}>
          <EntityHasResourcesCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/diagram" title="Diagram">
      <EntityCatalogGraphCard
        variant="gridItem"
        direction={Direction.TOP_BOTTOM}
        title="System Diagram"
        height={700}
        relations={[
          RELATION_PART_OF,
          RELATION_HAS_PART,
          RELATION_API_CONSUMED_BY,
          RELATION_API_PROVIDED_BY,
          RELATION_CONSUMES_API,
          RELATION_PROVIDES_API,
          RELATION_DEPENDENCY_OF,
          RELATION_DEPENDS_ON,
        ]}
        unidirectional={false}
      />
    </EntityLayout.Route>
  </EntityLayout>
);

const domainPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {entityWarningContent}
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid item md={6}>
          <EntityHasSystemsCard variant="gridItem" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);

// ---------------------------------------------------------------------------
// Kubernetes Cluster Resource Page
// ---------------------------------------------------------------------------
const kubernetesClusterPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {entityWarningContent}
        <Grid item md={8} xs={12}>
          <ClusterOverviewCard />
        </Grid>
        <Grid item md={4} xs={12}>
          <ClusterQuickActionsCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <ClusterAddonsCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <ClusterNetworkingCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <ClusterSecurityCard />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid item md={12} xs={12}>
          <EntityLinksCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>

    <EntityLayout.Route
      path="/kubernetes"
      title="Workloads"
      if={isKubernetesAvailable}
    >
      <EntityKubernetesContent />
    </EntityLayout.Route>

    <EntityLayout.Route path="/docs" title="Docs">
      {techdocsContent}
    </EntityLayout.Route>
  </EntityLayout>
);

// ---------------------------------------------------------------------------
// Generic Resource Page (non-cluster resources)
// ---------------------------------------------------------------------------
const resourcePage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {entityWarningContent}
        <Grid item md={6}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        <Grid item md={6} xs={12}>
          <EntityCatalogGraphCard variant="gridItem" height={400} />
        </Grid>
        <Grid item md={4} xs={12}>
          <EntityLinksCard />
        </Grid>
      </Grid>
    </EntityLayout.Route>
    <EntityLayout.Route path="/docs" title="Docs">
      {techdocsContent}
    </EntityLayout.Route>
  </EntityLayout>
);

export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('component')} children={componentPage} />
    <EntitySwitch.Case if={isKind('api')} children={apiPage} />
    <EntitySwitch.Case if={isKind('group')} children={groupPage} />
    <EntitySwitch.Case if={isKind('user')} children={userPage} />
    <EntitySwitch.Case if={isKind('system')} children={systemPage} />
    <EntitySwitch.Case if={isKind('domain')} children={domainPage} />
    <EntitySwitch.Case if={e => isKind('resource')(e) && isKubernetesCluster(e)}>
      {kubernetesClusterPage}
    </EntitySwitch.Case>
    <EntitySwitch.Case if={isKind('resource')} children={resourcePage} />

    <EntitySwitch.Case>{defaultEntityPage}</EntitySwitch.Case>
  </EntitySwitch>
);
