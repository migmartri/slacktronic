// @flow

const prefix = 'slacktronic';

const actions = [
  'SUBSCRIPTION_CRAFT',
  'SUBSCRIPTION_CREATE',
  'SUBSCRIPTIONS_CLEAR',
  'SERIAL_MESSAGE_CREATE',
  'SERIAL_MESSAGE_UPDATE',
  'PROVIDER_INITIALIZE',
  'PROVIDER_INITIALIZED',
  'PROVIDER_INITIALIZATION_ERROR',
  'TRIGGER_CREATE',
  'TRIGGER_TRIGGERED',
  'ACTION_CREATE',
  'ACTION_PERFORM',
  'SLACK_EVENT',
];

const actionFormatter = (actionNames): { [string]: string } => {
  const formatted = {};

  actionNames.forEach((action) => {
    formatted[action] = `${prefix}@${action}`;
  });

  return formatted;
};

export default actionFormatter(actions);
