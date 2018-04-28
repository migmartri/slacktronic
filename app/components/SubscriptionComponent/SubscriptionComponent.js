// @flow
import React, { Component } from 'react';
import { Badge, Card, Tag } from 'antd';
import type { subscriptionType } from '../../models/subscription';
import SlacktronicSerialClient from '../../lib/serialClient';

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
        <Card title={sub.assertion.name}>
          <p>{sub.assertion.description}</p>
          <Tag>Slot: {sub.slot}</Tag>
          <Badge count={sub.active ? 1 : 0}>
            <Tag color={sub.active ? 'green' : 'blue'}>Status: {sub.active ? 'ON' : 'OFF'}</Tag>
          </Badge>
        </Card>
      </div>
    );
  }
}
