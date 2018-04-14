// @flow
import React, { Component } from 'react';
import { shell } from 'electron';
import { RTMClient, WebClient } from '@slack/client';
import { Link } from 'react-router-dom';
import { Steps, Form, Input, Button } from 'antd';
import styles from './SlackConfig.scss';

const { Step } = Steps;
const FormItem = Form.Item;
const { TextArea } = Input;

type Props = {};

const steps = [{
  title: 'Create application',
}, {
  title: 'Authorize application',
}, {
  title: 'Get User token',
}, {
  title: 'Completed!',
}];

export default class SlackConfig extends Component<Props> {
  static openUrl(e) {
    e.preventDefault();
    return shell.openExternal(e.target.href);
  }

  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      clientID: '',
      clientSecret: '',
      code: '',
      token: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleStepSubmit = this.handleStepSubmit.bind(this);
  }

  componentDidMount() {
    console.warn('mounted');
    // From the user
    // const tokenUser = \
    const rtm = new RTMClient(this.state.token);
    const web = new WebClient(this.state.token);

    rtm.start();

    web.users.list()
      .then(res => console.log('Message sent: ', res))
      .catch(console.error);

    rtm.on('message', (event) => {
      console.warn('message', event);
    });

    rtm.subscribePresence(['UA7M7BMB8']);

    rtm.on('presence_change', (event) => {
      console.warn('presence_change', event);
    });

    rtm.on('manual_presence_change', (event) => {
      console.warn('manual_presence_change', event);
    });
  }

  handleChange({ target }) {
    this.setState({ [target.id]: target.value });
  }

  handleStepSubmit() {
    this.setState({ currentStep: this.state.currentStep + 1 });
  }

  get authorizeUrl() {
    return `https://slack.com/oauth/authorize?client_id=${this.state.clientID}&scope=client`;
  }

  get getTokenUrl() {
    return `https://slack.com/api/oauth.access?client_id=${this.state.clientID}&client_secret=${this.state.clientSecret}&code=${this.state.code}`;
  }

  get currentStep() {
    if (this.state.clientID === '' || this.state.clientSecret === '') {
      return 0;
    } else if (!this.state.code) {
      return 1;
    } else if (this.state.code) {
      return 2;
    } return null;
  }

  render() {
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
            <Form layout="inline" onSubmit={this.handleStepSubmit}>
              <FormItem label="User Token" required="true">
                <TextArea rows="4" id="token" value={this.state.token} onChange={this.handleChange} />
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">Finish</Button>
              </FormItem>
            </Form>
          </div>
          )}
          { this.state.currentStep === 3 && (
          <p>
            Setup completed, hello [USER!!] [avatar here]<br />
            <Link to="/">Return to app</Link>
          </p>
          )}
        </div>
      </div>
    );
  }
}
