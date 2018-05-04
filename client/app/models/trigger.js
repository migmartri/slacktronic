// @flow

export type options = { [string]: any };

export type triggerAttrs = {
  providerName: string,
  type: string,
  options?: options
};

export type triggerType = {
  ID: string
} & triggerAttrs;
