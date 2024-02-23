export type ShipmentType = {
  address: string;
  address_2: string;
  allowed_shipping_methods: number[];
  barcode: string;
  city: string;
  company_name: string;
  country: string;
  created_at: string;
  currency: string;
  customs_invoice_nr: string;
  customs_shipment_type: number;
  email: string;
  external_order_id: string;
  external_shipment_id: string;
  house_number: string;
  integration: number;
  name: string;
  order_number: string;
  order_status: {
    id: string;
    message: string;
  };
  parcel_items: {
    description: string;
    hs_code: string;
    origin_country: string;
    product_id: string;
    properties: {
      size: string;
      colour: string;
    };
    quantity: number;
    sku: string;
    value: string;
    weight: string;
  }[];
  payment_status: {
    id: string;
    message: string;
  };
  postal_code: string;
  sender_address: number;
  shipment_uuid: string;
  shipping_method: number;
  shipping_method_checkout_name: string;
  telephone: string;
  to_post_number: string;
  to_service_point: number;
  to_state: string;
  total_order_value: string;
  updated_at: string;
  weight: string;
  checkout_payload: {
    sender_address_id: number;
    shipping_product: {
      code: string;
      name: string;
      selected_functionalities: {
        age_check: number;
        last_mile: string;
        first_mile: string;
        multicollo: true;
        form_factor: string;
        service_area: string;
        weekend_delivery: string;
        delivery_deadline: string;
        direct_contract_only: false;
      };
    };
    delivery_method_type: string;
    delivery_method_data: {
      delivery_date: string;
      formatted_delivery_date: string;
      parcel_handover_date: string;
    };
  };
  width: string;
  height: string;
  length: string;
  shipment_created_at: string;
  shipment_updated_at: string;
};

export type BasicParcelType = {
  name: string;
  company_name: string;
  address: string;
  house_number: string;
  city: string;
  postal_code: string;
  telephone: string;
  email: string;
  data: Record<string, string>;
  country: string;
  order_number: string;
  external_order_id: string;
  shipment: {
    id: number;
    name: string;
  };
  weight: string;
  total_order_value_currency: string;
  total_order_value: string;
  shipping_method_checkout_name: string;
  address_2?: string;
  to_post_number?: string;
  country_state?: string;
  sender_address?: number;
  customs_invoice_nr?: string;
  customs_shipment_type?: number;
  external_reference?: string;
  to_service_point?: number;
  total_insured_value?: number;
  shipment_uuid?: string;
  request_label_async?: boolean;
  apply_shipping_rules?: boolean;
  from_name?: string;
  from_company_name?: string;
  from_address_1?: string;
  from_address_2?: string;
  from_house_number?: string;
  from_city?: string;
  from_postal_code?: string;
  from_country?: string;
  from_telephone?: string;
  from_email?: string;
  from_vat_number?: string;
  from_eori_number?: string;
  from_inbound_vat_number?: string;
  from_inbound_eori_number?: string;
  from_ioss_number?: string;
  quantity: number;
  insured_value: number;
};

export type ParcelToCreate = BasicParcelType & {
  request_label: boolean;
};

export type FullParcelType = BasicParcelType & {
  id: number;
  contract: number;
  address_divided: {
    street: string;
    house_number: string;
  };
  date_created: string;
  date_updated: string;
  date_announced: string;
  tracking_number: string;
  label: {
    normal_printer: string[];
    label_printer: string;
  };
  documents: {
    type: string;
    size: string;
    link: string;
  }[];
  status: {
    id: number;
    message: string;
  };
  carrier: {
    code: string;
  };
  is_return: false;
  colli_uuid: string;
  collo_nr: number;
  collo_count: number;
  awb_tracking_number: null;
  box_number: null;
  length: null;
  width: null;
  height: null;
  tracking_url: string;
};

export type SendCloudWebhookEvent = { timestamp: number } & (
  | ParcelUpdateEvent
  | ReturnCreatedEvent
  | IntegrationConnectedEvent
);

type ParcelUpdateEvent = {
  action: 'parcel_status_changed';
  carrier_status_change_timestamp: number;
  parcel: FullParcelType;
};

type ReturnCreatedEvent = {
  action: 'return_created';
};

type IntegrationConnectedEvent = {
  action: 'integration_connected';
};
