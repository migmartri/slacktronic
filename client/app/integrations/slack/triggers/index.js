import { all } from 'redux-saga/effects';
import slackRTMSaga from './rtm/rtmSaga';
import away from './rtm/away';
import mention from './rtm/mention';
import dm from './rtm/directMessage';
import cm from './rtm/channelMessage';

export const AVAILABLE_SLACK_TRIGGERS = {
  away, mention, dm, cm
};

export type supportedSlackTriggersNames = $Keys<typeof AVAILABLE_SLACK_TRIGGERS>;

export default function* triggersSaga() {
  yield all([
    slackRTMSaga()
  ]);
}
