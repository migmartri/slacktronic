// @flow
import { connect } from 'react-redux';
import SubscriptionComponent from '../../components/SubscriptionComponent';

const mapStateToProps = (state, ownProps) => {
  const providersByName = state.providers.byName;
  const providers = Object.keys(providersByName).map(k => providersByName[k]);
  const subscription = state.subscriptions.byID[ownProps.subscriptionID];

  return {
    subscription,
    providers,
    action: state.actions.byID[subscription.actionID],
    trigger: state.triggers.byID[subscription.triggerID],
    serialClient: state.serial.client
  };
};

export default connect(mapStateToProps, null)(SubscriptionComponent);

