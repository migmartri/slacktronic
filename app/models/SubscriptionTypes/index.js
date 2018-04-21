// @flow

export interface AssertableSubscriptionType {
  slackEventNames: string[];
  assertable(slackEventName: string): boolean;
  assert({ type: string, ...{[string]: string} }): boolean
}

class AssertableSubscription {
  slackEventNames: string[];

  assertable = (slackEventName: string): boolean => (
    !!this.slackEventNames && this.slackEventNames.includes(slackEventName)
  )
}

export default AssertableSubscription;
