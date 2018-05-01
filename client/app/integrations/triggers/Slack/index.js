import { actionChannel, take } from 'redux-saga/effects';
import actionTypes from '../../../actions/actionTypes';

export type slackEventType = { type: string, ...{[string]: string} };

// Extend this class to re-use default assertable function
export class SlackTrigger {
  slackEventNames: string[];

  shouldTrigger = (slackEvent: slackEventType): boolean => (
    !!this.slackEventNames && this.slackEventNames.includes(slackEvent.type)
  )
}

function* watchSlackEventsTriggers() {
  // 1- Create a channel for jobs enqueues
  const messagesChan = yield actionChannel(actionTypes.PROCESS_SLACK_EVENT_ENQUEUE);
  while (true) {
    // 2- take from the channel
    const { eventData } = yield take(messagesChan);
    console.warn('We have received an Slack event', eventData);
  }
}

export default watchSlackEventsTriggers;
