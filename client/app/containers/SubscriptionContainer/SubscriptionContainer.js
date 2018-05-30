// @flow
import { connect } from 'react-redux';
import type { Dispatch } from '../../actions/common';
import type { subscriptionType } from '../../models/subscription';
import SubscriptionComponent from '../../components/SubscriptionComponent';
import { deleteSubscription } from '../../actions/subscriptions';

const mapStateToProps = (state, ownProps) => {
  const providersByName = state.providers.byName;
  const providers = Object.keys(providersByName).map(k => providersByName[k]);
  const subscription = state.subscriptions.byID[ownProps.subscriptionID];

  return {
    subscription,
    providers,
    action: state.actions.byID[subscription.actionID],
    trigger: state.triggers.byID[subscription.triggerID],
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onDelete: (subscription: subscriptionType) => {
    dispatch(deleteSubscription(subscription));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionComponent);

