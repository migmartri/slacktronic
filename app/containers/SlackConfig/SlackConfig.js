// @flow
import { connect } from 'react-redux';
import { notification } from 'antd';
import type { Dispatch } from '../../actions/common';
import storeToken from '../../actions/slack';
import SlackConfigComponent from '../../components/SlackConfig';
import SlackClient from '../../lib/slackClient';

const mapStateToProps = (state) => ({
  userInfo: state.slack.userInfo
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onTokenCreate: async (token: string) => {
    // Validate
    const client = await SlackClient.create(token, dispatch);

    if (client.valid) {
      dispatch(storeToken(token));
    } else {
      notification.error({
        message: 'Invalid token',
        description: 'The provided access token does not seem to be valid.',
      });
    }

    return false;
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SlackConfigComponent);
