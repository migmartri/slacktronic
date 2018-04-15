// @flow
export type Action = {
  type: string
};

export type Dispatch = (action: Action | ThunkAction) => void;
type GetState = () => mixed;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => void;
