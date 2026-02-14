# Kubernetes Decommission Request

- Cluster Ref: ${{ values.clusterRef }}
- Confirmation Input: ${{ values.confirmClusterName }}
- Drain Workloads: ${{ values.drainWorkloads }}
- Create Backup: ${{ values.createBackup }}
- Backup Retention Days: ${{ values.backupRetentionDays }}
- Deregister DNS: ${{ values.deregisterDns }}
- Deregister from Catalog: ${{ values.deregisterFromCatalog }}

## Justification

${{ values.justification or 'No justification provided.' }}
