// @flow
export type Action = {
  type: string
};

export type Dispatch = (action: Action) => void;
type GetState = () => mixed;
