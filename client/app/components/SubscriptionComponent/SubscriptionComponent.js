// @flow
import React, { Component } from 'react';
import { Card, Icon, Row, Col } from 'antd';
import type { subscriptionType } from '../../models/subscription';
import SlacktronicSerialClient from '../../lib/serialClient';
import type { actionType } from '../../models/action';
import type { triggerType } from '../../models/trigger';
import type { providerType } from '../../models/provider';
import styles from './subscription.scss';
import SUPPORTED_TRIGGERS from '../../integrations/slack/triggers/rtm';

type Props = {
  subscription: subscriptionType,
  // eslint-disable-next-line react/no-unused-prop-types
  serialClient: ?SlacktronicSerialClient,
  action: actionType,
  trigger: triggerType,
  providers: providerType[]
};

export default class SubscriptionComponent extends Component<Props> {
  props: Props;

  render() {
    const sub = this.props.subscription;
    const TriggerTypeClass = SUPPORTED_TRIGGERS[this.props.trigger.type];
    const { metadata } = TriggerTypeClass;
    return (
      <div>
        <Card>
          <p>{metadata.description}</p>
          <Row className={styles.icons}>
            <Col span={8}><Icon type="slack" /></Col>
            <Col span={8}><Icon type="arrow-right" /></Col>
            <Col span={8}><Icon type="usb" /></Col>
          </Row>
          <ul className={styles.summary}>
            <li>Trigger: {TriggerTypeClass.name}</li>
            <li>Action: Serial message</li>
            <li>
              Status: {sub.enabled ? 'ON' : 'OFF'}
            </li>
          </ul>
        </Card>
      </div>
    );
  }
}
