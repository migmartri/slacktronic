// @flow
import shortID from 'shortid';
import type { Action } from './common';
import actionTypes from './actionTypes';
import type SlacktronicSerialClient from '../lib/serialClient';
import MessageStatus from '../models/serialMessage';


// Client creation
export const serialClientCreating = (): Action => ({
  type: actionTypes.SERIAL_CLIENT_CREATING
});

export const serialClientCreated = (client: SlacktronicSerialClient): Action => ({
  type: actionTypes.SERIAL_CLIENT_CREATED,
  client
});

// Messages
export const enqueueMessage = (message: string, subscriptionID: string): Action => ({
  type: actionTypes.SERIAL_MESSAGE_ENQUEUE,
  data: {
    ID: shortID.generate(), status: MessageStatus.pending, message, subscriptionID
  }
});
