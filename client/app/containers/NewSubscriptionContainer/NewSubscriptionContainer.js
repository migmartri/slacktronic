// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Select } from 'antd';
import { AVAILABLE_TRIGGERS, AVAILABLE_ACTIONS } from '../../integrations';
import type { actionAttrs } from '../../models/action';
import type { triggerAttrs } from '../../models/trigger';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

type Props = {
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

  handleTriggerSubmit = (event: SyntheticEvent<HTMLButtonElement>): void => {
    console.warn(event);
    event.preventDefault();
  }

  // ProviderTrigger has the format <trigger|action>@<providerName>@<triggerName>
  handleTriggerOrActionChange = (providerTrigger: string): void => {
    const [propType, providerName, type] = providerTrigger.split('@', 3);
    this.setState({
      [propType]: { providerName, type }
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
      </FormItem>
    );
  }

  render() {
    return (
      <Form onSubmit={this.handleTriggerSubmit}>
        { this.triggerForm('trigger', AVAILABLE_TRIGGERS) }
        { this.triggerForm('action', AVAILABLE_ACTIONS) }
        <FormItem>
          <Button type="primary" htmlType="submit" >Next</Button>
        </FormItem>
      </Form>
    );
  }
}

// TODO, connect component
export default connect(null)(NewSubscriptionComponent);
