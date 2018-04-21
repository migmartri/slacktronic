// @flow

export type slackEventType = { type: string, ...{[string]: string} };

export interface AssertableSubscriptionType {
  slackEventNames: string[];
  assertable(slackEventType): boolean;
  assert(slackEventType): boolean
}

class AssertableSubscription {
  slackEventNames: string[];

  assertable = (slackEvent: slackEventType): boolean => (
    !!this.slackEventNames && this.slackEventNames.includes(slackEvent.type)
  )
}

export default AssertableSubscription;
