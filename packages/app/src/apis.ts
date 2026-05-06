import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  alertApiRef,
  configApiRef,
  createApiFactory,
} from '@backstage/core-plugin-api';
import { toastApiRef } from '@backstage/frontend-plugin-api';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
  createApiFactory({
    api: toastApiRef,
    deps: { alertApi: alertApiRef },
    factory: ({ alertApi }) => ({
      post(toast) {
        const severity =
          toast.status === 'danger'
            ? ('error' as const)
            : toast.status === 'warning'
            ? ('warning' as const)
            : toast.status === 'success'
            ? ('success' as const)
            : ('info' as const);
        alertApi.post({
          message: String(toast.title),
          severity,
          display: 'transient',
        });
        return { close: () => {} };
      },
    }),
  }),
];
