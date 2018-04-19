// @flow
import React, { Component } from 'react';
import { Timeline } from 'antd';
import SlackClient from '../../lib/slackClient';
import type { eventType } from '../../models/slack';

type Props = {
  slackClient: ?SlackClient,
  slackEvents: eventType[]
};

type State = {
  slackSyncInitialized: boolean
};

export default class SubscriptionsComponent extends Component<Props, State> {
  props: Props;
  static defaultProps = {
    slackEvents: []
  }

  state = {
    slackSyncInitialized: false,
  }

  componentWillReceiveProps(nextProps: Props) {
    // Initialize RTM only once
    if (nextProps.slackClient && !this.state.slackSyncInitialized) {
      nextProps.slackClient.initializeSlackSubscriptions();
      this.setState({ slackSyncInitialized: true });
    }
  }

  render() {
    return (
      <Timeline pending="Waiting for events">
        {
          this.props.slackEvents.reverse().map((event) => (
            <Timeline.Item key={event.id}>
              <p>{ event.eventInfo.type }</p><p>{ JSON.stringify(event.eventInfo) }</p>
            </Timeline.Item>
          ))
        }
      </Timeline>
    );
  }
}
