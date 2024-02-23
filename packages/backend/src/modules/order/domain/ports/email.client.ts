import { CustomerType } from '@libs/domain/prisma.main.client';

export type GenericShippingTemplateData = {
  product: {
    name: string;
    price: string;
  };
  vendor: {
    firstName: string;
  };
};

export type VendorShippingTemplateData = GenericShippingTemplateData & {
  product: {
    referenceId: string;
    variantTitle: string;
    handle: string;
  };
  customer: {
    address: string;
    phone: string;
    fullName: string;
  };
  order: {
    name: string;
    shipmentEmail: string;
  };
};

export type HandDeliveryVendorTemplateData = GenericShippingTemplateData & {
  product: {
    variantTitle: string;
  };
  order: {
    createdAt: string;
  };
  chatConversationLink: string;
};

export type HandDeliveryCustomerTemplateData = {
  product: {
    name: string;
    price: string;
    variantTitle: string;
  };
  order: {
    createdAt: string;
  };
  customer: {
    firstName: string;
  };
  chatConversationLink: string;
};

export type ValidatedHandDeliveryOrderData = {
  firstName: string;
  productName: string;
};

export type BarooderPaymentProcedureData = {
  firstName: string;
  productName: string;
  paymentMethod: string;
};

export type UnfulfilledOrderLineTemplateData = {
  firstName: string;
  productName: string;
  orderName: string;
  paidAt: string;
};

export type RefundedOrderCustomerTemplateData = {
  firstName: string;
  orderName: string;
  orderAmountInCents: number;
};

export type RefundedOrderVendorTemplateData = {
  firstName: string;
  orderName: string;
  productName: string;
  paidAt: string;
};

export abstract class IEmailClient {
  abstract sendEmailWithManualPaymentProcedure(
    toEmail: string,
    toName: string,
    templateData: BarooderPaymentProcedureData,
  ): Promise<void>;

  abstract sendNewOrderEmailToVendor(
    toEmail: string,
    toName: string,
    templateData: GenericShippingTemplateData,
  ): Promise<void>;

  abstract sendNewOrderEmailToVendorWithOwnShipping(
    toEmail: string,
    toName: string,
    templateData: VendorShippingTemplateData,
  ): Promise<void>;

  abstract sendHandDeliveryVendorEmail(
    toEmail: string,
    toName: string,
    templateData: HandDeliveryVendorTemplateData,
  ): Promise<void>;

  abstract sendHandDeliveryCustomerEmail(
    toEmail: string,
    toName: string,
    templateData: HandDeliveryCustomerTemplateData,
  ): Promise<void>;

  abstract sendValidatedHandDeliveryVendorEmail(
    toEmail: string,
    toName: string,
    templateData: ValidatedHandDeliveryOrderData,
  ): Promise<void>;

  abstract sendUnfulfilledOrderLineEmail(
    type: CustomerType,
    toEmail: string,
    toName: string,
    numberOfDays: number,
    templateData: UnfulfilledOrderLineTemplateData,
  ): Promise<void>;

  abstract sendValidatedHandDeliveryCustomerEmail(
    toEmail: string,
    toName: string,
    templateData: ValidatedHandDeliveryOrderData,
  ): Promise<void>;

  abstract sendRefundedOrderCustomerEmail(
    toEmail: string,
    toName: string,
    templateData: RefundedOrderCustomerTemplateData,
  ): Promise<void>;

  abstract sendRefundedOrderVendorEmail(
    toEmail: string,
    toName: string,
    templateData: RefundedOrderVendorTemplateData,
  ): Promise<void>;

  abstract sendAskFeedbackEmail(toEmail: string, toName: string): Promise<void>;
}
