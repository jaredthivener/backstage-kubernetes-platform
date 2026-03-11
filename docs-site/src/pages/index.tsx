import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const journeyCards = [
  {
    title: 'Understand the platform',
    copy: 'See how Backstage, Cluster API, ArgoCD, and cloud providers fit together in the KaaS operating model.',
    href: '/docs/reference/platform-architecture',
  },
  {
    title: 'Ship your first cluster change',
    copy: 'Follow the developer workflow from local setup to a cluster provisioning or Day 2 operation request.',
    href: '/docs/getting-started/first-cluster-workflow',
  },
  {
    title: 'Navigate the repo fast',
    copy: 'Use the repository map to find templates, catalog data, frontend surfaces, and GitOps examples without guesswork.',
    href: '/docs/reference/repository-map',
  },
];

const productAreas = [
  'Cluster inventory across AKS, EKS, and GKE',
  'Self-service scaffolder templates for Day 1 and Day 2 operations',
  'GitOps repository conventions and ArgoCD reconciliation model',
  'Monitoring, security, cost, DORA, support, and add-on management',
];

const signals = [
  { label: 'Clouds covered', value: '3', detail: 'Azure, AWS, GCP' },
  { label: 'Primary workflows', value: '6', detail: 'Provision, scale, upgrade, destroy, namespace, add-ons' },
  { label: 'App surfaces', value: '10+', detail: 'Clusters, docs, tools, support, AI, monitoring, cost, security' },
];

const heroCapabilities = ['Workflows', 'Architecture', 'Templates', 'GitOps', 'Operations'];

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const kubernetesImageUrl = useBaseUrl('/img/kubernetes.svg');

  return (
    <Layout
      title={siteConfig.title}
      description="Developer-first documentation for the Backstage Kubernetes platform"
    >
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div className={styles.heroBackdrop} />
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>Morgan Stanley Kubernetes as a Service</p>
              <Heading as="h1" className={styles.heroTitle}>
                The developer guide for a Backstage-powered Kubernetes platform.
              </Heading>
              <p className={styles.heroText}>
                Learn how the product is structured, how the workflows map to GitOps, and where to make the right
                changes in the repo without hunting through the codebase first.
              </p>
              <div className={styles.heroCapabilityRow}>
                {heroCapabilities.map(capability => (
                  <span key={capability} className={styles.heroCapabilityPill}>{capability}</span>
                ))}
              </div>
              <div className={styles.heroActions}>
                <Link className={clsx('button button--primary button--lg', styles.primaryButton)} to="/docs/intro">
                  Start with the platform overview
                </Link>
                <Link className={clsx('button button--secondary button--lg', styles.secondaryButton)} to="/docs/getting-started/local-development">
                  Run the docs locally
                </Link>
              </div>
            </div>
            <div className={styles.heroPanel}>
              <div className={styles.panelBody}>
                <div className={styles.heroArtFrame}>
                  <div className={styles.heroArtHalo} />
                  <img className={styles.heroArt} src={kubernetesImageUrl} alt="Kubernetes" />
                </div>
                <div className={styles.badgeRow}>
                  <span>Backstage</span>
                  <span>GitOps</span>
                  <span>Cluster API</span>
                </div>
                <div className={styles.heroMiniGrid}>
                  {productAreas.map(area => (
                    <div key={area} className={styles.heroMiniCard}>
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.signalStrip}>
          {signals.map(signal => (
            <article key={signal.label} className={styles.signalCard}>
              <p className={styles.signalLabel}>{signal.label}</p>
              <p className={styles.signalValue}>{signal.value}</p>
              <p className={styles.signalDetail}>{signal.detail}</p>
            </article>
          ))}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>Documentation journeys</p>
            <Heading as="h2">Start from your task, not from a folder tree.</Heading>
          </div>
          <div className={styles.cardGrid}>
            {journeyCards.map(card => (
              <Link key={card.title} className={styles.journeyCard} to={card.href}>
                <p className={styles.cardKicker}>Recommended path</p>
                <Heading as="h3" className={styles.cardTitle}>
                  {card.title}
                </Heading>
                <p className={styles.cardCopy}>{card.copy}</p>
                <span className={styles.cardLink}>Open guide</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={clsx(styles.section, styles.whySection)}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>Why this exists</p>
            <Heading as="h2">The repo already contains strong building blocks. This site makes them legible.</Heading>
          </div>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <Heading as="h3">Product-aware information architecture</Heading>
              <p>
                The navigation mirrors the actual product surface in the Backstage app: clusters, workflows,
                docs, tools, support, security, monitoring, cost, and GitOps-backed templates.
              </p>
            </div>
            <div className={styles.whyCard}>
              <Heading as="h3">Developer-first reference paths</Heading>
              <p>
                Repo structure, templates, and deployment flow are documented as operating assets, not marketing
                content. That makes the site useful during implementation, onboarding, and review.
              </p>
            </div>
            <div className={styles.whyCard}>
              <Heading as="h3">Designed to publish on GitHub Pages</Heading>
              <p>
                The site is isolated from the Backstage runtime, versionable in this repo, and deployable from
                `main` through a dedicated Pages workflow.
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}