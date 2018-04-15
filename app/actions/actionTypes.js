// @flow

const prefix = 'slacktronic';

const actions = [
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
