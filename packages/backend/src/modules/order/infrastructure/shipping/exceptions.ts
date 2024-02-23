import { ExceptionBase } from '@libs/domain/exceptions';

export class ShipmentNotFound extends ExceptionBase {
  constructor(orderName: string) {
    super(
      `Shipment not found (or more than one found) in Sendcloud for order ${orderName}`,
    );
  }

  readonly code = 'ORDER.SHIPMENT_NOT_IN_SENDCLOUD';
}
