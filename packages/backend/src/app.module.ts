import { ContextInterceptor } from '@libs/application/interceptors/context-interceptor';
import { ExceptionInterceptor } from '@libs/application/interceptors/exception.interceptor';
import { AuthModule } from '@modules/auth/auth.module';
import { PaymentModule } from '@modules/buy__payment/module';
import { ChatModule } from '@modules/chat/chat.module';
import { CustomerModule } from '@modules/customer/customer.module';
import { DeliveryProfileModule } from '@modules/delivery-profile/delivery-profile.module';
import { OrderModule } from '@modules/order/order.module';
import { ProductModule } from '@modules/product/product.module';
import { ShopifyAuthModule } from '@modules/shopify-auth/shopify-auth.module';
import { HealthCheckModule } from '@modules/__health-check/health-check.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestContextModule } from 'nestjs-request-context';
import { BaseModule } from './base.module';
import { PriceOfferModule } from '@modules/price-offer/price-offer.module';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
];

const applicationModules = [
  AuthModule,
  CustomerModule,
  OrderModule,
  DeliveryProfileModule,
  HealthCheckModule,
  ShopifyAuthModule,
  ChatModule,
  ProductModule,
  PaymentModule,
  PriceOfferModule,
];

@Module({
  imports: [
    RequestContextModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BaseModule,
    ...applicationModules,
  ],
  controllers: [],
  providers: [...interceptors],
})
export class AppModule {}
