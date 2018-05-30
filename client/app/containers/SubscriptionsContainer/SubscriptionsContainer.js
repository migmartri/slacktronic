// @flow
import { connect } from 'react-redux';
import SubscriptionsComponent from '../../components/SubscriptionsComponent';
import { AVAILABLE_PROVIDERS } from '../../integrations';

const mapStateToProps = (state) => {
  const subsByID = state.subscriptions.byID;
  const subscriptions = Object.keys(subsByID).map(k => subsByID[k]);

  const eventsByID = state.slack.events.byID;
  const slackEvents = Object.keys(eventsByID).map(k => eventsByID[k]);
  const providersByName = state.providers.byName;
  const {
    [AVAILABLE_PROVIDERS.slack]: slackProvider,
    [AVAILABLE_PROVIDERS.serialCom]: serialProvider
  } = providersByName;

  let serialPort;
  let slackUserInfo;

  if (serialProvider && serialProvider.options.client) {
    ({ port: serialPort } = serialProvider.options.client);
  }

  if (slackProvider && slackProvider.options.client) {
    ({ userInfo: slackUserInfo } = slackProvider.options.client);
  }

  return {
    slackUserInfo,
    serialPort,
    slackEvents,
    subscriptions,
  };
};

export default connect(mapStateToProps, null)(SubscriptionsComponent);
