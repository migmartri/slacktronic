// @flow

export type slackEventType = { type: string, ...{[string]: string} };

class SlackTrigger {
  slackEventNames: string[];

  shouldTrigger = (slackEvent: slackEventType): boolean => (
    !!this.slackEventNames && this.slackEventNames.includes(slackEvent.type)
  )
}

export default SlackTrigger;
