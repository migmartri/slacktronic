// @flow
import type { Action } from './common';
import actionTypes from './actionTypes';
import type { triggerPerformType } from '../models/trigger';

export const triggered = (ID: string, enabled: boolean): Action => {
  const lastPerform: triggerPerformType = {
    triggeredAt: new Date(),
    enabled
  };

  return {
    type: actionTypes.TRIGGER_TRIGGERED,
    data: {
      ID,
      lastPerform
    }
  };
};

export default triggered;
