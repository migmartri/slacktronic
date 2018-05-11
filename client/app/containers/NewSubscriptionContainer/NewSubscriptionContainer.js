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

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

type Props = {
  slackClient: ?SlackClient
};

type State = {
  trigger: triggerAttrs,
  action: actionAttrs,
  enabled: boolean
};

class NewSubscriptionComponent extends React.Component<Props, State> {
  props: Props;

  // Required since we interpolate the key
  /* eslint-disable react/no-unused-state */
  state = {
    trigger: {
      providerName: '',
      type: ''
    },
    action: {
      providerName: '',
      type: ''
    },
    enabled: true
  }

  handleSubscriptionSubmit = (event: SyntheticEvent<HTMLButtonElement>): void => {
    console.warn(event);
    event.preventDefault();
  }

  // ProviderTrigger has the format <trigger|action>@<providerName>@<triggerName>
  handleTriggerOrActionChange = (providerTrigger: string): void => {
    const [propType, providerName, type] = providerTrigger.split('@', 3);
    const values = propType === 'trigger' ? AVAILABLE_TRIGGERS : AVAILABLE_ACTIONS;
    const klass = values[providerName][type];
    this.setState({
      [propType]: { providerName, type, klass }
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
    const { klass: triggerKlass } = this.state.trigger;
    if (!triggerKlass || !triggerKlass.options) return;
    const { options: availableOptions } = triggerKlass;

    return (
      availableOptions.map(opt => {
        const values = opt.values(this.props.slackClient);
        return (
          <FormItem label={opt.ID} required={opt.required}>
            <Select defaultValue={values[0]} onChange={this.handleTriggerOrActionChange}>
              {
                values.map(optVal => (
                  <Option key={optVal} value={optVal}>{optVal}</Option>
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
        { this.triggerForm('trigger', AVAILABLE_TRIGGERS) }
        { this.triggerForm('action', AVAILABLE_ACTIONS)  }
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
  return {};
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