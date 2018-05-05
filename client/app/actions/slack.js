// @flow
import shortID from 'shortid';
import type { Action } from './common';
import actionTypes from './actionTypes';
import configStore from '../lib/configStore';

// Token store
// TODO(miguel) Add error handling
const storeToken = (token: string) => (): void => {
  configStore.set('slack', { token, validToken: true });
};

// Slack RTM event
export const slackEvent = (data: any): Action => ({
  type: actionTypes.SLACK_EVENT,
  data: { ID: shortID.generate(), ...data }
});

export default storeToken;
