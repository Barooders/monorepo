import { CustomerType } from '@libs/domain/prisma.main.client';
import {
  BAROODERS_OPERATIONS_RECIPIENT,
  BAROODERS_SUPPORT_RECIPIENT,
  sendEmailFromTemplate,
} from '@libs/infrastructure/send-grid/send-grid.base.client';
import {
  BarooderPaymentProcedureData,
  GenericShippingTemplateData,
  GeodisDeliveryTemplateData,
  HandDeliveryCustomerTemplateData,
  HandDeliveryVendorTemplateData,
  IEmailClient,
  RefundedOrderCustomerTemplateData,
  RefundedOrderVendorTemplateData,
  UnfulfilledOrderLineTemplateData,
  ValidatedHandDeliveryOrderData,
  VendorShippingTemplateData,
} from '@modules/order/domain/ports/email.client';
import { Injectable } from '@nestjs/common';

const GENERIC_SHIPPING_TEMPLATE_ID = 'd-5d628ffeb5b644c09b4551958fc3001e';
const GEODIS_SHIPPING_TEMPLATE_ID = 'd-055dbe8e84af48dabe772445c6758b7a';
const VENDOR_SHIPPING_TEMPLATE_ID = 'd-881d8500c68a4210871da5b9ec954c04';
const HAND_DELIVERY_VENDOR_TEMPLATE_ID = 'd-dd1b2964a13348fdb423110e52dc5d4c';
const HAND_DELIVERY_CUSTOMER_TEMPLATE_ID = 'd-3155e7d88bcd4356bf8621b52ce1fc2a';
const VALIDATED_HAND_DELIVERY_CUSTOMER_TEMPLATE_ID =
  'd-770e86b39acc4ceaa6e03bdf8fb756c5';
const VALIDATED_HAND_DELIVERY_VENDOR_TEMPLATE_ID =
  'd-144e48b56dd94b3eb43cfe4b77881628';
const MANUAL_PAYMENT_TEMPLATE_ID = 'd-9d7f787e6f084da3a3a9c1bb3eca1833';
const REFUNDED_ORDER_VENDOR_TEMPLATE_ID = 'd-3efb671e40814cb681c88659e90d9bdf';
const REFUNDED_ORDER_CUSTOMER_TEMPLATE_ID =
  'd-1fc061e19a204af7ad854305edac9757';
const FEEDBACK_TEMPLATE_ID = 'd-247cc76641ca4acda3addb367b1af66c';

const getUnfilledOrderLineTemplateId = (
  type: CustomerType,
  numberOfDays: number,
) => {
  switch (`${type}-${numberOfDays}`) {
    case `${CustomerType.buyer}-2`:
      return 'd-e5c0785b26d944ff9a19a6adfa145caf';
    case `${CustomerType.buyer}-5`:
      return 'd-dcd471d40c394ec69f06239c27c0d3d7';
    case `${CustomerType.buyer}-8`:
      return 'd-aebe530b5d4c4a108b5e5bfe00a2dfdc';
    case `${CustomerType.seller}-2`:
      return 'd-d82071ba63d245bcb8f00cf6563e21ca';
    case `${CustomerType.seller}-5`:
      return 'd-42058ffb1e07497c9a7f1b8845436a6d';
    case `${CustomerType.seller}-8`:
      return 'd-af0b9435b8894fc99bbf81f6c529e5f4';
    default:
      throw new Error(
        `No template found for type: ${type} and numberOfDays: ${numberOfDays}`,
      );
  }
};

@Injectable()
export class SendGridClient implements IEmailClient {
  async sendAskFeedbackEmail(toEmail: string, toName: string): Promise<void> {
    await sendEmailFromTemplate(
      [
        {
          email: toEmail,
          name: toName,
        },
      ],
      FEEDBACK_TEMPLATE_ID,
      {},
    );
  }

  async sendUnfulfilledOrderLineEmail(
    type: CustomerType,
    toEmail: string,
    toName: string,
    numberOfDays: number,
    {
      firstName,
      productName,
      orderName,
      paidAt,
    }: UnfulfilledOrderLineTemplateData,
  ) {
    await sendEmailFromTemplate(
      [
        {
          email: toEmail,
          name: toName,
        },
      ],
      getUnfilledOrderLineTemplateId(type, numberOfDays),
      {
        first_name: firstName,
        product_name: productName,
        order_id: orderName,
        paid_at: paidAt,
      },
    );
  }

  async sendValidatedHandDeliveryVendorEmail(
    toEmail: string,
    toName: string,
    { firstName, productName }: ValidatedHandDeliveryOrderData,
  ): Promise<void> {
    await sendEmailFromTemplate(
      [
        {
          email: toEmail,
          name: toName,
        },
      ],
      VALIDATED_HAND_DELIVERY_VENDOR_TEMPLATE_ID,
      {
        first_name: firstName,
        product_title: productName,
      },
    );
  }

  async sendValidatedHandDeliveryCustomerEmail(
    toEmail: string,
    toName: string,
    { firstName, productName }: ValidatedHandDeliveryOrderData,
  ): Promise<void> {
    await sendEmailFromTemplate(
      [
        {
          email: toEmail,
          name: toName,
        },
      ],
      VALIDATED_HAND_DELIVERY_CUSTOMER_TEMPLATE_ID,
      {
        first_name: firstName,
        product_title: productName,
      },
    );
  }

