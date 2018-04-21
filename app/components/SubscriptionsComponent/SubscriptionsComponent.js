// @flow
import React, { Component } from 'react';
import { Badge, Timeline, Row, Col, Card, Tag } from 'antd';
import SlackClient from '../../lib/slackClient';
import type { eventType } from '../../models/slack';
import type { subscriptionType } from '../../models/subscription';

type Props = {
  slackClient: ?SlackClient,
  slackEvents: eventType[],
  subscriptions: subscriptionType[]
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
      <div>
        <Row gutter={16}>
          <Col span={18}>
            <Row gutter={16}>
              {
                this.props.subscriptions.map((sub) => (
                  <Col span={12}>
                    <Card key={sub.ID} title={`${sub.assertion.name} on slot ${sub.slot}`}>
                      <p>{sub.assertion.description}</p>
                      <Badge count={sub.active ? 1 : 0}>
                        <Tag color={sub.active ? 'green' : 'blue'}>{sub.active ? 'ON' : 'OFF'}</Tag>
                      </Badge>
                    </Card>
                  </Col>
                ))
              }
            </Row>
          </Col>
          <Col span={6}>
            <Timeline pending="Waiting for events">
              {
                this.props.slackEvents.reverse().map((event) => (
                  <Timeline.Item key={event.ID}>
                    <p>{ event.eventInfo.type }</p>
                  </Timeline.Item>
                ))
              }
            </Timeline>
          </Col>
        </Row>
      </div>
    );
  }
}
