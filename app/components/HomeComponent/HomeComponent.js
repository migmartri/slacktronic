// @flow
import React, { Component } from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import styles from './HomeComponent.scss';

type Props = {};

export default class HomeComponent extends Component<Props> {
  props: Props;
  static slackConfigLink() {
    return (<Link to="/slack-config">Configure</Link>);
  }

  static slackConfigInfo() {
    return (
      <Card className={styles.card} title="1 - Configure Slack" extra={HomeComponent.slackConfigLink()}>
        <p>In order to continue, you need to connect your Slack account first.</p>
      </Card>
    );
  }

  static arduinoConfigInfo() {
    return (
      <Card className={styles.card} title="2 - Configure Arduino" extra={HomeComponent.slackConfigLink()}>
        <p>Next, configure your Arduino board.</p>
      </Card>
    );
  }

  render() {
    return (
      <div className={styles.home}>
        { HomeComponent.slackConfigInfo() }
        { HomeComponent.arduinoConfigInfo() }
      </div>
    );
  }
}
