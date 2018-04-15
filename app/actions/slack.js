// @flow
import type { Dispatch, Action } from './common';
import actionTypes from './actionTypes';
import configStore from '../lib/configStore';


const tokenStoring = (token: string): Action => ({
  type: actionTypes.SLACK_TOKEN_STORING,
  token
});

const tokenStored = (token: string): Action => ({
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
