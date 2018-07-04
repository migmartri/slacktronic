// @flow

import TriggerOrAction from '../../../base';

export type slackEventType = { type: string, ...{[string]: any} };
type channelReadInfo = { [string]: 'unread' | 'read' };

class SlackTrigger extends TriggerOrAction {
  slackEventNames: string[];
  // Delay time in milliseconds since the message gets enqueued until it gets sent.
  // This time can be used to cancel this trigger out if
  // the opposite one arrived within this time window.
  debounceTime = 500;
  // Assigning typed static options does not work.
  shouldTrigger = (slackEvent: slackEventType): boolean => (
    !!this.slackEventNames && this.slackEventNames.includes(slackEvent.type)
  )

  isUnread = (channels: channelReadInfo, channelID: string): boolean => (
    channels[channelID] === 'unread'
  )

  assertMessageRegexp = (text: string, regstr: string): boolean => {
    const re = RegExp(regstr, 'i');
    return re.test(text);
  }

  hasUnreadMessages = (channels: channelReadInfo): boolean => (
    Object.keys(channels).length > 0 && Object.values(channels).includes('unread')
  )
}

export default SlackTrigger;
