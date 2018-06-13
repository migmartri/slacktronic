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
    it('responds based on the senderID the msg content and event type', () => {
      const testCases = [
        // type = 'message'
        { event: { type: 'message', text: `<@${userID}>`, user: 'ANOTHERUSER' }, result: true },
        { event: { type: 'message', text: `<@${userID}> hi there`, user: 'ANOTHERUSER' }, result: true },
        { event: { type: 'message', text: `Buddy <@${userID}> hi there`, user: 'ANOTHERUSER' }, result: true },
        { event: { type: 'message', text: '<@ANOTHER_USER>', user: 'USER' }, result: false },
        { event: { type: 'message', text: `<@${userID}> hi there`, user: 'ANOTHERUSER' }, result: true },
        { event: { type: 'message', text: `<${userID}> hi there`, user: 'ANOTHERUSER' }, result: false },
        { event: { type: 'message', text: `Buddy @${userID} hi there`, user: 'ANOTHERUSER' }, result: false },
        // Not sent from me
        { event: { type: 'message', text: `<@${userID}> hi there`, user: userID }, result: false },
        // message_replied does not have inf
        { event: { type: 'message', user: userID }, result: false },
        { event: { type: 'BOGUS' }, result: false },
        // type = channel_marked
        { event: { type: 'channel_marked' }, result: true },
      ];

      testCases.forEach(tc => (
        expect(mentionInstance.shouldTrigger(tc.event)).toEqual(tc.result)
      ));
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

