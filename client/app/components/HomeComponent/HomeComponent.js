// @flow
import React, { Component } from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import styles from './HomeComponent.scss';
import SubscriptionsContainer from '../../containers/SubscriptionsContainer';
import LoadingPageWrapper from '../LoadingWrapperComponent';
import type { AppInitializationStatus } from '../../reducers/app';

type Props = {
  slackConfigured: boolean,
  appInitializationStatus: AppInitializationStatus,
  onLoad: (boolean) => void,
  location: { state?: { skipInit: boolean }}
};

class HomeComponent extends Component<Props> {
  static defaultProps = {
    slackConfigured: false,
  };

  static slackConfigLink() {
    // /slack-config-manual will load a manual onboarding
    return (<Link to="/slack-config">Configure</Link>);
  }

  static slackConfigInfo() {
    return (
      <Card className="{styles.card} configure-slack" title="1 - Configure Slack" extra={this.slackConfigLink()}>
        <p>In order to continue, first, you need to associate your Slack account.</p>
      </Card>
    );
  }

  componentDidMount() {
    const { state } = this.props.location;
    const skipInit = !!(state && state.skipInit);
    this.props.onLoad(skipInit);
  }

  render() {
    return (
      <div className={styles.home}>
        <LoadingPageWrapper loaded={this.props.appInitializationStatus === 'finished'}>
          { !this.props.slackConfigured && HomeComponent.slackConfigInfo() }
          { this.props.slackConfigured && <SubscriptionsContainer /> }
        </LoadingPageWrapper>
      </div>
    );
  }
}

export default HomeComponent;
