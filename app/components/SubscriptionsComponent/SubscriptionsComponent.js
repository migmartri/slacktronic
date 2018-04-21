// @flow
import React, { Component } from 'react';
import { Icon, Badge, Timeline, Row, Col, Card, Tag } from 'antd';
import SlackClient from '../../lib/slackClient';
import type { eventType } from '../../models/slack';
import type { subscriptionType } from '../../models/subscription';
import styles from './subscriptions.scss';

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

  slackConnectionInfo() {
    if (this.props.slackClient) {
      const { userInfo } = this.props.slackClient;
      return (
        <div>
          <Badge status="success" >
            <Icon type="slack-square" />
          </Badge>
          <span>Connected to user {userInfo.user} from team {userInfo.team}.</span>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <Row className={styles.connectioninfo}>
          <Col span={24}>
            { this.slackConnectionInfo() }
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={18}>
            <Row gutter={16}>
              {
                this.props.subscriptions.map((sub) => (
                  <Col span={12} key={sub.ID}>
                    <Card title={`${sub.assertion.name} on slot ${sub.slot}`}>
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
            <Card>
              <Timeline pending="Waiting for events">
                {
                  this.props.slackEvents.reverse().map((event) => (
                    <Timeline.Item key={event.ID}>
                      <p>{ event.eventInfo.type }</p>
                    </Timeline.Item>
                  ))
                }
              </Timeline>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
