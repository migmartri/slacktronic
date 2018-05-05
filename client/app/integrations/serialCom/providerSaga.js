import { take, call, put } from 'redux-saga/effects';
import SerialPort from 'serialport';
import SlacktronicSerialClient from '../../lib/serialClient';
import actionTypes from '../../actions/actionTypes';
import * as providersActions from '../../actions/providers';
import * as serialActions from '../../actions/serial';

function* arduinoConnectedPorts() {
  const ports = yield call(SerialPort.list);
  let arduinoPorts: serialPortType[] = [];

  arduinoPorts = ports.filter(val => {
    // Get compatible ports -> Match only ports that Arduino cares about
    // ttyUSB#, cu.usbmodem#, COM#
    const rport = /usb|acm|^com/i;
    return rport.test(val.comName);
  });
  return arduinoPorts;
}

function* initializeAndValidateClient() {
  const client = new SlacktronicSerialClient();
  yield put(serialActions.serialClientCreating());

  const arduinoPorts = yield call(arduinoConnectedPorts);
  if (arduinoPorts.length) {
    // Connect to the first one
    // TODO(miguel) Allow configuration
    const [firstPort] = arduinoPorts;
    client.port = firstPort;
  }

  const portInstance = new SerialPort(client.port.comName, {
    baudRate: 57600
  });

  portInstance.on('error', (err) => {
    // TODO(dispatch error)
    console.log('Error in serial client:', err.message);
  });

  portInstance.on('close', (err) => {
    console.log('The serial port has been closed:', err.message);
  });

  // Store the proper port
  client.serialPortInstance = portInstance;
  // TODO(only use one dispatch)
  yield put(serialActions.serialClientCreated(client));

  return client;
}

function* clientInitializationFlow() {
  while (true) {
    const providerAction = yield take(actionTypes.PROVIDER_INITIALIZE);
    const { name } = providerAction;
    if (name !== 'serialCom') continue;

    try {
      const client = yield call(initializeAndValidateClient);
      const data = {
        options: { client },
        status: 'ready',
        name: 'serialCom',
      };

      yield put(providersActions.initialized(data));
    } catch (err) {
      yield put(providersActions.initializationError(name, err));
    }
  }
}

export default clientInitializationFlow;
