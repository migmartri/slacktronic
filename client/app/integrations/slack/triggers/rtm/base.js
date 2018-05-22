// @flow

import TriggerOrAction from '../../../base';

export type slackEventType = { type: string, ...{[string]: string} };
export type optionsValuesType = { [string]: string };

class SlackTrigger extends TriggerOrAction {
  slackEventNames: string[];
  // Assigning typed static options does not work.
  shouldTrigger = (slackEvent: slackEventType): boolean => (
    !!this.slackEventNames && this.slackEventNames.includes(slackEvent.type)
  )
}

export default SlackTrigger;
