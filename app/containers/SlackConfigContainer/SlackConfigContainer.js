// @flow
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { notification } from 'antd';
import type { Dispatch } from '../../actions/common';
import storeToken from '../../actions/slack';
import ConfigSimpleComponent from '../../components/SlackConfigSimpleComponent';
import ConfigManualComponent from '../../components/SlackConfigManualComponent';
import SlackClient from '../../lib/slackClient';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onTokenCreate: async (token: string) => {
    // Validate
    const client = await SlackClient.create(token, dispatch);

    if (client.valid) {
      notification.success({
        message: 'Slack account connected',
        description: 'Your Slack account is configured and ready to rock!',
      });
      dispatch(storeToken(token));
      dispatch(push('/'));
    } else {
      notification.error({
        message: 'Invalid token',
        description: 'The provided access token does not seem to be valid.',
      });
    }

    return false;
  },
  onTokenDismiss: () => {
    dispatch(push('/'));
  }
});

type Props = {
  easyOnboarding: boolean
};

const connectedComponent = (props?: Props) => {
  let componentToRender = ConfigManualComponent;

  if (props && props.easyOnboarding) {
    componentToRender = ConfigSimpleComponent;
  }

  return connect(null, mapDispatchToProps)(componentToRender);
};

connectedComponent.defaultProps = {
  easyOnboarding: false,
};

export default connectedComponent;
