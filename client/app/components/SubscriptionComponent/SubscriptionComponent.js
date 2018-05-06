// @flow
import * as React from 'react';
import { TimeAgo } from 'react-time-ago';
import TimeAgoJS from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Card, Icon, Row, Col } from 'antd';
import type { subscriptionType } from '../../models/subscription';
import type { actionType } from '../../models/action';
import type { triggerType } from '../../models/trigger';
import styles from './subscription.scss';
import { AVAILABLE_TRIGGERS } from '../../integrations';

TimeAgoJS.locale(en);

type Props = {
  subscription: subscriptionType,
  // eslint-disable-next-line react/no-unused-prop-types
  action: actionType,
  trigger: triggerType
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
    const providerTriggers = AVAILABLE_TRIGGERS[this.props.trigger.providerName];
    const TriggerTypeClass = providerTriggers[this.props.trigger.type];
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
            <li>Trigger: {metadata.name} ({ this.lastPerformInfo })</li>
            <li>Action: Serial Message</li>
            <li>
              Enabled: {sub.enabled ? 'Yes' : 'No'}
            </li>
          </ul>
        </Card>
      </div>
    );
  }
}
