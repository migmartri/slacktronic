import { take, call, put } from 'redux-saga/effects';
import SlackClient from '../../lib/slackClient';
import actionTypes from '../../actions/actionTypes';
import * as providersActions from '../../actions/providers';
import * as slackActions from '../../actions/slack';

function* initializeAndValidateClient(token: string) {
  try {
    const client = new SlackClient(token);

    yield put(slackActions.tokenValidating(token));

    const authInfo = yield call(client.webClient.auth.test);

    client.userInfo = {
      team: authInfo.team, teamID: authInfo.team_id, user: authInfo.user, userID: authInfo.user_id
    };

    yield put(slackActions.userInfoFetched(client.userInfo));
    yield put(slackActions.tokenValidationOK(token));
    return client;
  } catch (err) {
    yield put(slackActions.userInfoFetchError());
    yield put(slackActions.tokenValidationKO(token));
    throw err;
  }
}


function* clientInitializationFlow() {
  while (true) {
    const providerAction = yield take(actionTypes.PROVIDER_INITIALIZE);
    const { name } = providerAction;
    const { token } = providerAction.options;

    if (name !== 'slack') return;

    console.log('initializing the slack provider');
    const client = yield call(initializeAndValidateClient, token);
    return client;
  }
}
function* init() {
  const client = yield call(clientInitializationFlow);

  const data = {
    options: { client },
    status: 'ready',
    name: 'slack',
  };

  yield put(providersActions.initialized(data));
}

export default init;
