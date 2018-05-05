// @flow
import type { Action } from './common';
import actionTypes from './actionTypes';

export const triggered = (ID: string, enabled: boolean): Action => ({
  type: actionTypes.TRIGGER_TRIGGERED,
  ID,
  enabled
});

export default triggered;
