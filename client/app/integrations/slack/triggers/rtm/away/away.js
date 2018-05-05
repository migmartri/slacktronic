// @flow

import type { TriggerType } from '../../';
import SlackTrigger from '../base';

class Away extends SlackTrigger implements TriggerType {
  static metadata = {
    name: 'Away status',
    description: 'Notify me when I am away',
  }

  slackEventNames = ['presence_change'];

  triggerValue = (event: { type: string, presence: string }): boolean => (
    event.presence === 'away'
  )
}

export default Away;
