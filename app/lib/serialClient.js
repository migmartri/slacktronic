// @flow
import SerialPort from 'serialport';
import * as serialActions from '../actions/serial';
import type { Dispatch, Action, ThunkAction } from '../actions/common';

export type serialPortType = {
  comName: string,
  manufacturer: string,
  serialNumber: string,
  pnpId: string,
  locationId: ?string,
  vendorId: string,
  productId: string
};

// TODO(miguel) Remove client info
class SlacktronicSerialClient {
  dispatch: Dispatch
  baudRate = 57600
  port: serialPortType
  serialPortInstance: ?SerialPort

  static async arduinoConnectedPorts() {
    const ports = await SerialPort.list();
    let arduinoPorts: serialPortType[] = [];

    arduinoPorts = ports.filter(val => {
      // Get compatible ports -> Match only ports that Arduino cares about
      // ttyUSB#, cu.usbmodem#, COM#
      const rport = /usb|acm|^com/i;
      return rport.test(val.comName);
    });
    return arduinoPorts;
  }

  // create a client including its validation state
  static async connect(dispatch?: Dispatch) {
    const client = new SlacktronicSerialClient(dispatch);
    client.dispatchIfNeeded(serialActions.serialClientCreating());

    const arduinoPorts = await SlacktronicSerialClient.arduinoConnectedPorts();
    if (arduinoPorts.length) {
      // Connect to the first one
      // TODO(miguel) Allow configuration
      const [firstPort] = arduinoPorts;
      client.port = firstPort;
    }

    const portInstance = new SerialPort(client.port.comName, {
      baudRate: 57600
    });

    // Store the proper port
    client.serialPortInstance = portInstance;
    client.dispatchIfNeeded(serialActions.serialClientCreated(client));

    return client;
  }

  // create a client including its validation state
  constructor(dispatch?: Dispatch) {
    if (dispatch) this.dispatch = dispatch;
  }

  dispatchIfNeeded(action: Action | ThunkAction) {
    return this.dispatch ? this.dispatch(action) : console.log(action);
  }
}

export default SlacktronicSerialClient;
