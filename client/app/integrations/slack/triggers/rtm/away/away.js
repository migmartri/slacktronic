// @flow

import type { TriggerType } from '../../../../';
import type { optionsValuesType } from '../base';
import SlackTrigger from '../base';

class Away extends SlackTrigger implements TriggerType {
  static metadata = {
    name: 'Away status',
    description: 'Notify me when I am away',
  }

  slackEventNames = ['presence_change'];

  constructor(optionValues: optionsValuesType) {
    super([], optionValues);
  }

  triggerValue = (event: { type: string, presence: string }): boolean => (
    event.presence === 'away'
  )
}

export default Away;
