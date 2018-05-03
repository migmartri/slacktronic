// @flow
import { connect } from 'react-redux';
import HomeComponent from '../../components/HomeComponent';
import SerialClient from '../../lib/serialClient';
import configStore from '../../lib/configStore';
import type { Dispatch } from '../../actions/common';
import * as providerActions from '../../actions/providers';

const mapStateToProps = (state) => ({
  slackConfigured: state.slack.token.valid
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onLoad: async () => {
    // Load token from store
    // Validate and store in redux the slack info
    // TODO(miguel) Have a general load info from local storage
    const token = configStore.get('slack.token');
    if (token) {
      // dispatch(slackClientInitialize(token));
      dispatch(providerActions.initialize('slack', { token }));
      // dispatch(providerActions.initialize('serialCom'));
    }

    // TODO, move to saga similarly to Slack
    SerialClient.connect(dispatch);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
