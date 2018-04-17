// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import SlackClient from '../../lib/slackClient';
import configStore from '../../lib/configStore';
import type { Dispatch } from '../../actions/common';

type Props = {
  children: React.Node,
  onLoad: () => any
};

class AppComponent extends React.Component<Props> {
  props: Props;

  async componentDidMount() {
    this.props.onLoad();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onLoad: async () => {
    // Load token from store
    // Validate and store in redux the slack info
    // TODO(miguel) Have a general load info from local storage
    const token = configStore.get('slack.token');
    await SlackClient.create(token, dispatch);
  }
});

export default connect(null, mapDispatchToProps)(AppComponent);
