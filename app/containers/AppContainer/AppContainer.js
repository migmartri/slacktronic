// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import SlackClient from '../../lib/slackClient';
import configStore from '../../lib/configStore';
import type { Dispatch } from '../../actions/common';
import { createSubscription } from '../../actions/subscriptions';
import Away from '../../models/SubscriptionTypes/Away';
import DirectMessage from '../../models/SubscriptionTypes/DirectMessage';

type Props = {
  children: React.Node,
  onLoad: () => void
};

class AppComponent extends React.Component<Props> {
  props: Props;

  async componentDidMount() {
    this.props.onLoad();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onLoad: async () => {
    // Load token from store
    // Validate and store in redux the slack info
    // TODO(miguel) Have a general load info from local storage
    const token = configStore.get('slack.token');
    if (token) {
      await SlackClient.create(token, dispatch);
    }

    // Initialize a set of hardcoded subscriptions
    dispatch(createSubscription({
      slot: 'A', active: false, assertion: new Away()
    }));

    dispatch(createSubscription({
      slot: 'B', active: false, assertion: new DirectMessage()
    }));
  }
});

export default connect(null, mapDispatchToProps)(AppComponent);
