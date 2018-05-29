// @flow

import type { ActionType } from '../../../';
import type { optionsValuesType, valuesEntries } from '../../../base';
import TriggerOrAction from '../../../base';

class Message extends TriggerOrAction implements ActionType {
  static availableChars = (): valuesEntries => {
    const lowerCases = [...Array(26)].map((val, i) => String.fromCharCode(i + 97));
    return lowerCases.map(char => ({ value: char, label: `Send character "${char.toUpperCase()}" if ON and "${char}" if OFF ` }));
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
    description: 'Send a message via the serial port',
  }

  payload: string;

  constructor(optionValues: optionsValuesType) {
    super(Message.options, optionValues);
    this.payload = optionValues.payload.value;
  }
}

export default Message;
