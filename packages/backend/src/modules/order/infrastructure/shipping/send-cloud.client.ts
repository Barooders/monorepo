import envConfig from '@config/env/env.config';
import { IShippingClient } from '@modules/order/domain/ports/shipping.client';
import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { first } from 'lodash';
import { ShipmentNotFound } from './exceptions';
import { FullParcelType, ParcelToCreate, ShipmentType } from './types';

const SENDCLOUD_BASE_URL = 'https://panel.sendcloud.sc';

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

  async getShipmentFromOrderName(orderName: string) {
    const searchParams = new URLSearchParams({
      order_number: orderName,
    });
    const shipments = await fetchSendCloudApi<ShipmentResultType>(
      `/integrations/${
        envConfig.externalServices.sendCloud.shopifyIntegrationId
      }/shipments?${searchParams.toString()}`,
    );

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
