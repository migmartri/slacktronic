// @flow
export type eventType = {
  ID: string,
  eventInfo: {
    type: string
  }
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

export type stateType = {
  +token: tokenStateType,
  +userInfo?: userInfoType,
  +events: eventType[]
};
