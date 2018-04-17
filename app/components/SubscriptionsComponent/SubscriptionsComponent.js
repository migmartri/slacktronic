// @flow
import React, { Component } from 'react';
import SlackClient from '../../lib/slackClient';

type Props = {
  slackClient?: ?SlackClient
};

type State = {
  slackSyncInitialized: boolean
};


export default class SubscriptionsComponent extends Component<Props, State> {
  props: Props;
  static defaultProps = {
    slackClient: null
  }

  // TODO(miguel) This will be based on some user settings
  static initializeSlackSubscriptions(slackClient: SlackClient): void {
    const { rtmClient } = slackClient;
    rtmClient.start();

    rtmClient.on('message', (event) => {
      console.warn('message', event);
    });

    // We subscribe to the current User
    rtmClient.subscribePresence([slackClient.userInfo.userID]);

    rtmClient.on('presence_change', (event) => {
      console.warn('presence_change', event);
    });
  }


  state = {
    slackSyncInitialized: false,
  }

  componentWillReceiveProps(nextProps: Props) {
    // Initialize RTM only once
    if (nextProps.slackClient && !this.state.slackSyncInitialized) {
      SubscriptionsComponent.initializeSlackSubscriptions(nextProps.slackClient);
      this.setState({ slackSyncInitialized: true });
    }
  }

  render() {
    return (
      <h2>This will show the list of subscriptions</h2>
    );
  }
}
