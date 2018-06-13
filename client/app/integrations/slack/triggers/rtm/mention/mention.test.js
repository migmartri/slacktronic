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
    context('when event.type = message', () => {
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
        ];

        testCases.forEach(tc => (
          expect(mentionInstance.shouldTrigger(tc.event)).toEqual(tc.result)
        ));
      });

      it('returns false the second time if channel already registered', () => {
        const event = {
          type: 'message', text: `<@${userID}>`, channel: 'foo', user: 'ANOTHERUSER'
        };
        expect(mentionInstance.shouldTrigger(event)).toBeTruthy();
        expect(mentionInstance.triggerValue(event)).toBeTruthy();
        expect(mentionInstance.shouldTrigger(event)).toBeFalsy();
      });
    });

    context('when event.type = channel_marked', () => {
      it('returns false if it does not hasUnreadMessages', () => {
        const event = {
          type: 'channel_marked'
        };
        expect(mentionInstance.shouldTrigger(event)).toBeFalsy();

        mentionInstance.receivedMessagesChannels.foo = 'read';
        expect(mentionInstance.shouldTrigger(event)).toBeFalsy();
      });

      it('returns true if it hasUnreadMessages', () => {
        const event = {
          type: 'channel_marked'
        };
        mentionInstance.receivedMessagesChannels.foo = 'unread';
        expect(mentionInstance.shouldTrigger(event)).toBeTruthy();
      });
    });

    context('when event.type = anything-else', () => {
      it('returns false', () => {
        expect(mentionInstance.shouldTrigger({ type: 'bogus' })).toBeFalsy();
      });
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

