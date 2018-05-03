// @flow

const ProviderStatus = {
  ready: 'ready',
  error: 'error',
};

type ProviderStatusType = $Keys<typeof ProviderStatus>;

export type providerOptions = { [string]: any };
export type supportedProviderName = 'slack' | 'serialCom';

export type providerAttrs = {
  status: ProviderStatusType,
  name: supportedProviderName,
  options?: providerOptions,
  statusMessage?: string
};

export type providerType = {
  ID: string
} & providerAttrs;

export default ProviderStatus;

