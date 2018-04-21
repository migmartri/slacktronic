// @flow
import type { Action } from './common';
import actionTypes from './actionTypes';
import type SlacktronicSerialClient from '../lib/serialClient';

// Client creation
export const serialClientCreating = (): Action => ({
  type: actionTypes.SERIAL_CLIENT_CREATING
});

export const serialClientCreated = (client: SlacktronicSerialClient): Action => ({
  type: actionTypes.SERIAL_CLIENT_CREATED,
  client
});
