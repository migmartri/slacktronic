// @flow
import { connect } from 'react-redux';
import type { Dispatch } from '../../actions/common';
import type { subscriptionType } from '../../models/subscription';
import type { triggerType } from '../../models/trigger';
import SubscriptionComponent from '../../components/SubscriptionComponent';
import { deleteSubscription } from '../../actions/subscriptions';
import { triggered } from '../../actions/triggers';

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
  },
  onManualTrigger: (trigger: triggerType, checked: boolean) => {
    dispatch(triggered(trigger.ID, checked, 0));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionComponent);

