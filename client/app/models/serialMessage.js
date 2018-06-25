// @flow

const serialMessageStatus = {
  pending: 'pending',
  sent: 'sent',
  error: 'error',
  aborted: 'aborted',
};

type MessageStatusType = $Keys<typeof serialMessageStatus>;

export type serialMessageAttrs = {
  status: MessageStatusType,
  payload: string,
  errorMessage?: string
};

export type serialMessage = {
  ID: string
} & serialMessageAttrs;

export default serialMessageStatus;

