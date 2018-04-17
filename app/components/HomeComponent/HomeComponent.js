// @flow
import React, { Component } from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import styles from './HomeComponent.scss';
import SubscriptionsContainer from '../../containers/SubscriptionsContainer';

type Props = {
  slackConfigured: boolean
};

class HomeComponent extends Component<Props> {
  static defaultProps = {
    slackConfigured: false
  }

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

  render() {
    return (
      <div className={styles.home}>
        { !this.props.slackConfigured && HomeComponent.slackConfigInfo() }
        { this.props.slackConfigured && <SubscriptionsContainer /> }
      </div>
    );
  }
}

export default HomeComponent;
