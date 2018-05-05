import { put, all, actionChannel, take, call, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import shortID from 'shortid';
import actionTypes from '../../../../actions/actionTypes';
import type { serialMessage } from '../../../../models/serialMessage';
import MessageStatus from '../../../../models/serialMessage';
import type SlacktronicSerialClient from '../../../../lib/serialClient';

const PROVIDER_NAME = 'serialCom';
const debug = require('debug')('slacktronic@actions.serialCom.sendMessage.saga');

let serialClient;

// Create message in the store
function* createMessage(payload: string) {
  const messageID = shortID.generate();
  const newMessage: serialMessage = {
    ID: messageID, status: MessageStatus.pending, payload
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
function* validateClient() {
  if (serialClient === null) {
    throw new Error('Serial client not ready');
  }

  const flushPort = () => (new Promise((resolve, reject) => (
    serialClient.serialPortInstance.flush((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    })
  )));

  // Wait until the flush has been completed, it also helps to detect
  // if the client is not ready
  yield call(flushPort);
  return serialClient;
}

// Send the message
function send(payload: string) {
  const { serialPortInstance } = serialClient;
  return new Promise((resolve, reject) => {
    serialPortInstance.write(payload, (werr) => {
      if (werr) {
        return reject(werr);
      }
      serialPortInstance.drain((derr) => {
        if (derr) {
          return reject(derr);
        }
        // Add some time between successful messages
        // TODO(miguel) Use ack and ready byte instead
        setTimeout(() => resolve(), 400);
      });
    });
  });
}

function* sendMessage(message: serialMessage) {
  // Retry the communication
  for (let i = 0; i < 5; i += 1) {
    try {
      yield call(validateClient);
      yield call(send, message.payload);
      yield call(updateMessageStatus, message.ID, { status: MessageStatus.sent });
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

function processReceivedActionPerform(action) {
  debug('ActionPerform received %o', action);
  const referencedSerialAction = registeredActions.find((a) => a.ID === action.data.ID);
  if (!referencedSerialAction) return;
  debug('SerialCom action found %o', referencedSerialAction);

  const { enabled } = action.data;
  const { char } = referencedSerialAction.options;
  const message = enabled ? char.toUpperCase() : char;
  debug('Enabled %s, character %s, message %s', enabled, char, message);
}

// function* watchSerialMessages() {
//   // 1- Create a channel for jobs enqueues
//   const messagesChan = yield actionChannel('TODO');
//   while (true) {
//     // 2- take from the channel
//     const { payload } = yield take(messagesChan);
// 
//     // 4- Enqueue the message in the store
//     const message = yield call(createMessage, payload);
//     // 4- Block until message is sent
//     yield call(sendMessage, message);
//   }
// }

const registeredActions = [];
function watchSerialComActionsCreation(action) {
  const { providerName } = action.data;

  if (providerName !== PROVIDER_NAME) return;
  debug('Received action creation', action);
  registeredActions.push(action.data);
  debug('Actions registered %o', registeredActions);
}

function* watchProviderInitialized() {
  while (true) {
    const action = yield take(actionTypes.PROVIDER_INITIALIZED);
    debug('Provider initialize received %o', action);
    const { name } = action.data;
    if (name !== PROVIDER_NAME) continue;
    debug('Provider initialize accepted %o', action);

    const { client } = action.data.options;
    serialClient = client;
    debug('SerialClient registered', client);
  }
}

function* rootSlackSaga() {
  yield all([
    call(watchProviderInitialized),
    takeEvery(actionTypes.ACTION_CREATE, watchSerialComActionsCreation),
    takeEvery(actionTypes.ACTION_PERFORM, processReceivedActionPerform)
  ]);
}

export default rootSlackSaga;
