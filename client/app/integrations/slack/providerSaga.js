import { take, call, put } from 'redux-saga/effects';
import SlackClient from './client';
import actionTypes from '../../actions/actionTypes';
import * as providersActions from '../../actions/providers';
import { AVAILABLE_PROVIDERS } from '../';

function* initializeAndValidateClient(token: string) {
  try {
    const client = new SlackClient(token);

    const authInfo = yield call(client.webClient.auth.test);

    client.userInfo = {
      team: authInfo.team, teamID: authInfo.team_id, user: authInfo.user, userID: authInfo.user_id
    };

    return client;
  } catch (err) {
    throw err;
  }
}


function* clientInitializationFlow() {
  while (true) {
    const providerAction = yield take(actionTypes.PROVIDER_INITIALIZE);
    const { name } = providerAction;
    const { token } = providerAction.options;

    if (name !== AVAILABLE_PROVIDERS.slack) continue;

    try {
      const client = yield call(initializeAndValidateClient, token);
      const data = {
        options: { client },
        status: 'ready',
        name: AVAILABLE_PROVIDERS.slack,
      };

      yield put(providersActions.initialized(data));
    } catch (err) {
      yield put(providersActions.initializationError(name, err));
    }
  }
}

export default clientInitializationFlow;
