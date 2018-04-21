// @flow
import type { Dispatch, Action, ThunkAction } from './common';
import actionTypes from './actionTypes';
import configStore from '../lib/configStore';
import type SlackClient from '../lib/slackClient';
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

// Client creation
export const slackClientCreating = (): Action => ({
  type: actionTypes.SLACK_CLIENT_CREATING
});

export const slackClientCreated = (client: SlackClient): Action => ({
  type: actionTypes.SLACK_CLIENT_CREATED,
  client
});

// Slack RTM event
export const slackEvent = (data: any): Action => ({
  type: actionTypes.SLACK_EVENT,
  eventInfo: data
});

// Receives an Slack event and decides how it affects to
// the list of subscriptions
export const processSlackEvent = (event: any): ThunkAction => (
  (dispatch, getState) => {
    dispatch(slackEvent(event));
    // eslint-disable-next-line prefer-destructuring
    const subsByID = getState().subscriptions.byID;
    const subscriptions: subscriptionType[] = Object.keys(subsByID).map(k => subsByID[k]);

    subscriptions.forEach(sub => {
      const { assertable, assert } = sub.assertion;
      if (assertable(event.type)) {
        dispatch(subscriptionActions.subscriptionStatusChange(sub.ID, assert(event)));
      }
    });
  }
);

export default storeToken;
