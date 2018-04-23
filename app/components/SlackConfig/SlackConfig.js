// @flow
import React, { Component } from 'react';
import { shell } from 'electron';
import { Link } from 'react-router-dom';
import { Steps, Form, Input, Button } from 'antd';
import styles from './SlackConfig.scss';
import * as slackModels from '../../models/slack';

const { Step } = Steps;
const FormItem = Form.Item;

type Props = {
  onTokenCreate: (string) => void,
  userInfo: slackModels.userInfoType
};

type State = {
  currentStep: number,
  clientID: string,
  clientSecret: string,
  code: string,
  token: string
};

const steps: { title: string }[] = [{
  title: 'Create application',
}, {
  title: 'Authorize application',
}, {
  title: 'Get User token',
}, {
  title: 'Completed!',
}];

class SlackConfig extends Component<Props, State> {
  static openUrl(event: SyntheticEvent<HTMLLinkElement>) {
    event.preventDefault();
    return shell.openExternal(event.currentTarget.href);
  }

  state = {
    currentStep: 0,
    clientID: '',
    clientSecret: '',
    code: '',
    token: ''
  }

  handleChange = (event: SyntheticEvent<HTMLButtonElement>) => {
    const target = event.currentTarget;

    this.setState({ [target.id]: target.value });
  }

  handleStepSubmit = (event: SyntheticEvent<HTMLButtonElement>): void => {
    this.setState({ currentStep: this.state.currentStep + 1 });
    event.preventDefault();
  }

  handleAccessTokenSubmit = (event: SyntheticEvent<HTMLButtonElement>): void => {
    this.props.onTokenCreate(this.state.token);
    event.preventDefault();
  }

  get authorizeUrl(): string {
    return `https://slack.com/oauth/authorize?client_id=${this.state.clientID}&scope=client`;
  }

  get getTokenUrl(): string {
    return `https://slack.com/api/oauth.access?client_id=${this.state.clientID}&client_secret=${this.state.clientSecret}&code=${this.state.code}`;
  }

  get currentStep(): number | null {
    if (this.state.clientID === '' || this.state.clientSecret === '') {
      return 0;
    } else if (!this.state.code) {
      return 1;
    } else if (this.state.code) {
      return 2;
    } return null;
  }

  completedPage() {
    return this.props.userInfo && (
      <div>
        <p>
          Congratulations {this.props.userInfo.user},
          you have connected Slacktronic to the {this.props.userInfo.team} team!
        </p>
        <p>
          <Link to="/">Return to app</Link>
        </p>
      </div>
    );
  }

  onboardingFlow() {
    return (
      <div>
        <Steps size="small" current={this.state.currentStep}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className={styles.stepscontent}>
          { this.state.currentStep === 0 && (
          <div>
            <Form layout="inline" onSubmit={this.handleStepSubmit}>
              <FormItem label="Client ID" required="true">
                <Input type="text" id="clientID" value={this.state.clientID} onChange={this.handleChange} />
              </FormItem>
              <FormItem label="Client Secret" required="true">
                <Input type="password" id="clientSecret" value={this.state.clientSecret} onChange={this.handleChange} />
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" >Next</Button>
              </FormItem>
            </Form>
          </div>
          )}
          { this.state.currentStep === 1 && (
          <div>
            <p>
              <a href={this.authorizeUrl} onClick={SlackConfig.openUrl}>{this.authorizeUrl}</a>
            </p>
            <Form layout="inline" onSubmit={this.handleStepSubmit}>
              <FormItem label="Code" required="true">
                <Input type="text" id="code" value={this.state.code} onChange={this.handleChange} />
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" >Next</Button>
              </FormItem>
            </Form>
          </div>
          )}
          { this.state.currentStep === 2 && (
          <div>
            <p>
              <a href={this.getTokenUrl} onClick={SlackConfig.openUrl}>{this.getTokenUrl}</a>
            </p>
            <Form layout="inline" onSubmit={this.handleAccessTokenSubmit}>
              <FormItem label="User Access Token" required="true">
                <Input type="password" id="token" value={this.state.token} onChange={this.handleChange} />
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">Finish</Button>
              </FormItem>
            </Form>
          </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      this.userInfo ? this.completedPage() : this.onboardingFlow()
    );
  }
}

export default SlackConfig;
