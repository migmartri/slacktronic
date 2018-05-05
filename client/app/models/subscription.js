// @flow

// TODO, keep only one schema
export type subscriptionTypeAttrs = {
  triggerID: string,
  actionID: string,
  enabled: boolean
};

export type subscriptionType = {
  ID: string
} & subscriptionTypeAttrs;
