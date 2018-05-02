// @flow
import shortID from 'shortid';
import type { Dispatch, Action, ThunkAction } from './common';
import actionTypes from './actionTypes';
import configStore from '../lib/configStore';
import type { userInfoType } from '../models/slack';
import type { subscriptionType } from '../models/subscription';
import * as subscriptionActions from './subscriptions';

// Token store
const tokenStoring = (token: string): Action => ({
  type: actionTypes.SLACK_TOKEN_STORING,
  token
});

const tokenStored = (token: string): Action => ({
  type: actionTypes.SLACK_TOKEN_STORED,
  token
});

// TODO(miguel) Add error handling
const storeToken = (token: string) => (dispatch: Dispatch): void => {
  dispatch(tokenStoring(token));
  configStore.set('slack', { token, validToken: true });
  dispatch(tokenStored(token));
};

// Token Validation
export const tokenValidating = (token: string): Action => ({
  type: actionTypes.SLACK_TOKEN_VALIDATING,
  token
});

export const tokenValidationOK = (token: string): Action => ({
  type: actionTypes.SLACK_TOKEN_VALIDATION_OK,
  token
});

export const tokenValidationKO = (token: string): Action => ({
  type: actionTypes.SLACK_TOKEN_VALIDATION_KO,
  token
});

// User info fetch
export const userInfoFetching = (): Action => ({
  type: actionTypes.SLACK_USER_INFO_FETCHING
});

export const userInfoFetched = (userInfo: userInfoType): Action => ({
  type: actionTypes.SLACK_USER_INFO_FETCH_OK,
  userInfo
});

export const userInfoFetchError = (): Action => ({
  type: actionTypes.SLACK_USER_INFO_FETCH_KO
});

export const slackClientInitialize = (token: string): Action => ({
  type: actionTypes.SLACK_CLIENT_INITIALIZE,
  token
});

// Slack RTM event
export const slackEvent = (data: any): Action => ({
  type: actionTypes.SLACK_EVENT,
  data: { ID: shortID.generate(), ...data }
});

// Receives an Slack event and decides how it affects to
// the list of subscriptions
// TODO. Move inside the saga
export const processSlackEvent = (event: any): ThunkAction => (
  (dispatch, getState) => {
    // TODO(miguel) Remove action creator below and replace by trigger saga
    // $FlowFixMe
    const subsByID = getState().subscriptions.byID;
    const subscriptions: subscriptionType[] = Object.keys(subsByID).map(k => subsByID[k]);

    subscriptions.forEach(sub => {
      const { shouldTrigger, triggerValue } = sub.assertion;
      if (shouldTrigger(event)) {
        dispatch(subscriptionActions.subscriptionStatusChange(sub, triggerValue(event)));
      }
    });
  }
);

export default storeToken;
