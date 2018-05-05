// @flow
import { connect } from 'react-redux';
import SubscriptionsComponent from '../../components/SubscriptionsComponent';

const mapStateToProps = (state) => {
  const subsByID = state.subscriptions.byID;
  const subscriptions = Object.keys(subsByID).map(k => subsByID[k]);

  const eventsByID = state.slack.events.byID;
  const slackEvents = Object.keys(eventsByID).map(k => eventsByID[k]);

  let serialPort;

  if (state.serial.client) {
    ({ port: serialPort } = state.serial.client);
  }

  return {
    slackUserInfo: state.slack.userInfo,
    serialPort,
    slackEvents,
    subscriptions,
  };
};

export default connect(mapStateToProps, null)(SubscriptionsComponent);
