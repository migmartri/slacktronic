// @flow
import type { Action } from './common';
import actionTypes from './actionTypes';
import type { supportedProviderName, providerType } from '../models/provider';

export const initialize = (name: supportedProviderName, options: Object = {}): Action => ({
  type: actionTypes.PROVIDER_INITIALIZE,
  name,
  options
});

export const initialized = (data: providerType): Action => ({
  type: actionTypes.PROVIDER_INITIALIZED,
  data
});

export default initialize;