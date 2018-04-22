// @flow
import React, { Component } from 'react';
import { Badge, Card, Tag } from 'antd';
import type { subscriptionType } from '../../models/subscription';
import SlacktronicSerialClient from '../../lib/serialClient';
import SLOT_MESSAGES from '../../models/subscription';

type Props = {
  subscription: subscriptionType,
  // eslint-disable-next-line react/no-unused-prop-types
  serialClient: ?SlacktronicSerialClient
};

export default class SubscriptionComponent extends Component<Props> {
  props: Props;

  static communicateActiveState(nextProps: Props) {
    const { subscription, serialClient } = nextProps;

    if (!serialClient || !serialClient.serialPortInstance) return;
    const { serialPortInstance } = serialClient;
    const { slot, active } = subscription;

    const message = SLOT_MESSAGES[slot][active ? 'ON' : 'OFF'];
    console.log(`Sending message ${message} to slot ${slot}`);


    serialPortInstance.write(message, (err) => {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('Message sent');
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    const prevActiveState = this.props.subscription.active;
    const newActiveState = nextProps.subscription.active;
    if (prevActiveState !== newActiveState) {
      SubscriptionComponent.communicateActiveState(nextProps);
    }
  }
  render() {
    const sub = this.props.subscription;
    return (
      <div>
        <Card title={`${sub.assertion.name} on slot ${sub.slot}`}>
          <p>{sub.assertion.description}</p>
          <Badge count={sub.active ? 1 : 0}>
            <Tag color={sub.active ? 'green' : 'blue'}>{sub.active ? 'ON' : 'OFF'}</Tag>
          </Badge>
        </Card>
      </div>
    );
  }
}
