// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Button, Select, Input, Divider } from 'antd';
import { AVAILABLE_TRIGGERS, AVAILABLE_ACTIONS } from '../../integrations';
import type { actionAttrs } from '../../models/action';
import type { triggerAttrs } from '../../models/trigger';
import SlackClient from '../../integrations/slack/client';
import * as subscriptionActions from '../../actions/subscriptions';
import type { craftSubPayload } from '../../actions/subscriptions';
import styles from './newSubscription.scss';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

type Props = {
  slackClient: ?SlackClient,
  onSubCreation: (payload: craftSubPayload) => void
};

type State = {
  allOptionsAndValues: { [string]: Object[] },
  trigger: triggerAttrs,
  action: actionAttrs,
  enabled: boolean
};

class NewSubscriptionComponent extends React.Component<Props, State> {
  props: Props;

  // Required since we interpolate the key
  /* eslint-disable react/no-unused-state */
  state = {
    allOptionsAndValues: {
      trigger: [],
      action: []
    },
    trigger: {
      providerName: '',
      options: {},
      type: '',
    },
    action: {
      providerName: '',
      options: {},
      type: '',
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
      const { optionValues } = optAndVal;
      options[optAndVal.opt.ID] = optionValues ? optionValues[0] : { value: '' };
    });

    this.setState({
      allOptionsAndValues: { ...this.state.allOptionsAndValues, [propType]: allOptionsAndValues },
      [propType]: {
        options, providerName, type
      }
    });
  }

  loadOptionValues = async (options) => {
    const allOptionsAndValues = [];
    // Regular for allows to use await
    for (let i = 0; i < options.length; i += 1) {
      const opt = options[i];
      // The configuration option might not contain options.
      if (!opt.values) {
        allOptionsAndValues.push({ opt });
        break;
      }
      // eslint-disable-next-line no-await-in-loop
      const optionValues = await opt.values(this.props.slackClient);
      allOptionsAndValues.push({ opt, optionValues });
    }

    return allOptionsAndValues;
  };

  // OptionValue has the format <trigger|action>@<optionID>@<optionValue>
  handleTriggerOrActionOption = (option: string): void => {
    const [propType, optionID, optionValue] = option.split('@', 3);
    // Find the option associated with the selection to add it including the label
    const allOptions = this.state.allOptionsAndValues[propType];
    const currentOptionAndValues = allOptions.find(optAndVal => optAndVal.opt.ID === optionID);
    if (!currentOptionAndValues) return;

    const opt = currentOptionAndValues.optionValues
      .find(valAndLabel => valAndLabel.value === optionValue);

    this.setState({
      [propType]: {
        ...this.state[propType],
        options: { ...this.state[propType].options, [optionID]: opt },
      }
    });
  }

  handleTriggerOrActionOptionInputChange = (optionValue, propType, optionID: string): void => {
    this.setState({
      [propType]: {
        ...this.state[propType],
        options: { ...this.state[propType].options, [optionID]: { value: optionValue } },
      }
    });
  }

  triggerForm(
    propName: string,
    availableOptions
  ): React.Node {
    return (
      <FormItem required="true">
        <Divider orientation="left">{propName.toUpperCase()}</Divider>
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
        <div className={styles['trigger-action-options']}>
          { /* Options */ }
          { propName === 'trigger' && this.triggerOrActionOptions(propName, this.state.trigger, this.state.allOptionsAndValues[propName]) }
          { propName === 'action' && this.triggerOrActionOptions(propName, this.state.action, this.state.allOptionsAndValues[propName]) }
        </div>
      </FormItem>
    );
  }

  triggerOrActionOptions(type, triggerOrAction, allOptionsAndValues): React.Node {
    const { options } = triggerOrAction;
    if (!allOptionsAndValues) return;
    return (
      <div>
        { this.selectOptions(type, options, allOptionsAndValues) }
        { this.inputOptions(type, options, allOptionsAndValues) }
      </div>
    );
  }

  selectOptions(type, options, allOptionsAndValues): React.node {
    return allOptionsAndValues.filter(optAndVal => optAndVal.opt.controlType === 'select')
      .map(optAndVal => {
        const { opt, optionValues } = optAndVal;
        const current = options[opt.ID].value;
        return (
          <FormItem key={opt.ID} label={opt.label || opt.ID} required={opt.required} >
            <Select defaultValue={`${type}@${opt.ID}@${current}`} onChange={this.handleTriggerOrActionOption}>
              {
                optionValues.map(optVal => (
                  <Option key={optVal.value} value={`${type}@${opt.ID}@${optVal.value}`}>{optVal.label}</Option>
              ))
              }
            </Select>
          </FormItem>
        );
      });
  }

  inputOptions(type, options, allOptionsAndValues): React.node {
    return allOptionsAndValues.filter(optAndVal => optAndVal.opt.controlType === 'input')
      .map(optAndVal => {
        const { opt } = optAndVal;
        const c = (e) => this.handleTriggerOrActionOptionInputChange(e.target.value, type, opt.ID);
        return (
          <FormItem key={opt.ID} label={opt.label || opt.ID} required={opt.required}>
            <Input
              placeholder={opt.placeholder}
              triggeroraction={type}
              optionid={opt.ID}
              onChange={c}
            />
          </FormItem>
        );
      });
  }

  render() {
    return (
      <Form onSubmit={this.handleSubscriptionSubmit}>
        { this.triggerForm('trigger', AVAILABLE_TRIGGERS) }
        { this.triggerForm('action', AVAILABLE_ACTIONS) }
        <Button type="primary" htmlType="submit" >Save</Button>
        <Link to={{ pathname: '/', state: { skipInit: true } }} style={{ marginLeft: 8 }}><Button>Cancel</Button></Link>
      </Form>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => (
  {
    onSubCreation: (payload: craftSubPayload): void => {
      dispatch(subscriptionActions.craftSubscription(payload));
    }
  }
);

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
