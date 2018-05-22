// @flow
import { connect } from 'react-redux';
import HomeComponent from '../../components/HomeComponent';
import configStore from '../../lib/configStore';
import type { Dispatch } from '../../actions/common';
import * as providerActions from '../../actions/providers';
import actionTypes from '../../actions/actionTypes';
import { AVAILABLE_PROVIDERS } from '../../integrations';

const mapStateToProps = (state) => {
  const providersByName = state.providers.byName;
  const { slack: slackProvider } = providersByName;
  return {
    slackConfigured: slackProvider && slackProvider.status === 'ready'
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onLoad: () => {
    // Load token from store
    // Validate and store in redux the slack info
    // TODO(miguel) Have a general load info from local storage
    const token = configStore.get('slack.token');
    if (token) {
      dispatch(providerActions.initialize(AVAILABLE_PROVIDERS.slack, { token }));
    }

    dispatch(providerActions.initialize(AVAILABLE_PROVIDERS.serialCom));
    dispatch({ type: actionTypes.STORE_SNAPSHOT_RETRIEVE });

    // dispatch(subscriptionActions.clearSubscriptions());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
