// @flow
import type { Action } from './common';
import actionTypes from './actionTypes';

export const perform = (ID: string, enabled: boolean, debounceTime: number): Action => ({
  type: actionTypes.ACTION_PERFORM,
  data: {
    ID,
    enabled,
    debounceTime
  }
});

export default perform;
