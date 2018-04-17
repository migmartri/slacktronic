// @flow
import type { Dispatch, Action } from './common';
import actionTypes, { slackEventsActions } from './actionTypes';
import configStore from '../lib/configStore';
import type SlackClient from '../lib/slackClient';
import type { userInfoType } from '../reducers/slack';

// Token store
const tokenStoring = (token: string): Action => ({
  type: actionTypes.SLACK_TOKEN_STORING,
  token
});

const tokenStored = (token: string): Action => ({
  type: actionTypes.SLACK_TOKEN_STORED,
  token
});

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

// Supported RTM API events actions
export const slackRTMPresenceChange = (presence: string, user: string): Action => ({
  type: slackEventsActions.PRESENCE_CHANGE,
  eventInfo: { presence, user }
});

export const slackRTMMessage = (channel: string, user: string): Action => ({
  type: slackEventsActions.MESSAGE,
  eventInfo: { channel, user }
});

// TODO(miguel) Add error handling
const storeToken = (token: string) => (dispatch: Dispatch): void => {
  dispatch(tokenStoring(token));
  configStore.set('slack', { token, validToken: true });
  dispatch(tokenStored(token));
};

export default storeToken;
