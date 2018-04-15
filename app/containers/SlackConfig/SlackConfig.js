// @flow
import { connect } from 'react-redux';
import type { Dispatch } from '../../actions/common';
import storeToken from '../../actions/slack';
import SlackConfigComponent from '../../components/SlackConfig';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onTokenCreate: (token: string): void => (
    dispatch(storeToken(token))
  )
});

export default connect(null, mapDispatchToProps)(SlackConfigComponent);
