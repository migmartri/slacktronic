// @flow

const prefix = 'slacktronic';

const actions = [
  'APP_INITIALIZE',
  'APP_INITIALIZED',
  'APP_INITIALIZATION_ERROR',
  'SUBSCRIPTION_CRAFT',
  'SUBSCRIPTION_CREATE',
  'SUBSCRIPTION_DELETE',
  'SUBSCRIPTIONS_CLEAR',
  'SERIAL_MESSAGE_CREATE',
  'SERIAL_MESSAGE_UPDATE',
  'PROVIDER_INITIALIZE',
  'PROVIDER_INITIALIZED',
  'PROVIDER_INITIALIZATION_ERROR',
  'TRIGGER_CREATE',
  'TRIGGER_DELETE',
  'TRIGGER_TRIGGERED',
  'ACTION_CREATE',
  'ACTION_DELETE',
  'ACTION_PERFORM',
  'SLACK_EVENT',
  'STORE_SNAPSHOT_SAVE',
  'STORE_SNAPSHOT_RETRIEVE',
  'STORE_SNAPSHOT_RETRIEVED'
];

const actionFormatter = (actionNames): { [string]: string } => {
  const formatted = {};

  actionNames.forEach((action) => {
    formatted[action] = `${prefix}@${action}`;
  });

  return formatted;
};

export default actionFormatter(actions);
