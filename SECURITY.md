# Security & Testing Guide

This document defines a practical, repeatable security workflow for this Backstage monorepo.

## Goals

- Keep dependencies current and reduce known CVEs.
- Catch insecure coding patterns early (SAST).
- Validate running app behavior (DAST) before release.
- Make security checks part of normal development and TDD loops.

---

## Quick Start (Local)

Run from repo root.

### 1) Type safety and unit tests (quality gate)

```bash
yarn tsc
yarn workspace app test --watch=false --runInBand
```

### 2) SAST (Semgrep)

```bash
docker run --rm -v "$PWD":/src semgrep/semgrep \
  semgrep --config p/owasp-top-ten --config p/typescript /src --error
```

### 3) SCA (OSV Scanner)

Install once on macOS:

```bash
brew install osv-scanner
```

Scan:

```bash
osv-scanner scan source -r . --experimental-exclude node_modules
```

Note: `osv-scanner` returns a non-zero exit code when vulnerabilities are found.

### 4) SCA/Misconfig/Secrets (Trivy)

```bash
docker run --rm -v "$PWD":/src aquasec/trivy:latest fs \
  --scanners vuln,misconfig,secret \
  --severity HIGH,CRITICAL \
  --skip-dirs /src/node_modules \
  /src
```

Note: Trivy returns a non-zero exit code when findings match your configured severity threshold.

### 5) Secrets (Gitleaks)

```bash
docker run --rm -v "$PWD":/src zricethezav/gitleaks:latest \
  detect --source=/src --redact --no-git
```

---

## DAST (OWASP ZAP Baseline)

1. Start app/backend in separate terminals.
2. Scan frontend and backend URLs.

```bash
# frontend
HOST=0.0.0.0 yarn workspace app start

# backend
HOST=0.0.0.0 yarn workspace backend start
```

Optional preflight checks before running ZAP:

```bash
curl -I http://localhost:3000
curl -I http://localhost:7007

docker run --rm curlimages/curl:8.10.1 -s -o /dev/null -w "%{http_code}\n" http://host.docker.internal:3000
docker run --rm curlimages/curl:8.10.1 -s -o /dev/null -w "%{http_code}\n" http://host.docker.internal:7007
```

Then:

```bash
docker run --rm -v "$PWD":/zap/wrk ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t http://host.docker.internal:3000 -m 5 -r zap-frontend.html

docker run --rm -v "$PWD":/zap/wrk ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t http://host.docker.internal:7007 -m 5 -r zap-backend.html
```

If Docker networking differs in your environment, replace `host.docker.internal` with a reachable host/IP.
Also ensure ports are free (`EADDRINUSE` means another process already owns the port).

---

## TDD + Security Hygiene Workflow

For each feature/fix:

1. Write/update tests first (or at least define expected behavior).
2. Implement minimal change.
3. Run:
   - `yarn tsc`
   - relevant tests
   - Semgrep scan for touched code
4. Before merge, run full SCA + secrets + (if applicable) DAST.
5. If findings are introduced:
   - fix immediately, or
   - document risk and mitigation with owner + due date.

---

## Backstage Dependency Upgrades

Use Backstage tooling to stay current:

```bash
yarn backstage-cli versions:bump --release main
```

Review template changes:

- https://backstage.github.io/upgrade-helper/

Re-run all scans after upgrade.

---

## Known Tooling Notes (This Repo)

- `yarn npm audit --all --recursive` may fail under some Yarn 4 setups.
  - Prefer OSV + Trivy for reliable SCA.
- `yarn dlx semgrep@latest` can fail due to binary resolution.
  - Prefer Docker-based Semgrep command above.
- `osv-scanner` CLI flags differ by version.
  - `--experimental-exclude node_modules` works for this repo.

---

## Temporary Risk Mitigation Pattern (Example)

If a transitive package has a known CVE and upstream has not yet released a fix,
use a temporary `resolutions` entry in root `package.json`, then validate:

1. Add resolution.
2. `yarn install`
3. `yarn why <package>` to confirm override.
4. Run compile/tests/scans.
5. Roll back if any regression appears.

Example used successfully in this repo:

```json
"resolutions": {
  "tar": "7.5.7"
}
```

---

## Recommended Merge Gates

A PR should not merge unless:

- TypeScript build passes.
- Relevant tests pass.
- Semgrep has no new HIGH-confidence issues.
- Trivy/OSV show no new HIGH/CRITICAL vulnerabilities (or explicit approved exception).
- No secrets detected by Gitleaks.

---

## Incident Response (If a New Critical Vulnerability Appears)

1. Identify affected package(s):

```bash
yarn why <package-name>
```

2. Patch/override to fixed version.
3. Rebuild and re-run full scan suite.
4. Create follow-up task to remove temporary overrides once upstream catches up.

---

## Ownership

- Security checks are owned by all contributors.
- Final release approval requires security scan evidence in CI/logs.
