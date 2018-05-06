// @flow
import type { Action } from './common';
import actionTypes from './actionTypes';
import type { providerType } from '../models/provider';
import type { availableProviderNamesType } from '../integrations';

export const initialize = (name: availableProviderNamesType, options: Object = {}): Action => ({
  type: actionTypes.PROVIDER_INITIALIZE,
  name,
  options
});

export const initialized = (data: providerType): Action => ({
  type: actionTypes.PROVIDER_INITIALIZED,
  data
});

export const initializationError = (name: availableProviderNamesType, err: Error): Action => ({
  type: actionTypes.PROVIDER_INITIALIZATION_ERROR,
  data: {
    name, err
  }
});

export default initialize;
