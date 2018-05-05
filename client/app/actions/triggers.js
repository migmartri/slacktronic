// @flow
import type { Action } from './common';
import actionTypes from './actionTypes';

export const triggered = (id: string, enabled: boolean): Action => ({
  type: actionTypes.TRIGGER_TRIGGERED,
  id,
  enabled
});

export default triggered;
