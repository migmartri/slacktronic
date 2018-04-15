// @flow
import type { Dispatch } from './common';
import actionTypes from './actionTypes';
import configStore from '../lib/configStore';


type StoringTokenAction = {
  type: actionTypes.SLACK_TOKEN_STORING,
  token: string
};

type TokenStoredAction = {
  type: actionTypes.SLACK_TOKEN_STORED,
  token: string
};

export type SlackAction =
  | StoringTokenAction
  | TokenStoredAction;

const tokenStoring = (token: string): StoringTokenAction => ({
  type: actionTypes.SLACK_TOKEN_STORING,
  token
});

const tokenStored = (token: string): TokenStoredAction => ({
  type: actionTypes.SLACK_TOKEN_STORED,
  token
});

// const tokenStoreFailed = (token: string): actionType => ({
//   type: actionTypes.SLACK_TOKEN_STORE_EROR,
//   token
// });

// TODO(miguel) Add error handling
const storeToken = (token: string) => (dispatch: Dispatch): void => {
  dispatch(tokenStoring(token));
  configStore.set('slack', { token, validToken: true });
  dispatch(tokenStored(token));
};

export default storeToken;
