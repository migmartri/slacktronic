import { put, actionChannel, take, call, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import shortID from 'shortid';
import actionTypes from '../actions/actionTypes';
import type { serialMessage } from '../models/serialMessage';
import MessageStatus from '../models/serialMessage';
import type SlacktronicSerialClient from '../lib/serialClient';

const getSerialClient = state => state.serial.client;

// Create message in the store
function* createMessage(subscriptionID: string, payload: string) {
  const messageID = shortID.generate();
  const newMessage: serialMessage = {
    ID: messageID, status: MessageStatus.pending, payload, subscriptionID
  };

  yield put({
    type: actionTypes.SERIAL_MESSAGE_CREATE, data: newMessage
  });

  return newMessage;
}

// Update message in the store
function* updateMessageStatus(messageID: string, updates: object) {
  yield put({
    type: actionTypes.SERIAL_MESSAGE_UPDATE, ID: messageID, data: updates
  });
}

// Load serial client
function* loadSerialClient() {
  const serialClient: ?SlacktronicSerialClient = yield select(getSerialClient);
  if (serialClient === null) {
    throw new Error('Serial client not ready');
  }
  return serialClient;
}

// Send the message
function sendMessage(serialClient: SlacktronicSerialClient, payload: string) {
  const { serialPortInstance } = serialClient;
  serialPortInstance.write(payload, (err) => {
    if (err) {
      throw new Error(`Error writing to port: ${err.message}`);
    }
  });
}

function* createAndSendMessage(message: serialMessage) {
  // Retry the communication
  for (let i = 0; i < 5; i += 1) {
    try {
      const serialClient = yield call(loadSerialClient);
      yield call(sendMessage, serialClient, message.payload);
      yield call(updateMessageStatus, message.ID, { status: MessageStatus.sent });
      // Give some slack between messages
      yield delay(200);
      return;
    } catch (err) {
      if (i < 4) {
        console.warn(`${err.message}, retrying...`);
        yield delay(500);
      } else {
        // attempts failed after 5 attempts
        console.error(err);
        // Update the status of the message in the store
        yield call(
          updateMessageStatus,
          message.ID, { status: MessageStatus.error, errorMessage: err.message }
        );
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

    // 4- Enqueue the message in the store
    const message = yield call(createMessage, subscriptionID, payload);
    // 4- Block until message is sent
    yield call(createAndSendMessage, message);
  }
}

export default watchSerialMessages;
