// @flow

import type { slackEventType } from '../base';
import type { optionsValuesType, valuesEntries } from '../../../../base';
import SlackTrigger from '../base';
import type { TriggerType } from '../../../../';
import SlackClient from '../../../client';

class ChannelMessage extends SlackTrigger implements TriggerType {
  static metadata = {
    name: 'Message in a channel',
    description: 'Notify me when I receive a message in a channel'
  }

  static fetchCurrentUser = (client: SlackClient): valuesEntries => {
    const { userID, user } = client.userInfo;
    return [{ value: userID, label: user }];
  };

  static fetchChannels = async (client: SlackClient): valuesEntries => {
    const channels = await client.webClient.channels.list();
    const values = channels.channels.map(c => (
      { value: c.id, label: `#${c.name}` }
    ));
    // TODO, rely on non required values
    values.unshift({ label: 'Any channel', value: '' });
    return values;
  };

  slackEventNames = ['message', 'channel_marked'];
  currentUserID: string;
  // Channel in which we want to monitor messages
  channelID: string;
  messageRegexp: string;
  // { DABC: 'read', DIII: 'unread }
  receivedMessagesChannels = {};

  static options = [
    {
      ID: 'currentUserID',
      required: true,
      values: ChannelMessage.fetchCurrentUser,
      controlType: 'hidden'
    },
    {
      ID: 'channelID',
      label: 'Channel the message was sent to',
      required: false,
      values: ChannelMessage.fetchChannels,
      controlType: 'select'
    },
    {
      ID: 'messageRegexp',
      label: 'Match the message body with this regular expression',
      required: false,
      controlType: 'input',
      placeholder: 'Leave empty to match all the messages'
    }
  ];

  constructor(optionValues: optionsValuesType) {
    super(ChannelMessage.options, optionValues);
    this.currentUserID = optionValues.currentUserID.value;

    if (optionValues.messageRegexp) {
      const messageRegexp = optionValues.messageRegexp.value;
      if (messageRegexp !== '') {
        this.messageRegexp = messageRegexp;
      }
    }

    if (optionValues.channelID) {
      const channelID = optionValues.channelID.value;
      if (channelID !== '') {
        this.channelID = channelID;
      }
    }
  }

  // Override to check that it is a generic message
  // This subscription cares only about direct messages and im_read notifications
  shouldTrigger = (event: slackEventType): boolean => {
    // It is not a direct message or sent by me or already registered
    if (event.type === 'message' &&
      !event.thread_ts && // for now we ignore threads
      this.assertChannel(event) &&
      event.text && this.assertMessageRegexp(event.text, this.messageRegexp || '.*') &&
      !this.isUnread(this.receivedMessagesChannels, event.channel) &&
      event.user !== this.currentUserID) {
      return true;
    }
    return event.type === 'channel_marked' && this.hasUnreadMessages(this.receivedMessagesChannels);
  }

  assertChannel = (event: slackEventType): boolean => (
    !/^D.*/.test(event.channe) && (!this.channelID || this.channelID === event.channel)
  )

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

export default ChannelMessage;
