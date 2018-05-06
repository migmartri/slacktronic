// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Select } from 'antd';
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

  // ProviderTrigger has the format <providerName>@<triggerName>
  handleTriggerChange = (providerTrigger: string): void => {
    const [providerName, type] = providerTrigger.split('@', 2);
    this.setState({
      trigger: { providerName, type }
    });
  }

  triggerForm(): React.Node {
    const { trigger } = this.state;
    return (
      <Form onSubmit={this.handleTriggerSubmit}>
        <FormItem label="Trigger" required="true">
          <Select onChange={this.handleTriggerChange}>
            {
              Object.keys(AVAILABLE_TRIGGERS).map(provName => (
                <OptGroup key={provName} label={provName}>
                  { Object.keys(AVAILABLE_TRIGGERS[provName]).map(triggerName => {
                    const metadata = AVAILABLE_TRIGGERS[provName][triggerName].metadata;
                    return <Option key={triggerName} value={`${provName}@${triggerName}`}>{metadata.name} - { metadata.description}</Option>
                    })
                  }
                </OptGroup>
              ))
            }
          </Select>
          <p>{ this.state.selectedTriggerInfo }</p>
        </FormItem>
        <FormItem label="Trigger name" required="true">
          <Input type="text" id="type" value={trigger.type} />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" >Next</Button>
        </FormItem>
      </Form>
    );
  }

  render() {
    console.warn(AVAILABLE_TRIGGERS, AVAILABLE_ACTIONS);
    return (
      this.triggerForm()
    );
  }
}

// let payload = {
//  trigger: {
//    providerName: AVAILABLE_PROVIDERS.slack, type: 'away'
//  },
//  action: {
//    providerName: AVAILABLE_PROVIDERS.serialCom, type: 'message', options: { char: 'a' }
//  },
//  enabled: true
// }

// TODO, connect component
export default connect(null)(NewSubscriptionComponent);
