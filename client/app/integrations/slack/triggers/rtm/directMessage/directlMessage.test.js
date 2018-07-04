// @flow
import context from 'jest-plugin-context';
import DirectMessage from './directMessage';

describe('DirectMessage trigger type', () => {
  const userID = 'myUserID';
  const requiredArgs = {
    currentUserID: { value: userID }
  };

  let dmInstance;
  beforeEach(() => {
    dmInstance = new DirectMessage(requiredArgs);
  });

  describe('#constructor', () => {
    it('requires currentUserID', () => {
      expect(() => new DirectMessage({})).toThrow(new Error('currentUserID is required'));
    });

    it('sets by default currentUserID and channelID', () => {
      expect(dmInstance).toBeInstanceOf(DirectMessage);
      expect(dmInstance.currentUserID).toEqual(userID);
    });
  });

  describe('#shouldTrigger', () => {
    context('when event.type = message', () => {
      const event = {
        type: 'message', text: 'foo', channel: 'Dfof', user: 'ANOTHERUSER'
      };

      it("returns false if it's not a direct message", () => {
        expect(dmInstance.shouldTrigger(event)).toBeTruthy();
        expect(dmInstance.shouldTrigger({ ...event, channel: 'A-Regular-Channel' })).toBeFalsy();
      });

      it('returns true if message not sent by me', () => {
        expect(dmInstance.shouldTrigger(event)).toBeTruthy();
        expect(dmInstance.shouldTrigger({ ...event, user: userID })).toBeFalsy();
      });

      it('ignores bot messages', () => {
        expect(dmInstance.shouldTrigger({ ...event, subtype: 'bot_message' })).toBeFalsy();
      });

      it('ignores hidden messages', () => {
        expect(dmInstance.shouldTrigger({ ...event, hidden: true })).toBeFalsy();
      });
    });

    context('when event.type = im_marked', () => {
      it('returns false if it does not hasUnreadMessages', () => {
        const event = {
          type: 'im_marked'
        };
        expect(dmInstance.shouldTrigger(event)).toBeFalsy();

        dmInstance.receivedMessagesChannels.foo = 'read';
        expect(dmInstance.shouldTrigger(event)).toBeFalsy();
      });

      it('returns true if it hasUnreadMessages', () => {
        const event = {
          type: 'im_marked'
        };
        dmInstance.receivedMessagesChannels.foo = 'unread';
        expect(dmInstance.shouldTrigger(event)).toBeTruthy();
      });
    });

    context('when event.type = anything-else', () => {
      it('returns false', () => {
        expect(dmInstance.shouldTrigger({ type: 'bogus' })).toBeFalsy();
      });
    });
  });

  describe('#triggerValue', () => {
    context('when message type received', () => {
      const slackEvent = { type: 'message', channel: 'DmyChannel' };
      it('returns true', () => {
        expect(dmInstance.triggerValue(slackEvent)).toBeTruthy();
      });

      it('adds the channel to the recedMesagesChannel map', () => {
        expect(dmInstance.triggerValue(slackEvent));
        expect(dmInstance.receivedMessagesChannels).toEqual({ DmyChannel: 'unread' });

        slackEvent.channel = 'foobar';

        expect(dmInstance.triggerValue(slackEvent));
        expect(dmInstance.receivedMessagesChannels)
          .toEqual({ DmyChannel: 'unread', foobar: 'unread' });
      });
    });

    context('when message type im_marked', () => {
      const slackEvent = { type: 'im_marked', channel: 'myChannel' };
      it('returns false if no elements left in the recedMesagesChannel map', () => {
        expect(dmInstance.receivedMessagesChannels).toEqual({});
        expect(dmInstance.triggerValue(slackEvent)).toBeFalsy();
      });

      it('returns false if the currentChannel is the only unread elements left', () => {
        dmInstance.receivedMessagesChannels = { myChannel: 'unread' };
        expect(dmInstance.triggerValue(slackEvent)).toBeFalsy();
      });

      it('returns true if there is another unread elements', () => {
        dmInstance.receivedMessagesChannels = { myChannel: 'unread', foobar: 'unread' };
        expect(dmInstance.triggerValue(slackEvent)).toBeTruthy();
      });

      it('sets the channel to read in the recedMesagesChannel map', () => {
        dmInstance.receivedMessagesChannels = { myChannel: 'unread', foobar: 'unread' };
        dmInstance.triggerValue(slackEvent);
        expect(dmInstance.receivedMessagesChannels)
          .toEqual({ myChannel: 'read', foobar: 'unread' });
      });
    });
  });
});
