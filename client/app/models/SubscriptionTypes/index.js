// @flow

export type slackEventType = { type: string, ...{[string]: string} };

export interface AssertableSubscriptionType {
  slackEventNames: string[];
  name: string;
  description?: string;
  assertable(slackEventType): boolean;
  assert(slackEventType): boolean
}

// Extend this class to re-use default assertable function
class AssertableSubscription {
  slackEventNames: string[];

  assertable = (slackEvent: slackEventType): boolean => (
    !!this.slackEventNames && this.slackEventNames.includes(slackEvent.type)
  )
}

export default AssertableSubscription;
