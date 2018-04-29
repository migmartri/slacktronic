import { put, actionChannel, take, call, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import shortID from 'shortid';
import actionTypes from '../actions/actionTypes';
import type { serialMessage } from '../models/serialMessage';
import MessageStatus from '../models/serialMessage';
import type SlacktronicSerialClient from '../lib/serialClient';

const getSerialClient = state => state.serial.client;

function* updateMessageStatus(messageID: string, updates: object) {
  yield put({
    type: actionTypes.SERIAL_MESSAGE_UPDATE, ID: messageID, data: updates
  });
}

function* sendMessage(subscriptionID: string, payload: string) {
  const messageID = shortID.generate();
  const newMessage: serialMessage = {
    ID: messageID, status: MessageStatus.pending, payload, subscriptionID
  };

  yield put({
    type: actionTypes.SERIAL_MESSAGE_CREATE, data: newMessage
  });

  // Retry the communication
  for (let i = 0; i < 5; i += 1) {
    try {
      const serialClient: ?SlacktronicSerialClient = yield select(getSerialClient);
      if (serialClient === null) {
        console.warn('Serial client not found, retrying...');
        throw new Error('Serial client not ready');
      }
      return serialClient;
    } catch (err) {
      if (i < 4) {
        yield delay(500);
      } else {
        // attempts failed after 5 attempts
        console.error(err);
        // Update the status of the message in the store
        yield updateMessageStatus(messageID, { status: MessageStatus.error, errorMessage: err.message });
      }
    }
  }
}

function* watchSerialMessages() {
  // 1- Create a channel for jobs enqueues
  const messagesChan = yield actionChannel(actionTypes.SERIAL_MESSAGE_ENQUEUE);
  while (true) {
    // 2- take from the channel
    const { subscriptionID, payload } = yield take(messagesChan);

    // 3- Block until message is sent
    yield call(sendMessage, subscriptionID, payload);
  }
}

export default watchSerialMessages;
