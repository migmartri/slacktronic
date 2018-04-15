// @flow
import actionTypes from './actionTypes';
import configStore from '../lib/configStore';

type actionType = {
  +type: string
};

const tokenStoring = (token: string): actionType => ({
  type: actionTypes.SLACK_TOKEN_STORING,
  token
});

const tokenStored = (token: string): actionType => ({
  type: actionTypes.SLACK_TOKEN_STORED,
  token
});

// const tokenStoreFailed = (token: string): actionType => ({
//   type: actionTypes.SLACK_TOKEN_STORE_EROR,
//   token
// });

// TODO(miguel) Add error handling
const storeToken = (token: string) => dispatch => {
  dispatch(tokenStoring(token));
  configStore.set('slack', { token, validToken: true });
  dispatch(tokenStored(token));
};

export default storeToken;
