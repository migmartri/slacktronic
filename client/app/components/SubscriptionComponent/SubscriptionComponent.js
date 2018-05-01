// @flow
import React, { Component } from 'react';
import { Badge, Card, Icon, Row, Col } from 'antd';
import type { subscriptionType } from '../../models/subscription';
import SlacktronicSerialClient from '../../lib/serialClient';
import styles from './subscription.scss';

type Props = {
  subscription: subscriptionType,
  // eslint-disable-next-line react/no-unused-prop-types
  serialClient: ?SlacktronicSerialClient
};

export default class SubscriptionComponent extends Component<Props> {
  props: Props;

  render() {
    const sub = this.props.subscription;
    return (
      <div>
        <Card>
          <p>{sub.assertion.description}</p>
          <Row className={styles.icons}>
            <Col span={8}><Icon type="slack" /></Col>
            <Col span={8}><Icon type="arrow-right" /></Col>
            <Col span={8}><Icon type="usb" /></Col>
          </Row>
          <ul className={styles.summary}>
            <li>Trigger: {sub.assertion.name}</li>
            <li>Action: Serial message {sub.slot}</li>
            <li>
              <Badge dot count={sub.active ? 1 : 0}>
                Status: {sub.active ? 'ON' : 'OFF'}
              </Badge>
            </li>
          </ul>
        </Card>
      </div>
    );
  }
}
