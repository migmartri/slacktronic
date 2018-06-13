// @flow
import context from 'jest-plugin-context';
import ChannelMessage from './channelMessage';

// TODO, test fetchChannels and currentUsers

describe('ChannelMessage trigger type', () => {
  const userID = 'myUserID';
  const channelID = 'testChannel';
  const requiredArgs = {
    currentUserID: { value: userID }
  };

  let cmInstance;
  beforeEach(() => {
    cmInstance = new ChannelMessage(requiredArgs);
  });

  describe('#constructor', () => {
    it('requires currentUserID', () => {
      expect(() => new ChannelMessage({})).toThrow(new Error('currentUserID is required'));
    });

    it('sets by default currentUserID and channelID', () => {
      expect(cmInstance).toBeInstanceOf(ChannelMessage);
      expect(cmInstance.currentUserID).toEqual(userID);
      expect(cmInstance.messageRegexp).toBeUndefined();
    });

    it('sets messageRegexp and channel if passed', () => {
      cmInstance = new ChannelMessage({ messageRegexp: { value: '/foo/' }, ...requiredArgs });
      expect(cmInstance).toBeInstanceOf(ChannelMessage);
      expect(cmInstance.messageRegexp).toEqual('/foo/');
      cmInstance = new ChannelMessage({ messageRegexp: { value: '' }, ...requiredArgs });
      expect(cmInstance.messageRegexp).toBeUndefined();
      cmInstance = new ChannelMessage({ channelID: { value: channelID }, ...requiredArgs });
      expect(cmInstance.channelID).toEqual(channelID);
    });
  });

  describe('#shouldTrigger', () => {
    context('when event.type = message and no regexp nor channel set', () => {
      const event = {
        type: 'message', text: 'foo', channel: 'foo', user: 'ANOTHERUSER'
      };

      it('returns true if message not sent by me', () => {
        expect(cmInstance.shouldTrigger(event)).toBeTruthy();
        expect(cmInstance.shouldTrigger({ ...event, user: userID })).toBeFalsy();
      });

      it('returns false the second time if channel already registered', () => {
        expect(cmInstance.shouldTrigger(event)).toBeTruthy();
        expect(cmInstance.triggerValue(event)).toBeTruthy();
        expect(cmInstance.shouldTrigger(event)).toBeFalsy();
      });

      it('ignores threaded messages', () => {
        expect(cmInstance.shouldTrigger({ ...event, thread_ts: 'abc' })).toBeFalsy();
      });
    });

    context('when event.type = message and channel set', () => {
      beforeEach(() => {
        cmInstance = new ChannelMessage({ channelID: { value: channelID }, ...requiredArgs });
      });
      const event = {
        type: 'message', text: 'foo', channel: 'foo', user: 'ANOTHERUSER'
      };

      it('checks the channel in which the event was sent', () => {
        expect(cmInstance.shouldTrigger(event)).toBeFalsy();
        event.channel = channelID;
        expect(cmInstance.shouldTrigger(event)).toBeTruthy();
      });
    });

    context('when event.type = message and regexp set', () => {
      const event = {
        type: 'message', text: 'foo', channel: 'foo', user: 'ANOTHERUSER'
      };

      it('checks the regexp agains the content of the message', () => {
        const testCases = [
          // type = 'message'
          { regexpStr: 'foo', text: 'foo', result: true },
          { regexpStr: '^foo$', text: 'foo', result: true },
          { regexpStr: 'foo|bar', text: 'foobar', result: true },
          { regexpStr: 'foo', text: 'this is foobar', result: true },
          { regexpStr: '^foo', text: 'this is foobar', result: false },
          { regexpStr: 'FOObar', text: 'this is foobar', result: true },
          { regexpStr: '', text: 'this is foobar', result: true },
          { regexpStr: '^http://this.* my-link', text: 'http://this-is-a-link my-link', result: true },
        ];

        testCases.forEach(tc => {
          cmInstance = new ChannelMessage({
            messageRegexp: { value: tc.regexpStr }, ...requiredArgs
          });
          event.text = tc.text;
          expect(cmInstance.shouldTrigger(event)).toEqual(tc.result);
        });
      });
    });

    context('when event.type = channel_marked', () => {
      it('returns false if it does not hasUnreadMessages', () => {
        const event = {
          type: 'channel_marked'
        };
        expect(cmInstance.shouldTrigger(event)).toBeFalsy();

        cmInstance.receivedMessagesChannels.foo = 'read';
        expect(cmInstance.shouldTrigger(event)).toBeFalsy();
      });

      it('returns true if it hasUnreadMessages', () => {
        const event = {
          type: 'channel_marked'
        };
        cmInstance.receivedMessagesChannels.foo = 'unread';
        expect(cmInstance.shouldTrigger(event)).toBeTruthy();
      });
    });

    context('when event.type = anything-else', () => {
      it('returns false', () => {
        expect(cmInstance.shouldTrigger({ type: 'bogus' })).toBeFalsy();
      });
    });
  });

  describe('#triggerValue', () => {
    context('when message type received', () => {
      const slackEvent = { type: 'message', channel: 'myChannel' };
      it('returns true', () => {
        expect(cmInstance.triggerValue(slackEvent)).toBeTruthy();
      });

      it('adds the channel to the recedMesagesChannel map', () => {
        expect(cmInstance.triggerValue(slackEvent));
        expect(cmInstance.receivedMessagesChannels).toEqual({ myChannel: 'unread' });

        slackEvent.channel = 'foobar';

        expect(cmInstance.triggerValue(slackEvent));
        expect(cmInstance.receivedMessagesChannels)
          .toEqual({ myChannel: 'unread', foobar: 'unread' });
      });
    });

    context('when message type channel_marked', () => {
      const slackEvent = { type: 'channel_marked', channel: 'myChannel' };
      it('returns false if no elements left in the recedMesagesChannel map', () => {
        expect(cmInstance.receivedMessagesChannels).toEqual({});
        expect(cmInstance.triggerValue(slackEvent)).toBeFalsy();
      });

      it('returns false if the currentChannel is the only unread elements left', () => {
        cmInstance.receivedMessagesChannels = { myChannel: 'unread' };
        expect(cmInstance.triggerValue(slackEvent)).toBeFalsy();
      });

      it('returns true if there is another unread elements', () => {
        cmInstance.receivedMessagesChannels = { myChannel: 'unread', foobar: 'unread' };
        expect(cmInstance.triggerValue(slackEvent)).toBeTruthy();
      });

      it('sets the channel to read in the recedMesagesChannel map', () => {
        cmInstance.receivedMessagesChannels = { myChannel: 'unread', foobar: 'unread' };
        cmInstance.triggerValue(slackEvent);
        expect(cmInstance.receivedMessagesChannels)
          .toEqual({ myChannel: 'read', foobar: 'unread' });
      });
    });
  });
});
