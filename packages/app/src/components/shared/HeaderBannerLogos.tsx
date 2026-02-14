import React from 'react';

// ---------------------------------------------------------------------------
// OSS Tool Logos — official icons from CNCF artwork repo + vendor icons
// Served from /logos/ in the public directory
// ---------------------------------------------------------------------------
const ossLogos = [
  { src: '/logos/istio.svg', name: 'Istio' },
  { src: '/logos/argo.svg', name: 'ArgoCD' },
  { src: '/logos/cilium.svg', name: 'Cilium' },
  { src: '/logos/prometheus.svg', name: 'Prometheus' },
  { src: '/logos/grafana.svg', name: 'Grafana' },
  { src: '/logos/opa.svg', name: 'Open Policy Agent' },
  { src: '/logos/opentelemetry.svg', name: 'OpenTelemetry' },
  { src: '/logos/fluentd.svg', name: 'Fluentd' },
  { src: '/logos/keda.svg', name: 'KEDA' },
  { src: '/logos/jaeger.svg', name: 'Jaeger' },
];

// ---------------------------------------------------------------------------
// Each "layout" is a different creative arrangement of the 10 logos.
// Pages pick a layout by name so every banner feels unique.
// ---------------------------------------------------------------------------
type LogoPlacement = {
  left: string;
  top: number;
  size: number;
  rotate: number;
  opacity: number;
};

