// @flow
import * as React from 'react';
import { TimeAgo } from 'react-time-ago';
import TimeAgoJS from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { Icon, Card, Divider, Switch } from 'antd';
import type { subscriptionType } from '../../models/subscription';
import type { triggerOptionsTypes, optionsValuesType } from '../../integrations/base';
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
  onDelete: (subscriptionType) => void,
  onManualTrigger: (trigger: triggerType, checked: boolean) => void
};

export default class SubscriptionComponent extends React.Component<Props> {
  props: Props;

  triggerSubscriptionChange = (checked: boolean) => {
    this.props.onManualTrigger(this.props.trigger, checked);
  }

  get lastPerformInfo(): React.Node {
    const { lastPerform } = this.props.trigger;

    const res = [
      <span key="switch" title="Manually trigger the subscription">
        <Switch
          checked={lastPerform && lastPerform.enabled}
          onChange={this.triggerSubscriptionChange}
        />
      </span>
    ];
    /* eslint-disable function-paren-newline */
    if (lastPerform) {
      res.push(
        <span key="time"> - triggered <TimeAgo>{lastPerform.triggeredAt}</TimeAgo></span>
      );
    }

    return <p>{res}</p>;
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

  triggerOrActionOptions = (options: ?optionsValuesType, optionsDef: triggerOptionsTypes) => {
    if (!options) return;

    const visibleOptions = Object.keys(options).filter(key => {
      const def = optionsDef.find(od => od.ID === key);
      return !def || def.controlType !== 'hidden';
    });

    return (
      visibleOptions.map(key => {
        const def = optionsDef.find(od => od.ID === key);
        if (!def || !options) return '';
        return (
          <p key={key}>
            {def.label || def.ID}: &quot;{options[key].label || options[key].value}&quot;
          </p>
        );
      })
    );
  }

  render() {
    const { metadata: triggerMetadata, options: triggerOptions } = this.triggerKlass;
    const { metadata: actionMetadata, options: actionOptions } = this.actionKlass;
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
          <Divider orientation="left">Trigger: {triggerMetadata.description}</Divider>
          { this.lastPerformInfo }
          { this.triggerOrActionOptions(this.props.trigger.options, triggerOptions) }
          <Divider orientation="left">Action: {actionMetadata.name}</Divider>
          { this.triggerOrActionOptions(this.props.action.options, actionOptions) }
        </Card>
      </div>
    );
  }
}
