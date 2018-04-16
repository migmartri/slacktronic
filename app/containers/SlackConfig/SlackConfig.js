// @flow
import { connect } from 'react-redux';
import type { Dispatch } from '../../actions/common';
import storeToken from '../../actions/slack';
import SlackConfigComponent from '../../components/SlackConfig';
import SlackClient from '../../lib/slackClient';

const mapStateToProps = (state) => ({
  data: state.slack
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onTokenCreate: async (token: string) => {
    // Validate
    const client = await SlackClient.create(token, dispatch);

    if (client.valid) {
      dispatch(storeToken(token));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SlackConfigComponent);
