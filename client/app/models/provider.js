// @flow

const ProviderStatus = {
  ready: 'ready',
  error: 'error',
};

type ProviderStatusType = $Keys<typeof ProviderStatus>;

export type providerOptions = { [string]: any };
export type supportedProviderName = 'slack' | 'serialCom';

export type providerType = {
  status: ProviderStatusType,
  name: supportedProviderName,
  options?: providerOptions,
  statusMessage?: string
};

export default ProviderStatus;

