// @flow

import type { AssertableSubscriptionType } from '.';
import AssertableSubscription from '.';

class Away extends AssertableSubscription implements AssertableSubscriptionType {
  slackEventName = 'presence_change';

  assert = (event: { type: string, presence: string }): boolean => (
    event.presence === 'away'
  )
}

export default Away;
