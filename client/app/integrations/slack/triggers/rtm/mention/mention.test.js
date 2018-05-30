// @flow
import context from 'jest-plugin-context';
import Mention from './mention';

describe('Mention subscription type', () => {
  const userID = 'myUserID';
  let mentionInstance;
  beforeEach(() => {
    mentionInstance = new Mention({ currentUserID: { value: userID } });
  });

  describe('#constructor', () => {
    it('requires currentUserID', () => {
      expect(() => new Mention({})).toThrow(new Error('currentUserID is required'));
    });

    it('returns an instance of the class', () => {
      expect(mentionInstance).toBeInstanceOf(Mention);
      expect(mentionInstance.currentUserID).toEqual('myUserID');
    });
  });

  describe('#shouldTrigger', () => {
    it('returns true if we receive a message with my user ID', () => {
      const testCases = [`<@${userID}>`, `<@${userID}> hi there`, `Buddy <@${userID}> hi there`];
      testCases.forEach(c => (
        expect(mentionInstance.shouldTrigger({ type: 'message', text: c })).toBeTruthy()
      ));
    });

    it('returns false if we receive a message not including my user ID', () => {
      const testCases = ['<@anotherUser>', `<${userID}> hi there`, `Buddy @${userID} hi there`, 'Hi'];
      testCases.forEach(c => (
        expect(mentionInstance.shouldTrigger({ type: 'message', text: c })).toBeFalsy()
      ));
    });

    it('returns false if we receive a message without text a.k.a message_replied', () => {
      expect(mentionInstance.shouldTrigger({ type: 'message' })).toBeFalsy();
    });

    it('returns true if we receive a channel_marked event', () => {
      expect(mentionInstance.shouldTrigger({ type: 'channel_marked' })).toBeTruthy();
    });

    it('returns false if another event type is sent', () => {
      expect(mentionInstance.shouldTrigger({ type: 'BOGUS' })).toBeFalsy();
    });
  });

  describe('#triggerValue', () => {
    context('when message type received', () => {
      const slackEvent = { type: 'message', channel: 'myChannel' };
      it('returns true', () => {
        expect(mentionInstance.triggerValue(slackEvent)).toBeTruthy();
      });

      it('adds the channel to the recedMesagesChannel map', () => {
        expect(mentionInstance.triggerValue(slackEvent));
        expect(mentionInstance.receivedMessagesChannels).toEqual({ myChannel: 'unread' });

        slackEvent.channel = 'foobar';

        expect(mentionInstance.triggerValue(slackEvent));
        expect(mentionInstance.receivedMessagesChannels)
          .toEqual({ myChannel: 'unread', foobar: 'unread' });
      });
    });

    context('when message type channel_marked', () => {
      const slackEvent = { type: 'channel_marked', channel: 'myChannel' };
      it('returns false if no elements left in the recedMesagesChannel map', () => {
        expect(mentionInstance.receivedMessagesChannels).toEqual({});
        expect(mentionInstance.triggerValue(slackEvent)).toBeFalsy();
      });

      it('returns false if the currentChannel is the only unread elements left', () => {
        mentionInstance.receivedMessagesChannels = { myChannel: 'unread' };
        expect(mentionInstance.triggerValue(slackEvent)).toBeFalsy();
      });

      it('returns true if there is another unread elements', () => {
        mentionInstance.receivedMessagesChannels = { myChannel: 'unread', foobar: 'unread' };
        expect(mentionInstance.triggerValue(slackEvent)).toBeTruthy();
      });

      it('sets the channel to read in the recedMesagesChannel map', () => {
        mentionInstance.receivedMessagesChannels = { myChannel: 'unread', foobar: 'unread' };
        mentionInstance.triggerValue(slackEvent);
        expect(mentionInstance.receivedMessagesChannels)
          .toEqual({ myChannel: 'read', foobar: 'unread' });
      });
    });
  });
});