  async sendRefundedOrderCustomerEmail(
    toEmail: string,
    toName: string,
    {
      firstName,
      orderAmountInCents,
      orderName,
    }: RefundedOrderCustomerTemplateData,
  ): Promise<void> {
    await sendEmailFromTemplate(
      [
        {
          email: toEmail,
          name: toName,
        },
      ],
      REFUNDED_ORDER_CUSTOMER_TEMPLATE_ID,
      {
        first_name: firstName,
        order_id: orderName,
        order_amount: (orderAmountInCents / 100).toFixed(2),
      },
    );
  }

  async sendRefundedOrderVendorEmail(
    toEmail: string,
    toName: string,
    {
      firstName,
      productName,
      orderName,
      paidAt,
    }: RefundedOrderVendorTemplateData,
  ): Promise<void> {
    await sendEmailFromTemplate(
      [
        {
          email: toEmail,
          name: toName,
        },
      ],
      REFUNDED_ORDER_VENDOR_TEMPLATE_ID,
      {
        first_name: firstName,
        product_name: productName,
        order_id: orderName,
        paid_at: paidAt,
      },
    );
  }

  async sendNewOrderEmailToVendor(
    toEmail: string,
    toName: string,
    {
      product: { name, price },
      vendor: { firstName },
    }: GenericShippingTemplateData,
  ): Promise<void> {
    await sendEmailFromTemplate(
      [
        {
          email: toEmail,
          name: toName,
        },
      ],
      GENERIC_SHIPPING_TEMPLATE_ID,
      {
        first_name: firstName,
        product_name: name,
        product_price: price,
      },
      BAROODERS_SUPPORT_RECIPIENT,
    );
  }

  async sendNewOrderEmailToVendorWithGeodisShipping(
    toEmail: string,
    toName: string,
    {
      product,
      vendor,
      order,
      customer,
      hasPreviousBikeOrderWithGeodisShipping,
    }: GeodisDeliveryTemplateData,
  ): Promise<void> {
    const metadata = {
      order_name: order.name,
      variant_title: product.variantTitle,
      first_name: vendor.firstName,
      product_name: product.name,
      product_reference: product.referenceId,
      product_price: product.price,
      product_handle: product.handle, // Why ?
      customer_name: customer.fullName,
      customer_address: customer.address,
      shipment_email: order.shipmentEmail,
      client_phone: customer.phone,
      has_previous_bike_order_with_geodis_shipping:
        hasPreviousBikeOrderWithGeodisShipping,
    };

    await sendEmailFromTemplate(
      [
        {
          email: toEmail,
          name: toName,
        },
      ],
      GEODIS_SHIPPING_TEMPLATE_ID,
      metadata,
      BAROODERS_SUPPORT_RECIPIENT,
    );
  }

  async sendNewOrderEmailToVendorWithOwnShipping(
    toEmail: string,
    toName: string,
    {
      product: { name, price, referenceId, variantTitle, handle },
      customer: { address, phone, fullName },
      order: { name: orderName, shipmentEmail },
      vendor: { firstName },
    }: VendorShippingTemplateData,
  ): Promise<void> {
    const vendorRecipient = {
      email: toEmail,
      name: toName,
    };

    await sendEmailFromTemplate(
      [vendorRecipient],
      VENDOR_SHIPPING_TEMPLATE_ID,
      {
        first_name: firstName,
        product_name: name,
        product_price: price,
        variant_title: variantTitle,
        product_reference: referenceId,
        product_handle: handle,
        customer_address: address,
        client_phone: phone,
        customer_name: fullName,
        order_name: orderName,
        shipment_email: shipmentEmail,
      },
      BAROODERS_OPERATIONS_RECIPIENT,
    );
  }

  async sendHandDeliveryVendorEmail(
    toEmail: string,
    toName: string,
    {
      product: { price, variantTitle },
      order: { createdAt },
      vendor: { firstName },
      chatConversationLink,
    }: HandDeliveryVendorTemplateData,
  ): Promise<void> {
    await sendEmailFromTemplate(
      [
        {
          email: toEmail,
          name: toName,
        },
      ],
      HAND_DELIVERY_VENDOR_TEMPLATE_ID,
      {
        first_name: firstName,
        product_name: variantTitle,
        product_price: price,
        variant_title: variantTitle,
        order_date: createdAt,
        chat_conversation_link: chatConversationLink,
      },
    );
  }

  async sendHandDeliveryCustomerEmail(
    toEmail: string,
    toName: string,
    {
      product: { price, variantTitle },
      order: { createdAt },
      customer: { firstName },
      chatConversationLink,
    }: HandDeliveryCustomerTemplateData,
  ): Promise<void> {
    await sendEmailFromTemplate(
      [
        {
          email: toEmail,
          name: toName,
        },
      ],
      HAND_DELIVERY_CUSTOMER_TEMPLATE_ID,
      {
        first_name: firstName,
        product_name: variantTitle,
        product_price: price,
        variant_title: variantTitle,
        order_date: createdAt,
        chat_conversation_link: chatConversationLink,
      },
    );
  }

  async sendEmailWithManualPaymentProcedure(
    toEmail: string,
    toName: string,
    { productName, firstName, paymentMethod }: BarooderPaymentProcedureData,
  ): Promise<void> {
    await sendEmailFromTemplate(
      [
        {
          email: toEmail,
          name: toName,
        },
      ],
      MANUAL_PAYMENT_TEMPLATE_ID,
      {
        first_name: firstName,
        product_name: productName,
        payment_method: paymentMethod,
      },
    );
  }
}
