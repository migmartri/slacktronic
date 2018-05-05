// @flow
// Slots are represented by uppercase letters i.e A,B,C
// They are mapped as a map so we can create a slotIDType using $keys
const SLOTS: { [string]: string } = {};

[...Array(26)].forEach((val, i) => {
  const char = String.fromCharCode(i + 65);
  SLOTS[char] = char;
});

type slotIDType = $Keys<typeof SLOTS>;

type subscriptionTypeAttrsNew = {
  triggerID: string,
  actionID: string,
  enabled: boolean
};

// TODO, keep only one schema
export type subscriptionTypeAttrs = {
  slot: slotIDType, // 'A, B, C, D'
  assertion: any,
  active: boolean
} | subscriptionTypeAttrsNew;

export type subscriptionType = {
  ID: string
} & subscriptionTypeAttrs;
