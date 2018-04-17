// @flow
import { connect } from 'react-redux';
import SubscriptionsComponent from '../../components/SubscriptionsComponent';

const mapStateToProps = (state) => ({
  slackClient: state.slack.client
});

const mapDispatchToProps = (dispatch: Dispatch, ownprops) => ({
  onLoad: () => {
    // Load token from store
    // Validate and store in redux the slack info
    // TODO(miguel) Have a general load info from local storage
    console.warn(dispatch);
    console.warn(ownprops);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionsComponent);
