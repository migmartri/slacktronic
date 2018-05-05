// @flow
import { connect } from 'react-redux';
import HomeComponent from '../../components/HomeComponent';
import configStore from '../../lib/configStore';
import type { Dispatch } from '../../actions/common';
import * as providerActions from '../../actions/providers';
import * as subscriptionActions from '../../actions/subscriptions';

const mapStateToProps = (state) => ({
  slackConfigured: state.slack.token.valid
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onLoad: async () => {
    // Load token from store
    // Validate and store in redux the slack info
    // TODO(miguel) Have a general load info from local storage
    const token = configStore.get('slack.token');
    if (token) {
      dispatch(providerActions.initialize('slack', { token }));
    }

    dispatch(providerActions.initialize('serialCom'));

    dispatch(subscriptionActions.clearSubscriptions());

    let payload = {
      trigger: {
        providerName: 'slack', type: 'away'
      },
      action: {
        providerName: 'serialCom', type: 'message'
      },
      enabled: true
    };

    dispatch(subscriptionActions.craftSubscription(payload));

    payload = {
      trigger: {
        providerName: 'slack', type: 'dm'
      },
      action: {
        providerName: 'serialCom', type: 'message'
      },
      enabled: true
    };

    dispatch(subscriptionActions.craftSubscription(payload));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
