const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Morgan Stanley KaaS Docs',
  tagline: 'Developer documentation for the Backstage-powered Kubernetes platform',
  favicon: 'img/kubernetes.svg',
  url: 'https://jaredthivener.github.io',
  baseUrl: '/backstage-kubernetes-platform/',
  organizationName: 'jaredthivener',
  projectName: 'backstage-kubernetes-platform',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/jaredthivener/backstage-kubernetes-platform/tree/main/docs-site/',
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        docsRouteBasePath: 'docs',
        indexDocs: true,
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        explicitSearchResultPath: true,
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/kubernetes.svg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'KaaS Docs',
        logo: {
          alt: 'Kubernetes',
          src: 'img/kubernetes.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Developer Guide',
          },
          {
            to: '/docs/reference/repository-map',
            label: 'Repository Map',
            position: 'left',
          },
          {
            to: '/docs/core-workflows/gitops-model',
            label: 'GitOps Flow',
            position: 'left',
          },
          {
            href: 'https://github.com/jaredthivener/backstage-kubernetes-platform',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Platform Overview', to: '/docs/intro' },
              { label: 'Quickstart', to: '/docs/getting-started/local-development' },
              { label: 'Templates', to: '/docs/reference/templates' },
            ],
          },
          {
            title: 'Product Areas',
            items: [
              { label: 'Cluster Operations', to: '/docs/core-workflows/cluster-lifecycle' },
              { label: 'Operations', to: '/docs/operations/monitoring-cost-security' },
              { label: 'Contribution Guide', to: '/docs/contributing/docusaurus-and-techdocs' },
            ],
          },
          {
            title: 'Project',
            items: [
              { label: 'Repository', href: 'https://github.com/jaredthivener/backstage-kubernetes-platform' },
              { label: 'Backstage', href: 'https://backstage.io/' },
              { label: 'Docusaurus', href: 'https://docusaurus.io/' },
            ],
          },
        ],
        copyright: `Copyright ${new Date().getFullYear()} Morgan Stanley Kubernetes as a Service Platform`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['yaml', 'bash', 'diff'],
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
    }),
};

module.exports = config;