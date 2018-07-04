// @flow

import type { slackEventType } from '../base';
import type { optionsValuesType, valuesEntries } from '../../../../base';
import SlackTrigger from '../base';
import type { TriggerType } from '../../../../';
import SlackClient from '../../../client';

class DirectMessage extends SlackTrigger implements TriggerType {
  static metadata = {
    name: 'Direct message',
    description: 'Notify me when I receive a direct message'
  }

  static fetchCurrentUser = (client: SlackClient): valuesEntries => {
    const { userID, user } = client.userInfo;
    return [{ value: userID, label: user }];
  };

  // debounceTime override since the reception of the im_marked cancelation can take some time
  debounceTime = 5000;
  slackEventNames = ['message', 'im_marked'];
  currentUserID: string;
  // { DABC: 'read', DIII: 'unread }
  receivedMessagesChannels = {};

  static options = [
    {
      ID: 'currentUserID',
      required: true,
      values: DirectMessage.fetchCurrentUser,
      controlType: 'hidden'
    }
  ];


  constructor(optionValues: optionsValuesType) {
    super(DirectMessage.options, optionValues);
    this.currentUserID = optionValues.currentUserID.value;
  }

  // Override to check that it is a generic message
  // This subscription cares only about direct messages and im_read notifications
  shouldTrigger = (event: slackEventType): boolean => {
    /* - It's a direct message means that the channel starts with a D.
       - Check that the currentUser is not the one that sent it
       - Check that it is not a bot the one that sends a message https://github.com/migmartri/slacktronic/issues/67
    */
    if (event.type === 'message' &&
        event.channel.match(/^D.*/) &&
        event.user !== this.currentUserID &&
        event.hidden !== true &&
        event.subtype !== 'bot_message') {
      return true;
    }
    return event.type === 'im_marked' && this.hasUnreadMessages(this.receivedMessagesChannels);
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
    return this.hasUnreadMessages(this.receivedMessagesChannels);
  }
}

export default DirectMessage;
