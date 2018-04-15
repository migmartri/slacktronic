// @flow
import actionTypes from './actionTypes';

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

const storeToken = (token: string) => dispatch => {
  dispatch(tokenStoring(token));
  dispatch(tokenStored(token));
};

export default storeToken;
