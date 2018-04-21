// @flow

import type { AssertableSubscriptionType } from '.';
import AssertableSubscription from '.';

class DirectMessage extends AssertableSubscription implements AssertableSubscriptionType {
  slackEventName = 'message';

  assert = (event: { type: string, channel: string }): boolean => (
    /* A direct message in the RTM API means can be detected checking
    that the channel starts with a D */
    !!event.channel.match(/^D.*/)
  )
}

export default DirectMessage;
