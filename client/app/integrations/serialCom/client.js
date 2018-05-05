// @flow
import SerialPort from 'serialport';

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
}

export default SlacktronicSerialClient;
