// @flow
import { connect } from 'react-redux';
import SubscriptionComponent from '../../components/SubscriptionComponent';

const mapStateToProps = (state, ownProps) => (
  {
    subscription: state.subscriptions.byID[ownProps.subscriptionID],
    serialClient: state.serial.client
  }
);

export default connect(mapStateToProps, null)(SubscriptionComponent);

