/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started/local-development', 'getting-started/first-cluster-workflow'],
    },
    {
      type: 'category',
      label: 'Platform Architecture',
      items: ['reference/platform-architecture', 'core-workflows/gitops-model'],
    },
    {
      type: 'category',
      label: 'Core Workflows',
      items: [
        'core-workflows/cluster-lifecycle',
        'core-workflows/addons-and-day2',
        'operations/monitoring-cost-security',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: ['reference/repository-map', 'reference/templates', 'reference/navigation-model'],
    },
    {
      type: 'category',
      label: 'Contributing',
      items: ['contributing/docusaurus-and-techdocs', 'contributing/github-pages'],
    },
  ],
};

module.exports = sidebars;