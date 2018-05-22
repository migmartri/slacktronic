// @flow

import type { ActionType } from '../../../';
import type { optionsValuesType, valuesEntries } from '../../../base';
import TriggerOrAction from '../../../base';

class Message extends TriggerOrAction implements ActionType {
  static availableChars = (): valuesEntries => {
    return [{ value: 'a', label: 'A' }];
  };

  static options = [
    {
      ID: 'payload',
      required: true,
      values: Message.availableChars,
      controlType: 'select'
    }
  ];

  static metadata = {
    name: 'Serial port message',
    description: 'Send a message evia the serial port',
  }

  payload: string;

  constructor(optionValues: optionsValuesType) {
    super(Message.options, optionValues);
    this.payload = optionValues.payload;
  }
}

export default Message;
