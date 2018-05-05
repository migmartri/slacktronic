// @flow
import shortID from 'shortid';
import type { Dispatch, Action } from './common';
import actionTypes from './actionTypes';
import configStore from '../lib/configStore';
import type { userInfoType } from '../models/slack';

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

// Slack RTM event
export const slackEvent = (data: any): Action => ({
  type: actionTypes.SLACK_EVENT,
  data: { ID: shortID.generate(), ...data }
});

export default storeToken;
