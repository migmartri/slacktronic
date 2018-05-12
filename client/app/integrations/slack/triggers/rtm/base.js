// @flow

import SlackClient from '../../client';

export type slackEventType = { type: string, ...{[string]: string} };
export type valuesFuncType = (client: SlackClient) => string[];

type controlType = 'select' | 'input' | 'hidden';

export type triggerOptionsType = {
  ID: string, required: boolean, values: valuesFuncType, controlType: controlType
}[];

type metadataType = {
  name: string,
  description?: string
};

export type optionsValuesType = { [string]: string };

class SlackTrigger {
  slackEventNames: string[];
  // Assigning typed static options does not work.
  static options = [];
  static metadata: metadataType;

  // Validates that the required options are present
  constructor(triggerOptions: triggerOptionsType, optionsValues: optionsValuesType) {
    triggerOptions.filter(opt => opt.required).forEach(opt => {
      const value = optionsValues[opt.ID];
      if (!value || value === '') throw new Error(`${opt.ID} is required`);
    });
  }

  shouldTrigger = (slackEvent: slackEventType): boolean => (
    !!this.slackEventNames && this.slackEventNames.includes(slackEvent.type)
  )
}

export default SlackTrigger;
