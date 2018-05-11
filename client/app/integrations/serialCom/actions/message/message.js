// @flow

import type { ActionType } from '../../../';

class Message implements ActionType {
  static options = [];
  static metadata = {
    name: 'Serial port message',
    description: 'Send a message evia the serial port',
  }
}

export default Message;
