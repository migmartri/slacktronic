// @flow

import type { AssertableSubscriptionType } from '.';
import AssertableSubscription from '.';

class DirectMessage extends AssertableSubscription implements AssertableSubscriptionType {
  slackEventNames = ['message', 'im_marked'];
  // { DABC: 'read', DIII: 'unread }
  receivedMessagesChannels = {};

  assert = (event: { type: string, channel: string }): boolean => {
    const { channel } = event;

    /* A direct message in the RTM API means can be detected checking
    that the channel starts with a D */
    if (event.type === 'message' && channel.match(/^D.*/)) {
      // Adds it to the map of received messages so we can also
      // know when we have already read them all
      this.receivedMessagesChannels[channel] = 'unread';
      return true;
    } else if (event.type === 'im_marked') {
      // We flag any possible channel to read
      this.receivedMessagesChannels[channel] = 'read';
      // We return false if all the messages have been read
      return Object.values(this.receivedMessagesChannels).includes('unread');
    }

    return false;
  }
}

export default DirectMessage;
