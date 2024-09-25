import envConfig from '@config/env/env.config';
import { fromCents } from '@libs/helpers/currency';
import { IShippingClient } from '@modules/order/domain/ports/shipping.client';
import { OrderToStore } from '@modules/order/domain/ports/types';
import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import { first } from 'lodash';
import { ShipmentNotFound } from './exceptions';
import { FullParcelType, ParcelToCreate, ShipmentType } from './types';

const SENDCLOUD_BASE_URL = 'https://panel.sendcloud.sc';

const shipmentEndpoint = `/integrations/${envConfig.externalServices.sendCloud.shopifyIntegrationId}/shipments`;

const fetchSendCloudFullUrl = async <ResponseType = unknown>(
  fullUrl: string,
  options: AxiosRequestConfig = {},
) => {
  const response = await axios<ResponseType>({
    url: fullUrl,
    ...options,
    headers: {
      authorization: `Basic ${envConfig.externalServices.sendCloud.basicToken}`,
      ...options.headers,
    },
  });

  return response;
};

const fetchSendCloudApi = async <ResponseType = unknown>(
  path: string,
  options: AxiosRequestConfig = {},
): Promise<ResponseType> => {
  const response = await fetchSendCloudFullUrl<ResponseType>(
    `${SENDCLOUD_BASE_URL}/api/v2${path}`,
    {
      ...options,
      headers: {
        ...options.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
};

const fetchSendCloudDocuments = async (url: string): Promise<Buffer> => {
  const response = await fetchSendCloudFullUrl<Buffer>(url, {
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/pdf',
    },
  });

  return Buffer.from(response.data);
};

type ShipmentResultType = {
  next: string;
  previous: string;
  results: ShipmentType[];
};

@Injectable()
export class SendCloudClient implements IShippingClient {
  private readonly logger: Logger = new Logger(SendCloudClient.name);

  async getParcelFromOrderName(
    orderName: string,
  ): Promise<FullParcelType | null> {
    const searchParams = new URLSearchParams({
      order_number: orderName,
    });
    const { parcels } = await fetchSendCloudApi<{ parcels: FullParcelType[] }>(
      `/parcels?${searchParams.toString()}`,
    );

    return (first(parcels) ?? null) as FullParcelType | null;
  }

  async createShipmentFromOrder(order: OrderToStore) {
    await fetchSendCloudApi<ShipmentResultType>(shipmentEndpoint, {
      method: 'POST',
      data: [
        {
          address: order.order.shippingAddressAddress1,
          address_2: order.order.shippingAddressAddress2,
          city: order.order.shippingAddressCity,
          company_name: order.order.shippingAddressCompany,
          country: order.order.shippingAddressCountry,
          created_at: dayjs().toISOString(),
          currency: 'EUR',
          customs_invoice_nr: '',
          customs_shipment_type: 0,
          email: order.order.customerEmail,
          external_order_id: order.order.shopifyId,
          external_shipment_id: null, // The shopify extension gives a value to this
          house_number: '',
          name: order.order.customerId,
          order_number: order.order.name,
          order_status: { id: 'created', message: 'Created' },
          parcel_items: order.orderLines
            .filter((orderLine) => !!orderLine.shippingSolution)
            .map((orderLine) => ({
              description: orderLine.name,
              hs_code: '',
              origin_country: '',
              product_id: orderLine.productVariantId,
              properties: {},
              quantity: orderLine.quantity,
              sku: '',
              value: fromCents(orderLine.priceInCents).toFixed(2),
              weight: null,
              mid_code: null,
              material_content: null,
              intended_use: null,
            })),
          payment_status: { id: 'paid', message: 'Paid' },
          postal_code: order.order.shippingAddressZip,
          shipping_method: null, // TODO: Fill this value
          shipping_method_checkout_name: 'string', // TODO: Fill this value
          telephone: order.order.shippingAddressPhone,
          to_post_number: '',
          to_service_point: 0, // TODO: Fill this value
          to_state: null,
          total_order_value: fromCents(order.order.totalPriceInCents).toFixed(
            2,
          ),
          weight: null,
          width: null,
          height: null,
          length: null,
          customs_details: null,
        },
      ],
    });
  }

  async getShipmentFromOrderName(orderName: string) {
    const searchParams = new URLSearchParams({
      order_number: orderName,
    });
    const shipments = await fetchSendCloudApi<ShipmentResultType>(
      `${shipmentEndpoint}?${searchParams.toString()}`,
    );

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!shipments.results || shipments.results.length === 0) {
      throw new ShipmentNotFound(orderName);
    }

    return first(shipments.results) as ShipmentType;
  }

  async createShippingLabelFromOrderName(
    orderName: string,
  ): Promise<FullParcelType> {
    const shipment = await this.getShipmentFromOrderName(orderName);
    const parcelToCreate: ParcelToCreate = {
      address: shipment.address,
      city: shipment.city,
      company_name: shipment.company_name,
      country: shipment.country,
      email: shipment.email,
      house_number: shipment.house_number,
      insured_value: 0,
      name: shipment.name,
      order_number: shipment.order_number,
      postal_code: shipment.postal_code,
      external_order_id: shipment.external_order_id,
      quantity: 1,
      request_label: true,
      shipment: {
        id: shipment.shipping_method,
        name: shipment.shipping_method_checkout_name,
      },
      to_service_point: shipment.to_service_point,
      data: {},
      shipping_method_checkout_name: shipment.shipping_method_checkout_name,
      total_order_value: shipment.total_order_value,
      total_order_value_currency: shipment.currency,
      weight: shipment.weight,
      telephone: shipment.telephone,
    };

    const { parcel } = await fetchSendCloudApi<{ parcel: FullParcelType }>(
      `/parcels`,
      {
        method: 'POST',
        data: {
          parcel: parcelToCreate,
        },
      },
    );

    return parcel;
  }

  async getOrcreateShippingLabelStreamFromOrderName(
    orderName: string,
  ): Promise<Buffer> {
    const existingParcel = await this.getParcelFromOrderName(orderName);

    const parcel = existingParcel
      ? existingParcel
      : await this.createShippingLabelFromOrderName(orderName);

    const shippingLabelPdfContent = await fetchSendCloudDocuments(
      parcel.label.label_printer,
    );

    return shippingLabelPdfContent;
  }
}
