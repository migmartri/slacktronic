// @flow
import React, { Component } from 'react';
import { shell } from 'electron';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

type Props = {
  onTokenCreate: (string) => void,
  onTokenDismiss: () => void
};

type State = {
  token: string
};

class SlackConfig extends Component<Props, State> {
  static openUrl(event: SyntheticEvent<HTMLLinkElement>) {
    event.preventDefault();
    return shell.openExternal(event.currentTarget.href);
  }

  state = {
    token: '',
  }

  handleChange = (event: SyntheticEvent<HTMLButtonElement>) => {
    const target = event.currentTarget;

    this.setState({ [target.id]: target.value });
  }

  handleAccessTokenSubmit = (event: SyntheticEvent<HTMLButtonElement>): void => {
    this.props.onTokenCreate(this.state.token);
    event.preventDefault();
  }

  handleAccessTokenDismiss = (event: SyntheticEvent<HTMLButtonElement>): void => {
    this.props.onTokenDismiss();
    event.preventDefault();
  }


  render() {
    return (
      <Modal
        title="Configure Slack"
        visible
        onOk={this.handleAccessTokenSubmit}
        onCancel={this.handleAccessTokenDismiss}
      >
        <p>In order to connect your account, click on the following button and paste below
          the access token that you will retrieve.
        </p>
        <p>
          <a onClick={SlackConfig.openUrl} href="https://slacktronic.io/oauth/auth">
            <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
          </a>
        </p>
        <Form onSubmit={this.handleAccessTokenSubmit}>
          <FormItem label="User Access Token" required="true">
            <Input type="password" id="token" value={this.state.token} onChange={this.handleChange} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default SlackConfig;
