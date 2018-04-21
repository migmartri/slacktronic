// @flow
import type { AssertableSubscriptionType } from './SubscriptionTypes';

type slotType = {
  ON: string, OFF: string
};

type slotTypes = { [string]: slotType };

// A SLOT represents the different actuators that can be
// configured and will be referenced via serial communication
const SLOT_MESSAGES: slotTypes = {
  A: {
    ON: 'A', OFF: 'a',
  },
  B: {
    ON: 'B', OFF: 'b',
  },
  C: {
    ON: 'C', OFF: 'c',
  },
  D: {
    ON: 'D', OFF: 'd',
  }
};

type slotIDType = $Keys<typeof SLOT_MESSAGES>;

export type subscriptionTypeAttrs = {
  slot: slotIDType, // 'A, B, C, D'
  assertion: AssertableSubscriptionType,
  active: boolean
};

export type subscriptionType = {
  ID: string
} & subscriptionTypeAttrs;

export default SLOT_MESSAGES;
