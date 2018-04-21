// @flow

export interface AssertableSubscriptionType {
  slackEventName: string;
  assertable(slackEventName: string): boolean;
  assert({ type: string, ...{[string]: string} }): boolean
}

class AssertableSubscription {
  assertable = (slackEventName: string): boolean => (
    !!this.slackEventName && slackEventName === this.slackEventName
  )
}

export default AssertableSubscription;
