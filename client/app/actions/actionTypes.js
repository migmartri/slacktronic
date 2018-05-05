// @flow

const prefix = 'slacktronic';

const actions = [
  'SERIAL_CLIENT_CREATING',
  'SERIAL_CLIENT_CREATED',
  'SLACK_CLIENT_INITIALIZE',
  'SLACK_USER_INFO_FETCHING',
  'SLACK_USER_INFO_FETCH_OK',
  'SLACK_USER_INFO_FETCH_KO',
  'SLACK_TOKEN_VALIDATING',
  'SLACK_TOKEN_VALIDATION_OK',
  'SLACK_TOKEN_VALIDATION_KO',
  'SLACK_TOKEN_STORING',
  'SLACK_TOKEN_STORED',
  'SLACK_TOKEN_STORE_ERROR',
  'SLACK_EVENT',
  'SUBSCRIPTION_CRAFT',
  'SUBSCRIPTION_CREATE',
  'SUBSCRIPTION_STATUS_CHANGE',
  'SUBSCRIPTIONS_CLEAR',
  'SERIAL_MESSAGE_ENQUEUE',
  'SERIAL_MESSAGE_CREATE',
  'SERIAL_MESSAGE_UPDATE',
  'PROVIDER_INITIALIZE',
  'PROVIDER_INITIALIZED',
  'PROVIDER_INITIALIZATION_ERROR',
  'TRIGGER_CREATE',
  'TRIGGER_TRIGGERED',
  'ACTION_CREATE',
  'ACTION_PERFORM',
];

const actionFormatter = (actionNames): { [string]: string } => {
  const formatted = {};

  actionNames.forEach((action) => {
    formatted[action] = `${prefix}@${action}`;
  });

  return formatted;
};

export default actionFormatter(actions);
