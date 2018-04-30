// @flow
import context from 'jest-plugin-context';
import Mention from './Mention';

describe('Mention subscription type', () => {
  const userID = 'myUserID';
  let mentionInstance;
  beforeEach(() => {
    mentionInstance = new Mention(userID);
  });

  describe('#assertable', () => {
    it('returns true if we receive a message with my user ID', () => {
      const testCases = [`<@${userID}>`, `<@${userID}> hi there`, `Buddy <@${userID}> hi there`];
      testCases.forEach(c => (
        expect(mentionInstance.assertable({ type: 'message', text: c })).toBeTruthy()
      ));
    });

    it('returns false if we receive a message not including my user ID', () => {
      const testCases = ['<@anotherUser>', `<${userID}> hi there`, `Buddy @${userID} hi there`, 'Hi'];
      testCases.forEach(c => (
        expect(mentionInstance.assertable({ type: 'message', text: c })).toBeFalsy()
      ));
    });

    it('returns false if we receive a message without text a.k.a message_replied', () => {
      expect(mentionInstance.assertable({ type: 'message' })).toBeFalsy();
    });

    it('returns true if we receive a channel_marked event', () => {
      expect(mentionInstance.assertable({ type: 'channel_marked' })).toBeTruthy();
    });

    it('returns false if another event type is sent', () => {
      expect(mentionInstance.assertable({ type: 'BOGUS' })).toBeFalsy();
    });
  });

  describe('#assert', () => {
    context('when message type received', () => {
      const slackEvent = { type: 'message', channel: 'myChannel' };
      it('returns true', () => {
        expect(mentionInstance.assert(slackEvent)).toBeTruthy();
      });

      it('adds the channel to the recedMesagesChannel map', () => {
        expect(mentionInstance.assert(slackEvent));
        expect(mentionInstance.receivedMessagesChannels).toEqual({ myChannel: 'unread' });

        slackEvent.channel = 'foobar';

        expect(mentionInstance.assert(slackEvent));
        expect(mentionInstance.receivedMessagesChannels)
          .toEqual({ myChannel: 'unread', foobar: 'unread' });
      });
    });

    context('when message type channel_marked', () => {
      const slackEvent = { type: 'channel_marked', channel: 'myChannel' };
      it('returns false if no elements left in the recedMesagesChannel map', () => {
        expect(mentionInstance.receivedMessagesChannels).toEqual({});
        expect(mentionInstance.assert(slackEvent)).toBeFalsy();
      });

      it('returns false if the currentChannel is the only unread elements left', () => {
        mentionInstance.receivedMessagesChannels = { myChannel: 'unread' };
        expect(mentionInstance.assert(slackEvent)).toBeFalsy();
      });

      it('returns true if there is another unread elements', () => {
        mentionInstance.receivedMessagesChannels = { myChannel: 'unread', foobar: 'unread' };
        expect(mentionInstance.assert(slackEvent)).toBeTruthy();
      });

      it('sets the channel to read in the recedMesagesChannel map', () => {
        mentionInstance.receivedMessagesChannels = { myChannel: 'unread', foobar: 'unread' };
        mentionInstance.assert(slackEvent);
        expect(mentionInstance.receivedMessagesChannels)
          .toEqual({ myChannel: 'read', foobar: 'unread' });
      });
    });
  });
});

