// @flow

import type { slackEventType } from '../base';
import SlackTrigger from '../base';
import type { TriggerType } from '../../';

class DirectMessage extends SlackTrigger implements TriggerType {
  slackEventNames = ['message', 'im_marked'];
  currentUserID: string;
  name = 'Direct message';
  description = 'Notify me when I receive a direct message';
  // { DABC: 'read', DIII: 'unread }
  receivedMessagesChannels = {};

  constructor(currentUserID: string) {
    super();
    this.currentUserID = currentUserID;
  }

  // Override to check that it is a generic message
  // This subscription cares only about direct messages and im_read notifications
  shouldTrigger = (event: slackEventType): boolean => {
    /* A direct message in the RTM API means can be detected checking that the channel starts
     with a D. We also check that the message is not from the currentUser
    */
    if (event.type === 'message' && event.channel.match(/^D.*/) && event.user !== this.currentUserID) {
      return true;
    }
    return event.type === 'im_marked';
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

export default DirectMessage;
