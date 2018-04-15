const prefix = 'slacktronic';

const actions = [
  'SLACK_TOKEN_STORING',
  'SLACK_TOKEN_STORED',
  'SLACK_TOKEN_STORE_ERROR',
];

const actionFormatter = (actionNames) => {
  const formatted = {};

  actionNames.forEach((action) => {
    formatted[action] = `${prefix}@${action}`;
  });

  return formatted;
};

const actionTypes = actionFormatter(actions);
export default actionTypes;
