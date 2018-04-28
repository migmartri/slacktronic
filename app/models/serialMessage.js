// @flow

const serialMessageStatus = {
  pending: 'pending',
  sending: 'sending',
  sent: 'sent',
  error: 'error',
};

type MessageStatusType = $Keys<typeof serialMessageStatus>;

export type serialMessageAttrs = {
  status: MessageStatusType,
  message: string,
  subscriptionID: string,
  errorMessage?: string
};

export type serialMessage = {
  ID: string
} & serialMessageAttrs;

export default serialMessageStatus;

