// @flow
import { connect } from 'react-redux';
import HomeComponent from '../../components/HomeComponent';
import SlackClient from '../../lib/slackClient';
import SerialClient from '../../lib/serialClient';
import configStore from '../../lib/configStore';
import type { Dispatch } from '../../actions/common';
import { createSubscription, clearSubscriptions } from '../../actions/subscriptions';
import Away from '../../models/SubscriptionTypes/Away';
import Mention from '../../models/SubscriptionTypes/Mention';
import DirectMessage from '../../models/SubscriptionTypes/DirectMessage';

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
      const client = await SlackClient.create(token, dispatch);
      // Initialize a set of hardcoded subscriptions
      dispatch(clearSubscriptions());

      dispatch(createSubscription({
        slot: 'A', active: false, assertion: new Away()
      }));

      dispatch(createSubscription({
        slot: 'B', active: false, assertion: new DirectMessage(client.userInfo.userID)
      }));

      dispatch(createSubscription({
        slot: 'C', active: false, assertion: new Mention(client.userInfo.userID)
      }));
    }

    SerialClient.connect(dispatch);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
