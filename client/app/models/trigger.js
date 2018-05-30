// @flow

import type { optionsValuesType } from '../integrations/base';

export type triggerPerformType = {
  triggeredAt: Date,
  enabled: boolean
};

export type triggerAttrs = {
  providerName: string,
  type: string,
  options?: optionsValuesType,
  lastPerform?: ?triggerPerformType
};

export type triggerType = {
  ID: string
} & triggerAttrs;
