// @flow
import { connect } from 'react-redux';
import SubscriptionsComponent from '../../components/SubscriptionsComponent';

const mapStateToProps = (state) => {
  const subsByID = state.subscriptions.byID;
  const subscriptions = Object.keys(subsByID).map(k => subsByID[k]);

  return {
    slackClient: state.slack.client,
    slackEvents: state.slack.events,
    subscriptions
  };
};

export default connect(mapStateToProps, null)(SubscriptionsComponent);
