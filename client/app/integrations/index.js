import { AVAILABLE_SLACK_TRIGGERS } from './slack/triggers';
import { AVAILABLE_SERIALCOM_ACTIONS } from './serialCom/actions';

export const AVAILABLE_PROVIDERS = {
  slack: 'slack',
  serialCom: 'serialCom'
};

export type availableProviderNamesType = $Keys<typeof AVAILABLE_PROVIDERS>;

export const AVAILABLE_TRIGGERS = {
  [AVAILABLE_PROVIDERS.slack]: AVAILABLE_SLACK_TRIGGERS
};

export const AVAILABLE_ACTIONS = {
  [AVAILABLE_PROVIDERS.serialCom]: AVAILABLE_SERIALCOM_ACTIONS
};


export default AVAILABLE_PROVIDERS;
