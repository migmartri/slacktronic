// @flow
import * as React from 'react';
import { TimeAgo } from 'react-time-ago';
import TimeAgoJS from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Icon, Card, Divider } from 'antd';
import type { subscriptionType } from '../../models/subscription';
import type { actionType } from '../../models/action';
import type { triggerType } from '../../models/trigger';
import styles from './subscription.scss';
import { AVAILABLE_TRIGGERS, AVAILABLE_ACTIONS } from '../../integrations';
import TriggerOrAction from '../../integrations/base';

TimeAgoJS.locale(en);

type Props = {
  subscription: subscriptionType,
  action: actionType,
  trigger: triggerType,
  onDelete: (subscriptionType) => void
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

  deleteSubscription = () => {
    this.props.onDelete(this.props.subscription);
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

  triggerOrActionOptions = (actionOrTrigger: actionType | triggerType) => {
    const { options } = actionOrTrigger;
    if (!options) return;

    return (
      Object.keys(options).map(key => (
        <p key={key}>{options[key].label}</p>
      ))
    );
  }

  render() {
    const { metadata: triggerMetadata } = this.triggerKlass;
    const { metadata: actionMetadata } = this.actionKlass;
    return (
      <div>
        <Card>
          <div className={styles.actions}>
            <a
              onClick={this.deleteSubscription}
              onKeyPress={this.deleteSubscription}
              tabIndex="0"
              role="link"
              title="Delete subscription"
            >
              <Icon type="delete" />
            </a>
          </div>
          <Divider orientation="left">Trigger: {triggerMetadata.name}</Divider>
          <p>
            {triggerMetadata.description} ({ this.lastPerformInfo })
          </p>
          <Divider orientation="left">Action: {actionMetadata.name}</Divider>
          { this.triggerOrActionOptions(this.props.action) }
        </Card>
      </div>
    );
  }
}
