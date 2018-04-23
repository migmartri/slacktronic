// @flow
export type eventType = {
  ID: string,
  type: string
};

export type userInfoType = {
  user: string,
  userID: string,
  team: string,
  teamID: string
};

export type tokenStateType = {
  +value?: string,
  +storing: boolean,
  +validating: boolean,
  +valid: boolean
};
