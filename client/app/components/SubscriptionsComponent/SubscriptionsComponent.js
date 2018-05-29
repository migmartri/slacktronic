// @flow
import React, { Component } from 'react';
import { Divider, Icon, Badge, Timeline, Row, Col, Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import type { serialPortType } from '../../integrations/serialCom/client';
import type { eventType, userInfoType } from '../../models/slack';
import type { subscriptionType } from '../../models/subscription';
import styles from './subscriptions.scss';
import SubscriptionContainer from '../../containers/SubscriptionContainer';
import MessagesTimelineContainer from '../../containers/MessagesTimelineContainer';

type Props = {
  slackUserInfo: ?userInfoType,
  serialPort: ?serialPortType,
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

  slackConnectionInfo() {
    if (this.props.slackUserInfo) {
      const { slackUserInfo } = this.props;
      return (
        <div>
          <Badge status="success" >
            <Icon type="slack-square" />
          </Badge>
          <span>Connected to user {slackUserInfo.user} from team {slackUserInfo.team}</span>
        </div>
      );
    }
  }

  serialConnectionInfo() {
    if (this.props.serialPort) {
      if (this.props.serialPort) {
        const { manufacturer, comName } = this.props.serialPort;
        return (
          <div>
            <Badge status="success" >
              <Icon type="usb" />
            </Badge>
            <span>{manufacturer} connected to port {comName}</span>
          </div>
        );
      }
    }
  }

  render() {
    return (
      <div>
        <Row className={styles.connectioninfo}>
          <Col span={12}>
            { this.slackConnectionInfo() }
          </Col>
          <Col span={12} className={styles.serialinfo}>
            { this.serialConnectionInfo() }
          </Col>
        </Row>
        <Divider />
        <Row className={styles.newsubscription}>
          <Col>
            <Button type="primary"><Link to="/subscriptions/new">Add Subscription</Link></Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={16}>
            <Row>
              {
                this.props.subscriptions.map((sub) => (
                  <Col key={sub.ID} className={styles.subscription}>
                    <SubscriptionContainer subscriptionID={sub.ID} />
                  </Col>
                ))
              }
              { !this.props.subscriptions.length &&
                <div style={{ textAlign: 'center' }}>
                  You do not have any subscription yet.
                  Click <Link to="/subscriptions/new">here</Link> to create one.
                </div> }
            </Row>
          </Col>
          <Col span={8} className={styles.sidebar}>
            <Card className={styles.timeline}>
              <p>Serial messages</p>
              <MessagesTimelineContainer />
            </Card>
            <Card className={styles.timeline}>
              <p>Slack events</p>
              <Timeline pending="Waiting for events">
                {
                  this.props.slackEvents.reverse().map((event) => (
                    <Timeline.Item key={event.ID}>
                      <p>{ event.type }</p>
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
