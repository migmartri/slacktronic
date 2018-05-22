// @flow

export type options = { [string]: any };

export type triggerPerformType = {
  triggeredAt: Date,
  enabled: boolean
};

export type triggerAttrs = {
  providerName: string,
  type: string,
  options?: options,
  lastPerform?: ?triggerPerformType
};

export type triggerType = {
  ID: string
} & triggerAttrs;
