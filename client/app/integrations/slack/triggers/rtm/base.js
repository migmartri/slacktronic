// @flow

import SlackClient from '../../client';

export type slackEventType = { type: string, ...{[string]: string} };
export type valuesFuncType = (client: SlackClient) => string[];

export type triggerOptionsType = {
  ID: string, required: boolean, values: valuesFuncType
}[];

type metadataType = {
  name: string;
  description?: string
};

class SlackTrigger {
  slackEventNames: string[];
  static options: triggerOptionsType = [];
  static metadata: metadataType;

  shouldTrigger = (slackEvent: slackEventType): boolean => (
    !!this.slackEventNames && this.slackEventNames.includes(slackEvent.type)
  )
}

export default SlackTrigger;
