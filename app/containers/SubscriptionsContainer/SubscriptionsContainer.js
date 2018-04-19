// @flow
import { connect } from 'react-redux';
import SubscriptionsComponent from '../../components/SubscriptionsComponent';

const mapStateToProps = (state) => ({
  slackClient: state.slack.client,
  slackEvents: state.slack.events,
  subscriptions: state.subscriptions
});

export default connect(mapStateToProps, null)(SubscriptionsComponent);
