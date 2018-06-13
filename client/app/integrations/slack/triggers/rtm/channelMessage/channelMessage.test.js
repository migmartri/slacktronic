// @flow
import ChannelMessage from './channelMessage';

describe('ChannelMessage trigger type', () => {
  const userID = 'myUserID';
  const channelID = 'testChannel';
  const requiredArgs = {
    currentUserID: { value: userID },
    channelID: { value: channelID },
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
      expect(cmInstance.channelID).toEqual(channelID);
      expect(cmInstance.messageRegexp).toBeUndefined();
    });

    it('sets messageRegexp if passed', () => {
      cmInstance = new ChannelMessage({ messageRegexp: { value: '/foo/' }, ...requiredArgs });
      expect(cmInstance).toBeInstanceOf(ChannelMessage);
      expect(cmInstance.messageRegexp).toEqual('/foo/');
      cmInstance = new ChannelMessage({ messageRegexp: { value: '' }, ...requiredArgs });
      expect(cmInstance.messageRegexp).toBeUndefined();
    });
  });
});
