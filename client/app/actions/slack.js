// @flow
import shortID from 'shortid';
import type { Action } from './common';
import actionTypes from './actionTypes';

// Slack RTM event
export const slackEvent = (data: any): Action => ({
  type: actionTypes.SLACK_EVENT,
  data: { ID: shortID.generate(), ...data }
});

export default slackEvent;
