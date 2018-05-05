// @flow
import * as React from 'react';
import { TimeAgo } from 'react-time-ago';
import TimeAgoJS from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Card, Icon, Row, Col } from 'antd';
import type { subscriptionType } from '../../models/subscription';
import SlacktronicSerialClient from '../../lib/serialClient';
import type { actionType } from '../../models/action';
import type { triggerType } from '../../models/trigger';
import type { providerType } from '../../models/provider';
import styles from './subscription.scss';
import SUPPORTED_TRIGGERS from '../../integrations/slack/triggers/rtm';

TimeAgoJS.locale(en);

type Props = {
  subscription: subscriptionType,
  // eslint-disable-next-line react/no-unused-prop-types
  serialClient: ?SlacktronicSerialClient,
  action: actionType,
  trigger: triggerType,
  providers: providerType[]
};

export default class SubscriptionComponent extends React.Component<Props> {
  props: Props;

  get lastPerformInfo(): React.Node {
    const { lastPerform } = this.props.trigger;
    if (!lastPerform) return 'No triggered yet';

    const lastTriggeredAt = lastPerform.triggeredAt;
    const enabled = lastPerform.enabled ? 'ON' : 'OFF';

    return <span>{enabled} <TimeAgo>{lastTriggeredAt}</TimeAgo></span>;
  }

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
            <li>Trigger: {TriggerTypeClass.name} ({ this.lastPerformInfo })</li>
            <li>Action: Serial Message</li>
            <li>
              Enabled: {sub.enabled ? 'ON' : 'OFF'}
            </li>
          </ul>
        </Card>
      </div>
    );
  }
}
