// @flow

export type slotStatusON = 'ON';
export type slotStatusOFF = 'OFF';

type slotType = {
  ON: string, OFF: string
};

type slotTypes = { [string]: slotType };

// A SLOT represents the different actuators that can be
// configured and will be referenced via serial communication
const SLOTS: slotTypes = {
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

type slotIDType = $Keys<typeof SLOTS>;

export type subscriptionTypeAttrs = {
  slot: slotIDType, // 'A, B, C, D'
  status: slotStatusON | slotStatusOFF
};

export type subscriptionType = {
  id: string
} & subscriptionTypeAttrs;
