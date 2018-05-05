// @flow
import type { Action } from './common';
import actionTypes from './actionTypes';

export const perform = (ID: string, value: string): Action => ({
  type: actionTypes.ACTION_PERFORM,
  ID,
  value
});

export default perform;
