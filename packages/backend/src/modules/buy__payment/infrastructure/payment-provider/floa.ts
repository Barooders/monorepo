import envConfig from '@config/env/env.config';
import { PaymentSolutionCode } from '@libs/domain/prisma.main.client';
import { jsonStringify } from '@libs/helpers/json';
import { ConfigStoreService } from '@libs/infrastructure/config-store/config-store.service';
import {
  ConfigKeys,
  FloaConfig,
} from '@libs/infrastructure/config-store/types';
import {
  PaymentProvider,
  PaymentSolution,
  getPaymentConfig,
} from '@modules/buy__payment/domain/config';
import { IPaymentProvider } from '@modules/buy__payment/domain/ports/payment-provider.repository';
import {
  CartInfoType,
  CheckoutDetailsType,
  CustomerHistory,
  CustomerInfoType,
  EligibilityResponse,
} from '@modules/buy__payment/domain/types';
import { Injectable, Logger } from '@nestjs/common';
import { compact } from 'lodash';
import fetch, { RequestInit } from 'node-fetch';

type PaymentLinkDTO = {
  orderReference: string;
  invoiceId?: string;
  paymentUrls: {
    merchantBackUrl?: string;
    merchantNotifyUrl: string | null;
    merchantReturnUrl: string | null;
  };
  culture: string | null;
  freeText: string | null;
  orderRowsAmount: number | null;
  orderFeesAmount: number | null;
  orderDiscountAmount: number | null;
  orderShippingCost: number | null;
};

type ProductEligibilityDTO = {
  presaleFolder: {
    shoppingCarts: {
      reference: string;
      rawAmount: number;
      productsCount: number;
      products: {
        rawAmount: number;
        categories: { name: string; parent: string }[];
        shipping: { method: string };
      }[];
    }[];
    customer: {
      reference: string;
      firstName: string;
      lastName: string;
      email: string;
      birthDate: string;
      birthZipCode: string;
      civility: 'Mr' | 'Ms';
      cellPhoneNumber: string;
      homeAddress: {
        line1: string;
        zipCode: string;
        city: string;
        countryCode: string;
      };
      history?: {
        firstOrderDate: string | null;
        lastOrderDate: string | null;
      };
    };
    saleChannel: string;
    merchantSite: {
      notificationUrl: string;
      returnUrl: string;
      backUrl: string;
      homeUrl: string;
    };
  };
};

type EligiblityBaseType = {
  totalAmount: number;
  requestId: number;
  purchaseType: 'Cb3X' | 'Cb4X' | 'Lcc10X';
  merchantSiteId: number;
  paymentOptionReference: string;
};

type EligibilityKOType = EligiblityBaseType & {
  hasAgreement: false;
};

type EligibilityOKType = EligiblityBaseType & {
  token: string;
  hasAgreement: true;
  links: {
    href: string;
    rel:
      | 'create-payment-session'
      | 'pay-without-3d'
      | 'check-3d-enrollment'
      | 'get-eligibility-installment-plan'
      | 'continue-long-term-consumer-credit-process';
    method: 'POST' | 'GET';
  }[];
};

type EligiblityType = EligibilityOKType | EligibilityKOType;

type RawEligibilityResponse = {
  eligibilities: EligiblityType[];
};

const TWO_DAYS = 48 * 3600 * 1000;
const ID_SIZE_LIMIT = 29;

@Injectable()
export class FloaPaymentProvider implements IPaymentProvider {
  private readonly logger: Logger = new Logger(FloaPaymentProvider.name);
  constructor(private configStore: ConfigStoreService) {}

  async checkEligibility(
    customerInfo: CustomerInfoType,
    customerHistory: CustomerHistory,
    cartInfo: CartInfoType,
    payment: { id: string; paymentSolutionCode: PaymentSolution },
    returnUrl: string,
    notifyUrl: string,
  ): Promise<EligibilityResponse[]> {
    const payload: ProductEligibilityDTO = {
      presaleFolder: {
        customer: {
          homeAddress: customerInfo.address,
          birthDate: customerInfo.birthDate,
          birthZipCode: customerInfo.birthZipCode,
          cellPhoneNumber: customerInfo.phoneNumber,
          civility: customerInfo.civility,
          email: customerInfo.email,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          reference: customerInfo.id.slice(0, ID_SIZE_LIMIT),
          history: customerHistory,
        },
        saleChannel: 'Desktop',
        shoppingCarts: [
          {
            rawAmount: cartInfo.totalAmount.amountInCents,
            productsCount: cartInfo.productsCount,
            reference: payment.id.slice(0, ID_SIZE_LIMIT),
            products: cartInfo.products.map((product) => ({
              categories: [{ name: product.productType, parent: '' }],
              rawAmount: product.amount.amountInCents,
              shipping: { method: product.shipping },
            })),
          },
        ],
        merchantSite: {
          backUrl: returnUrl,
          homeUrl: returnUrl,
          notificationUrl: notifyUrl,
          returnUrl,
        },
      },
    };

    const merchantSiteId = this.getMerchantSiteId(payment.paymentSolutionCode);

    const queryParams = new URLSearchParams({
      merchantId: this.getFloaConfig().merchantId.toString(),
      merchantSiteIds: merchantSiteId.toString(),
    });

    const response = await this.fetchEligibilityApi<RawEligibilityResponse>(
      `/api/v4.0/eligibilities?${queryParams.toString()}`,
      {
        method: 'POST',
        body: jsonStringify(payload),
      },
    );

    const eligibilityResult = compact(
      response.eligibilities.map((eligibility) => {
        const paymentSolutionCode = getPaymentConfig(
          PaymentProvider.FLOA,
          eligibility.paymentOptionReference,
        )?.code;
        if (!paymentSolutionCode) return null;

        return {
          isEligible: eligibility.hasAgreement,
          paymentSolutionCode,
          token: eligibility.hasAgreement ? eligibility.token : undefined,
          paymentId: payment.id,
          paymentUrl: eligibility.hasAgreement
            ? eligibility.links.find(
                ({ rel }) =>
                  rel === 'continue-long-term-consumer-credit-process',
              )?.href
            : undefined,
        };
      }),
    );

    if (eligibilityResult.length === 0) {
      throw new Error(
        `No result for eligibility, here is the payload / raw answer from API: Payload - ${jsonStringify(
          payload,
          2,
        )} | Answer - ${jsonStringify(response, 2)}`,
      );
    }

    return eligibilityResult;
  }

