// @flow

const prefix = 'slacktronic';

const actions = [
  'SLACK_CLIENT_CREATING',
  'SLACK_CLIENT_CREATED',
  'SLACK_USER_INFO_FETCHING',
  'SLACK_USER_INFO_FETCH_OK',
  'SLACK_USER_INFO_FETCH_KO',
  'SLACK_TOKEN_VALIDATING',
  'SLACK_TOKEN_VALIDATION_OK',
  'SLACK_TOKEN_VALIDATION_KO',
  'SLACK_TOKEN_STORING',
  'SLACK_TOKEN_STORED',
  'SLACK_TOKEN_STORE_ERROR',
];

const actionFormatter = (actionNames): { [string]: string } => {
  const formatted = {};

  actionNames.forEach((action) => {
    formatted[action] = `${prefix}@${action}`;
  });

  return formatted;
};

export default actionFormatter(actions);
