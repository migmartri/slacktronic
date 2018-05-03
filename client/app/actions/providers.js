// @flow
import shortID from 'shortid';
import type { Action } from './common';
import actionTypes from './actionTypes';
import type { supportedProviderName, providerAttrs } from '../models/provider';

export const initialize = (name: supportedProviderName, options: Object = {}): Action => ({
  type: actionTypes.PROVIDER_INITIALIZE,
  name,
  options
});

export const initialized = (data: providerAttrs): Action => ({
  type: actionTypes.PROVIDER_INITIALIZED,
  data: {
    ...data,
    ID: shortID.generate()
  }
});

export default initialize;