  async createPaymentLink(
    token: string,
    returnUrl: string,
    notifyUrl: string,
    paymentSolutionCode: PaymentSolution,
    paymentId: string,
    cartDetails: CheckoutDetailsType | null,
  ): Promise<string> {
    const payload: PaymentLinkDTO = {
      orderReference: paymentId.slice(0, ID_SIZE_LIMIT),
      paymentUrls: {
        merchantReturnUrl: notifyUrl,
        merchantNotifyUrl: notifyUrl,
      },
      culture: null,
      freeText: null,
      orderDiscountAmount: cartDetails?.discountAmount?.amountInCents ?? 0,
      orderFeesAmount: null,
      orderRowsAmount: cartDetails?.productsAmount.amountInCents ?? 0,
      orderShippingCost: cartDetails?.shippingAmount?.amountInCents ?? 0,
    };

    const merchantSiteId = this.getMerchantSiteId(paymentSolutionCode);

    const queryParams = new URLSearchParams({
      merchantId: this.getFloaConfig().merchantId.toString(),
      merchantSiteId: merchantSiteId.toString(),
      sendingTypes: 'Web',
    });

    const { paymentLinkUrl } = await this.fetchEligibilityApi<{
      paymentLinkUrl: string;
    }>(
      `/api/v4.0/eligibilities/${token}/payment-links/send?${queryParams.toString()}`,
      {
        method: 'POST',
        body: jsonStringify(payload),
      },
    );

    return paymentLinkUrl;
  }

  private async fetchPaymentApi<T>(path: string, config: RequestInit) {
    return await this.fetchFloa<T>(
      `${this.getFloaConfig().paymentBaseUrl}${path}`,
      config,
    );
  }

  private async fetchEligibilityApi<T>(path: string, config: RequestInit) {
    return await this.fetchFloa<T>(
      `${this.getFloaConfig().eligibilityBaseUrl}${path}`,
      config,
    );
  }

  private async fetchFloa<ResponseType>(url: string, config: RequestInit) {
    const token = await this.getUpToDateToken();

    return await this.fetchUrl<ResponseType>(url, {
      ...config,
      headers: {
        'Content-type': 'application/json',
        authToken: token,
      },
    });
  }

  private async fetchUrl<ResponseType>(
    url: string,
    config: RequestInit,
  ): Promise<ResponseType> {
    this.logger.debug(`Calling ${url} with config`, config);
    const result = await fetch(url, config);
    let response = null;
    try {
      response = await result.json();
    } catch (e) {}

    if (!result.ok || response?.statusCode >= 400)
      throw new Error(
        `HTTP error: ${result.status} with response ${jsonStringify(response)}`,
      );

    this.logger.debug(`Result from call is`, response);

    return response as ResponseType;
  }

  private async getUpToDateToken(): Promise<string> {
    const config = await this.configStore.getConfig<FloaConfig | null>(
      ConfigKeys.FLOA,
    );

    if (
      config &&
      config.token &&
      config.envName === this.getFloaConfig().envName &&
      config.expiringTimestamp &&
      config.expiringTimestamp > Date.now()
    )
      return config.token;

    const newToken = await this.fetchUrl<string>(
      `${this.getFloaConfig().paymentBaseUrl}/v1/auth/token`,
      {
        headers: {
          Authorization: this.getFloaConfig().apiKey,
        },
      },
    );

    await this.configStore.updateConfig(ConfigKeys.FLOA, {
      token: newToken,
      expiringTimestamp: Date.now() + TWO_DAYS,
      envName: this.getFloaConfig().envName,
    });

    return newToken;
  }

  private getFloaConfig() {
    return {
      envName: envConfig.envName,
      apiKey: envConfig.externalServices.floa.apiKey,
      eligibilityBaseUrl: envConfig.externalServices.floa.eligilityBaseUrl,
      paymentBaseUrl: envConfig.externalServices.floa.paymentgatewayBaseUrl,
      merchantId: 1667,
      merchantSiteIds: {
        [PaymentSolution.FLOA_10X]: 76682,
        [PaymentSolution.FLOA_4X]: 76686,
        [PaymentSolution.FLOA_3X]: 76684,
      },
    };
  }

  private getMerchantSiteId(paymentSolutionCode: PaymentSolutionCode): number {
    const floaConfig = this.getFloaConfig().merchantSiteIds as {
      [key: string]: number;
    };

    const merchantSiteId = floaConfig[paymentSolutionCode] ?? null;

    if (!merchantSiteId) {
      throw new Error(`Could not find a merchantId for ${paymentSolutionCode}`);
    }

    return merchantSiteId;
  }
}
