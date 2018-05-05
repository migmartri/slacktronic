// @flow

import away from './away';
import mention from './mention';
import dm from './directMessage';

const SUPPORTED_SLACK_TRIGGERS = {
  away, mention, dm
};


export type supportedSlackTriggersNames = $Keys<typeof SUPPORTED_SLACK_TRIGGERS>;

export default SUPPORTED_SLACK_TRIGGERS;
