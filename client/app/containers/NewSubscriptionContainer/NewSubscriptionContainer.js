// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Select } from 'antd';
import * as providerActions from '../../actions/providers';
import configStore from '../../lib/configStore';
import { AVAILABLE_TRIGGERS, AVAILABLE_ACTIONS } from '../../integrations';
import type { actionAttrs } from '../../models/action';
import type { triggerAttrs } from '../../models/trigger';
import SlackClient from '../../integrations/slack/client';
import * as subscriptionActions from '../../actions/subscriptions';
import type { craftSubPayload } from '../../actions/subscriptions';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

type Props = {
  slackClient: ?SlackClient,
  onSubCreation: (payload: craftSubPayload) => void
};

type State = {
  trigger: triggerAttrs & { allOptionsAndValues: [] },
  action: actionAttrs & { allOptionsAndValues: [] },
  enabled: boolean
};

class NewSubscriptionComponent extends React.Component<Props, State> {
  props: Props;

  // Required since we interpolate the key
  /* eslint-disable react/no-unused-state */
  state = {
    trigger: {
      providerName: '',
      type: '',
      allOptionsAndValues: []
    },
    action: {
      providerName: '',
      type: '',
      allOptionsAndValues: []
    },
    enabled: true,
  }

  handleSubscriptionSubmit = (event: SyntheticEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    const { trigger, action, enabled } = this.state;
    // TODO(add validation error)
    if (trigger.type === '' || action.type === '') return;
    this.props.onSubCreation({ trigger, action, enabled });
  }

  // ProviderTrigger has the format <trigger|action>@<providerName>@<triggerName>
  handleTriggerOrActionChange = async (providerTrigger: string) => {
    const [propType, providerName, type] = providerTrigger.split('@', 3);
    const values = propType === 'trigger' ? AVAILABLE_TRIGGERS : AVAILABLE_ACTIONS;

    // Set the first value of every option
    const klass = values[providerName][type];
    const options = {};

    // Fetches all the options
    const allOptionsAndValues = await this.loadOptionValues(klass.options);
    allOptionsAndValues.forEach(optAndVal => {
      // eslint-disable-next-line prefer-destructuring
      options[optAndVal.opt.ID] = optAndVal.optionValues[0].value;
    });

    this.setState({
      [propType]: {
        options, providerName, type, allOptionsAndValues
      }
    });
  }

  loadOptionValues = async (options) => {
    const allOptionsAndValues = [];
    // Regular for allows to use await
    for (let i = 0; i < options.length; i += 1) {
      const opt = options[i];
      // eslint-disable-next-line no-await-in-loop
      const optionValues = await opt.values(this.props.slackClient);
      allOptionsAndValues.push({ opt, optionValues });
    }

    return allOptionsAndValues;
  };

  // OptionValue has the format <trigger|action>@<optionID>@<optionValue>
  handleTriggerOrActionOption = (option: string): void => {
    const [propType, optionID, optionValue] = option.split('@', 3);
    this.setState({
      [propType]: {
        ...this.state[propType],
        options: { ...this.state[propType].options, [optionID]: optionValue },
      }
    });
  }

  triggerForm(
    propName: string,
    availableOptions
  ): React.Node {
    return (
      <FormItem label={propName.toUpperCase()} required="true">
        <Select onChange={this.handleTriggerOrActionChange}>
          {
            Object.keys(availableOptions).map(provName => (
              <OptGroup key={provName} label={provName}>
                { Object.keys(availableOptions[provName]).map(opt => {
                  const { metadata } = availableOptions[provName][opt];
                  return <Option key={opt} value={`${propName}@${provName}@${opt}`}>{metadata.name} - { metadata.description}</Option>;
                  })
                }
              </OptGroup>
            ))
          }
        </Select>
        { /* Options */ }
        { propName === 'trigger' && this.triggerOptions() }
      </FormItem>
    );
  }

  triggerOptions(): React.Node {
    const { allOptionsAndValues } = this.state.trigger;
    if (!allOptionsAndValues) return;

    return (
      allOptionsAndValues.filter(optAndVal => optAndVal.opt.controlType === 'select')
        .map(optAndVal => {
          const { opt, optionValues } = optAndVal;
          const current = this.state.trigger.options[opt.ID];
          return (
            <FormItem key={opt.ID} label={opt.ID} required={opt.required}>
              <Select defaultValue={`trigger@${opt.ID}@${current}`} onChange={this.handleTriggerOrActionOption}>
                {
                  optionValues.map(optVal => (
                    <Option key={optVal.value} value={`trigger@${opt.ID}@${optVal.value}`}>{optVal.label}</Option>
                ))
                }
              </Select>
            </FormItem>
          );
        })
    );
  }

  render() {
    return (
      <Form onSubmit={this.handleSubscriptionSubmit}>
        { JSON.stringify(this.state) }
        { this.triggerForm('trigger', AVAILABLE_TRIGGERS) }
        { this.triggerForm('action', AVAILABLE_ACTIONS) }
        <FormItem>
          <Button type="primary" htmlType="submit" >Next</Button>
        </FormItem>
      </Form>
    );
  }
}

// TODO, remove
const mapDispatchToProps = (dispatch: Dispatch) => {
  const token = configStore.get('slack.token');

  if (token) {
    dispatch(providerActions.initialize('slack', { token }));
  }

  return {
    onSubCreation: (payload: craftSubPayload): void => {
      dispatch(subscriptionActions.craftSubscription(payload));
    }
  };
};

const mapStateToProps = (state) => {
  const providersByName = state.providers.byName;
  const { slack: slackProvider } = providersByName;
  if (!slackProvider) return { slackClient: null };
  return {
    slackClient: slackProvider.options.client
  };
};

// TODO, connect component
export default connect(mapStateToProps, mapDispatchToProps)(NewSubscriptionComponent);
