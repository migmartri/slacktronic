// @flow
import { connect } from 'react-redux';
import SubscriptionsComponent from '../../components/SubscriptionsComponent';

const mapStateToProps = (state) => ({
  slackClient: state.slack.client
});

export default connect(mapStateToProps, null)(SubscriptionsComponent);
