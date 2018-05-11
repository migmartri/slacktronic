// @flow

import type { slackEventType } from '../base';
import SlackTrigger from '../base';
import type { TriggerType } from '../../../../';
import SlackClient from '../../../client';

// Mention works in a similar way than the Direct message, with the difference
// that it checks for an @UserID pattern and it relies on the channel_marked event
class Mention extends SlackTrigger implements TriggerType {
  static metadata = {
    name: 'Mention',
    description: 'Notify me when I am mentioned'
  }

  static fetchCurrentUser = (client: SlackClient) => {
    return [client.userInfo.userID];
  }

  static options = [
    { ID: 'currentUserID', required: true, values: Mention.fetchCurrentUser }
  ];

  slackEventNames = ['message', 'channel_marked'];
  currentUserID: string;
  // { DABC: 'read', DIII: 'unread }
  receivedMessagesChannels = {};

  constructor(currentUserID: string) {
    super();
    this.currentUserID = currentUserID;
  }

  // Override to check that it is a generic message
  // This subscription cares only about direct messages and im_read notifications
  shouldTrigger = (event: slackEventType): boolean => {
    /*
      A mention includes the following pattern with the userID <@xxxxxx>
    */
    const strMatcher = `<@${this.currentUserID}>`;
    if (event.type === 'message' && event.text && event.text.match(strMatcher)) {
      return true;
    }
    return event.type === 'channel_marked';
  }

  triggerValue = (event: { type: string, channel: string }): boolean => {
    const { channel } = event;

    // New message
    if (event.type === 'message') {
      // Adds it to the map of received messages so we can also
      // know when we have already read them all
      this.receivedMessagesChannels[channel] = 'unread';
      return true;
    }

    // Message read
    // We flag any possible channel to read
    this.receivedMessagesChannels[channel] = 'read';
    // We return false if all the messages have been read
    return Object.values(this.receivedMessagesChannels).includes('unread');
  }
}

export default Mention;
