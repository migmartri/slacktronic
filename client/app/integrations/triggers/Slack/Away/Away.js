// @flow

import type { TriggerType } from '../../';
import { SlackTrigger } from '../';

class Away extends SlackTrigger implements TriggerType {
  slackEventNames = ['presence_change'];
  name = 'Away status';
  description = 'Notify me when I am away';

  triggerValue = (event: { type: string, presence: string }): boolean => (
    event.presence === 'away'
  )
}

export default Away;
