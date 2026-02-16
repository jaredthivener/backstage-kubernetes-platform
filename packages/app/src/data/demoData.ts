export interface DemoCluster {
  name: string;
  csp: 'azure' | 'aws' | 'gcp';
  environment: 'production' | 'staging' | 'development';
  region: string;
}

export interface DemoPersona {
  id: string;
  name: string;
  role: 'Platform Owner' | 'Platform Admin' | 'SRE Lead' | 'Security Analyst' | 'Developer';
  team: string;
  email: string;
}

export interface DemoTeamMember {
  id: string;
  name: string;
  assignedRole: 'Platform Owner' | 'Platform Admin' | 'SRE Lead' | 'Security Analyst' | 'Developer' | 'Viewer';
  team: string;
}

export const demoClusters: DemoCluster[] = [
  { name: 'prod-trading-aks', csp: 'azure', environment: 'production', region: 'eastus' },
  { name: 'prod-analytics-eks', csp: 'aws', environment: 'production', region: 'us-east-1' },
  { name: 'prod-risk-gke', csp: 'gcp', environment: 'production', region: 'us-central1' },
  { name: 'staging-risk-eks', csp: 'aws', environment: 'staging', region: 'us-west-2' },
  { name: 'dev-sandbox-aks', csp: 'azure', environment: 'development', region: 'westus2' },
  { name: 'dev-ml-gke', csp: 'gcp', environment: 'development', region: 'europe-west1' },
  { name: 'qa-payments-aks', csp: 'azure', environment: 'staging', region: 'centralus' },
  { name: 'prod-payments-eks', csp: 'aws', environment: 'production', region: 'us-east-2' },
  { name: 'staging-ops-gke', csp: 'gcp', environment: 'staging', region: 'us-west1' },
  { name: 'dev-observability-aks', csp: 'azure', environment: 'development', region: 'eastus2' },
  { name: 'qa-observability-eks', csp: 'aws', environment: 'staging', region: 'us-west-1' },
];

export const demoPersonas: DemoPersona[] = [
  {
    id: 'ava-morgan',
    name: 'Ava Morgan',
    role: 'Platform Owner',
    team: 'Platform Engineering',
    email: 'ava.morgan@morganstanley.com',
  },
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    role: 'SRE Lead',
    team: 'SRE',
    email: 'sarah.chen@morganstanley.com',
  },
  {
    id: 'nadia-patel',
    name: 'Nadia Patel',
    role: 'Security Analyst',
    team: 'Security Operations',
    email: 'nadia.patel@morganstanley.com',
  },
  {
    id: 'priya-agarwal',
    name: 'Priya Agarwal',
    role: 'Developer',
    team: 'Payments Platform',
    email: 'priya.agarwal@morganstanley.com',
  },
];

export const demoTeamMembers: DemoTeamMember[] = [
  { id: 'ava-morgan', name: 'Ava Morgan', assignedRole: 'Platform Owner', team: 'Platform Engineering' },
  { id: 'kevin-walsh', name: 'Kevin Walsh', assignedRole: 'Platform Admin', team: 'Platform Engineering' },
  { id: 'sarah-chen', name: 'Sarah Chen', assignedRole: 'SRE Lead', team: 'SRE' },
  { id: 'david-kim', name: 'David Kim', assignedRole: 'Viewer', team: 'SRE' },
  { id: 'nadia-patel', name: 'Nadia Patel', assignedRole: 'Security Analyst', team: 'Security Operations' },
  { id: 'priya-agarwal', name: 'Priya Agarwal', assignedRole: 'Developer', team: 'Payments Platform' },
];
