// @flow
import * as React from 'react';
import { TimeAgo } from 'react-time-ago';
import TimeAgoJS from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Card, Divider } from 'antd';
import type { subscriptionType } from '../../models/subscription';
import type { actionType } from '../../models/action';
import type { triggerType } from '../../models/trigger';
import styles from './subscription.scss';
import { AVAILABLE_TRIGGERS, AVAILABLE_ACTIONS } from '../../integrations';
import TriggerOrAction from '../../integrations/base';

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

  get triggerKlass(): TriggerOrAction.constructor {
    const { trigger } = this.props;
    const providerTriggers = AVAILABLE_TRIGGERS[trigger.providerName];
    return providerTriggers[trigger.type];
  }

  get actionKlass(): TriggerOrAction.constructor {
    const { action } = this.props;
    const providerActions = AVAILABLE_ACTIONS[action.providerName];
    return providerActions[action.type];
  }

  render() {
    const sub = this.props.subscription;
    const { metadata: triggerMetadata } = this.triggerKlass;
    const { metadata: actionMetadata } = this.actionKlass;
    return (
      <div>
        <Card>
          {triggerMetadata.description}
          <Divider orientation="left">Trigger</Divider>
          <p>
            {triggerMetadata.description} ({ this.lastPerformInfo })
          </p>
          <Divider orientation="left">Action</Divider>
          <p>
            {actionMetadata.description}
            <br />{ JSON.stringify(this.props.action.options) }
          </p>
          <Divider />
          Subscription enabled: {sub.enabled ? 'Yes' : 'No'}
        </Card>
      </div>
    );
  }
}