const layouts: Record<string, LogoPlacement[]> = {
  // Dashboard — wide spread, large watermarks
  dashboard: [
    { left: '2%',  top: -20, size: 120, rotate: 12,  opacity: 0.10 },
    { left: '12%', top: 8,   size: 88,  rotate: -8,  opacity: 0.13 },
    { left: '24%', top: 30,  size: 78,  rotate: 15,  opacity: 0.11 },
    { left: '35%', top: -12, size: 96,  rotate: -6,  opacity: 0.12 },
    { left: '47%', top: 18,  size: 72,  rotate: 22,  opacity: 0.14 },
    { left: '57%', top: -8,  size: 80,  rotate: -18, opacity: 0.11 },
    { left: '67%', top: 14,  size: 92,  rotate: 7,   opacity: 0.13 },
    { left: '77%', top: -18, size: 76,  rotate: -14, opacity: 0.12 },
    { left: '86%', top: 10,  size: 84,  rotate: 10,  opacity: 0.14 },
    { left: '95%', top: -15, size: 110, rotate: -20, opacity: 0.10 },
  ],

  // Clusters — staggered diagonals, bigger center
  clusters: [
    { left: '3%',  top: -10, size: 90,  rotate: -15, opacity: 0.12 },
    { left: '14%', top: 22,  size: 70,  rotate: 10,  opacity: 0.11 },
    { left: '25%', top: -16, size: 100, rotate: -5,  opacity: 0.13 },
    { left: '36%', top: 12,  size: 76,  rotate: 18,  opacity: 0.10 },
    { left: '46%', top: -6,  size: 115, rotate: -3,  opacity: 0.14 },
    { left: '56%', top: 26,  size: 68,  rotate: 20,  opacity: 0.11 },
    { left: '66%', top: -22, size: 84,  rotate: -12, opacity: 0.12 },
    { left: '78%', top: 6,   size: 94,  rotate: 8,   opacity: 0.13 },
    { left: '88%', top: -14, size: 72,  rotate: -22, opacity: 0.10 },
    { left: '96%', top: 16,  size: 105, rotate: 14,  opacity: 0.12 },
  ],

  // Monitoring — wave pattern, medium opaque
  monitoring: [
    { left: '1%',  top: 14,  size: 82,  rotate: 8,   opacity: 0.13 },
    { left: '11%', top: -18, size: 96,  rotate: -14, opacity: 0.11 },
    { left: '22%', top: 20,  size: 70,  rotate: 12,  opacity: 0.14 },
    { left: '33%', top: -8,  size: 88,  rotate: -20, opacity: 0.10 },
    { left: '44%', top: 24,  size: 74,  rotate: 6,   opacity: 0.13 },
    { left: '55%', top: -14, size: 100, rotate: -10, opacity: 0.12 },
    { left: '65%', top: 18,  size: 78,  rotate: 16,  opacity: 0.11 },
    { left: '75%', top: -20, size: 86,  rotate: -8,  opacity: 0.14 },
    { left: '85%', top: 12,  size: 92,  rotate: 24,  opacity: 0.10 },
    { left: '94%', top: -6,  size: 80,  rotate: -16, opacity: 0.12 },
  ],

  // Security — clustered right, sparse left
  security: [
    { left: '5%',  top: -12, size: 72,  rotate: -10, opacity: 0.09 },
    { left: '18%', top: 18,  size: 66,  rotate: 14,  opacity: 0.08 },
    { left: '32%', top: -6,  size: 78,  rotate: -4,  opacity: 0.10 },
    { left: '48%', top: 10,  size: 86,  rotate: 18,  opacity: 0.12 },
    { left: '56%', top: -18, size: 96,  rotate: -8,  opacity: 0.13 },
    { left: '64%', top: 22,  size: 80,  rotate: 12,  opacity: 0.14 },
    { left: '72%', top: -10, size: 110, rotate: -16, opacity: 0.11 },
    { left: '80%', top: 14,  size: 90,  rotate: 6,   opacity: 0.13 },
    { left: '89%', top: -22, size: 100, rotate: -22, opacity: 0.12 },
    { left: '97%', top: 8,   size: 118, rotate: 10,  opacity: 0.10 },
  ],

  // Cost — even spacing, uniform size
  cost: [
    { left: '4%',  top: -8,  size: 84,  rotate: 6,   opacity: 0.11 },
    { left: '14%', top: 16,  size: 80,  rotate: -12, opacity: 0.12 },
    { left: '24%', top: -14, size: 86,  rotate: 18,  opacity: 0.10 },
    { left: '34%', top: 10,  size: 82,  rotate: -6,  opacity: 0.13 },
    { left: '44%', top: -4,  size: 88,  rotate: 14,  opacity: 0.11 },
    { left: '54%', top: 20,  size: 78,  rotate: -16, opacity: 0.14 },
    { left: '64%', top: -10, size: 84,  rotate: 10,  opacity: 0.12 },
    { left: '74%', top: 14,  size: 82,  rotate: -8,  opacity: 0.10 },
    { left: '84%', top: -16, size: 86,  rotate: 20,  opacity: 0.13 },
    { left: '94%', top: 8,   size: 80,  rotate: -14, opacity: 0.11 },
  ],

  // Docs — floating diagonally, gentle rotations
  docs: [
    { left: '0%',  top: 6,   size: 100, rotate: -4,  opacity: 0.12 },
    { left: '10%', top: -14, size: 74,  rotate: 8,   opacity: 0.10 },
    { left: '21%', top: 20,  size: 90,  rotate: -10, opacity: 0.13 },
    { left: '32%', top: -4,  size: 68,  rotate: 16,  opacity: 0.11 },
    { left: '43%', top: 12,  size: 80,  rotate: -6,  opacity: 0.14 },
    { left: '54%', top: -18, size: 94,  rotate: 12,  opacity: 0.10 },
    { left: '63%', top: 24,  size: 72,  rotate: -18, opacity: 0.12 },
    { left: '73%', top: -8,  size: 86,  rotate: 4,   opacity: 0.13 },
    { left: '83%', top: 16,  size: 78,  rotate: -14, opacity: 0.11 },
    { left: '93%', top: -12, size: 96,  rotate: 20,  opacity: 0.10 },
  ],

  // Support — reverse order, bottom-heavy
  support: [
    { left: '96%', top: 18,  size: 104, rotate: -10, opacity: 0.11 },
    { left: '86%', top: -16, size: 76,  rotate: 14,  opacity: 0.13 },
    { left: '76%', top: 22,  size: 88,  rotate: -6,  opacity: 0.10 },
    { left: '66%', top: -4,  size: 72,  rotate: 20,  opacity: 0.12 },
    { left: '54%', top: 16,  size: 98,  rotate: -12, opacity: 0.14 },
    { left: '44%', top: -20, size: 80,  rotate: 8,   opacity: 0.11 },
    { left: '34%', top: 10,  size: 92,  rotate: -18, opacity: 0.13 },
    { left: '22%', top: -8,  size: 70,  rotate: 22,  opacity: 0.10 },
    { left: '12%', top: 20,  size: 84,  rotate: -4,  opacity: 0.12 },
    { left: '2%',  top: -12, size: 108, rotate: 16,  opacity: 0.11 },
  ],

  // Search — minimal, far apart, ghostly
  search: [
    { left: '5%',  top: -6,  size: 70,  rotate: 4,   opacity: 0.08 },
    { left: '16%', top: 14,  size: 64,  rotate: -10, opacity: 0.07 },
    { left: '28%', top: -12, size: 72,  rotate: 16,  opacity: 0.09 },
    { left: '38%', top: 8,   size: 66,  rotate: -6,  opacity: 0.08 },
    { left: '48%', top: -4,  size: 78,  rotate: 12,  opacity: 0.10 },
    { left: '58%', top: 18,  size: 60,  rotate: -14, opacity: 0.07 },
    { left: '68%', top: -10, size: 74,  rotate: 8,   opacity: 0.09 },
    { left: '78%', top: 12,  size: 68,  rotate: -18, opacity: 0.08 },
    { left: '88%', top: -8,  size: 76,  rotate: 14,  opacity: 0.10 },
    { left: '97%', top: 6,   size: 62,  rotate: -8,  opacity: 0.07 },
  ],

  // ClusterDetail — big corners, small middle
  clusterDetail: [
    { left: '0%',  top: -18, size: 130, rotate: 15,  opacity: 0.10 },
    { left: '10%', top: 20,  size: 70,  rotate: -8,  opacity: 0.11 },
    { left: '22%', top: -4,  size: 60,  rotate: 12,  opacity: 0.09 },
    { left: '34%', top: 14,  size: 56,  rotate: -16, opacity: 0.08 },
    { left: '46%', top: -8,  size: 64,  rotate: 6,   opacity: 0.10 },
    { left: '56%', top: 10,  size: 58,  rotate: -10, opacity: 0.09 },
    { left: '66%', top: -12, size: 62,  rotate: 14,  opacity: 0.08 },
    { left: '76%', top: 18,  size: 68,  rotate: -6,  opacity: 0.11 },
    { left: '88%', top: -10, size: 74,  rotate: 10,  opacity: 0.10 },
    { left: '96%', top: -20, size: 124, rotate: -18, opacity: 0.10 },
  ],
};

// ---------------------------------------------------------------------------
// Shared component that renders scattered logos across a Header's subtitle
// Usage: <Header subtitle={<HeaderBannerLogos layout="dashboard" text="…" />} />
// ---------------------------------------------------------------------------
export const HeaderBannerLogos = ({
  layout,
  text,
  children,
}: {
  layout: keyof typeof layouts;
  text?: string;
  children?: React.ReactNode;
}) => {
  const placements = layouts[layout] || layouts.dashboard;

  return (
    <span>
      {children || text}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {ossLogos.map((logo, i) => {
          const cfg = placements[i];
          return (
            <img
              key={logo.name}
              src={logo.src}
              alt=""
              style={{
                position: 'absolute',
                left: cfg.left,
                top: cfg.top,
                height: cfg.size,
                width: cfg.size,
                opacity: cfg.opacity,
                transform: `rotate(${cfg.rotate}deg)`,
                filter: 'brightness(2.5) saturate(0.4)',
              }}
            />
          );
        })}
      </span>
    </span>
  );
};
