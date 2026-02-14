# Kubernetes Upgrade Request

- Cluster Ref: ${{ values.clusterRef }}
- Cluster Name: ${{ values.clusterName }}
- Target Version: ${{ values.targetVersion }}
- Upgrade Strategy: ${{ values.upgradeStrategy }}
- Maintenance Window: ${{ values.maintenanceWindow }}
- Skip Node Upgrade: ${{ values.skipNodeUpgrade }}
- Platform Approval Required: ${{ values.requirePlatformApproval }}

## Notes

${{ values.additionalNotes or 'No additional notes provided.' }}
