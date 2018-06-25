import { put, all, take, call, takeEvery, actionChannel, fork, cancel, cancelled } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import shortID from 'shortid';
import actionTypes from '../../../../actions/actionTypes';
import Message from './message';
import type { serialMessage } from '../../../../models/serialMessage';
import MessageStatus from '../../../../models/serialMessage';
import { AVAILABLE_PROVIDERS } from '../../../index';

const debug = require('debug')('slacktronic@actions.serialCom.message.saga');

const registeredActions = [];
let serialClient: SlacktronicSerialClient;

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

// Validate serial client
function* validateClient() {
  if (!serialClient) {
    throw new Error('Serial client not ready');
  }

  debug('validating Client %o', serialClient);
  const flushPort = () => (new Promise((resolve, reject) => (
    serialClient.serialPortInstance.flush((err) => {
      if (err) {
        debug('Error validating client %o, err: %o', serialClient, err);
        return reject(err);
      }
      resolve();
    })
  )));

  // Wait until the flush has been completed, it also helps to detect
  // if the client is not ready
  yield call(flushPort);
  debug('client validated %o', serialClient);
  return serialClient;
}

// Send the message
function send(payload: string) {
  const { serialPortInstance } = serialClient;
  return new Promise((resolve, reject) => {
    debug('sending message "%s"', payload);
    serialPortInstance.write(payload, (werr) => {
      if (werr) {
        debug('error sending message "%s", err %o', payload, werr);
        return reject(werr);
      }
      serialPortInstance.drain((derr) => {
        if (derr) {
          debug('error draining port %o', werr);
          return reject(derr);
        }
        // Add some time between successful messages
        // TODO(miguel) Use ack and ready byte instead
        debug('message "%s" sent', payload);
        resolve();
      });
    });
  });
}

function* sendMessage(message: serialMessage) {
  // Retry the communication
  for (let i = 0; i < 5; i += 1) {
    try {
      // Add some delay between messages so they can get canceled
      yield delay(1000);
      yield call(validateClient);
      yield call(send, message.payload);
      yield call(updateMessageStatus, message.ID, { status: MessageStatus.sent });
      messagesQueue[message.payload] = null;
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
    } finally {
      if (yield cancelled()) {
        debug('Message send canceled %o', message.payload);
        yield call(
          updateMessageStatus,
          message.ID, { status: MessageStatus.abborted }
        );
      }
    }
  }
}

const messagesQueue = {}; // [[payload]: [task]]

function* watchReceivedActionPerform(action) {
  debug('ActionPerform received %o', action);
  const referencedSerialAction = registeredActions.find((a) => a.ID === action.data.ID);
  if (!referencedSerialAction) return;
  debug('SerialCom action found %o', referencedSerialAction);

  const { enabled } = action.data;

  // Initialize a message instance to extract its payload
  const messageInstance = new Message(referencedSerialAction.options);
  let { payload } = messageInstance;

  payload = enabled ? payload.toUpperCase() : payload;
  // Store the message in the store
  const message = yield call(createMessage, payload);
  // Block until message is sent
  const task = yield fork(sendMessage, message);
  // If there is a pending message with the opposite payload we cancel it
  // We want to cancel for example A -> a, so we do not send A
  // In practice this is a debounce method but canceling each other based on the payload
  const oppositeTask = messagesQueue[payload.toUpperCase()];
  if (oppositeTask) {
    debug('Opposite pending message to be sent found %o, canceling...', oppositeTask);
    yield cancel(oppositeTask);
    messagesQueue[payload.toUpperCase()] = null;
  } else {
    messagesQueue[payload] = task;
  }
}

function watchSerialComActionsCreation(action) {
  const { providerName } = action.data;

  if (providerName !== AVAILABLE_PROVIDERS.serialCom) return;
  debug('Received action creation', action);
  registeredActions.push(action.data);
}

function watchSerialComActionsDeletion(action) {
  debug('Received action deletion', action);
  const { ID: actionID } = action.data;

  const indexToDelete = registeredActions.findIndex(t => (
    t.ID === actionID
  ));

  if (indexToDelete !== -1) {
    registeredActions.splice(indexToDelete, 1);
    debug('registeredActions updated after deletion %o', registeredActions);
  }
}

function* watchProviderInitialized() {
  while (true) {
    const action = yield take(actionTypes.PROVIDER_INITIALIZED);
    debug('Provider initialize received %o', action);
    const { name } = action.data;
    if (name !== AVAILABLE_PROVIDERS.serialCom) continue;
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
    takeEvery(actionTypes.ACTION_DELETE, watchSerialComActionsDeletion),
    takeEvery(actionTypes.ACTION_PERFORM, watchReceivedActionPerform),
  ]);
}

export default rootSlackSaga;
