// @flow

import type { availableProviderNamesType } from '../integrations';

const ProviderStatus = {
  ready: 'ready',
  error: 'error',
};

type ProviderStatusType = $Keys<typeof ProviderStatus>;

export type providerOptions = { [string]: any };

export type providerType = {
  status: ProviderStatusType,
  name: availableProviderNamesType,
  options?: providerOptions,
  statusMessage?: string
};

export default ProviderStatus;

