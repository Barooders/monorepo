import { OrderConsoleModule } from '@modules/order/order.module';
import { ProVendorConsoleModule } from '@modules/pro-vendor/console.module';
import { IndexationConsoleModule } from '@modules/product/indexation.module';
import { SearchAlertConsoleModule } from '@modules/search-alert/module';
import { Module } from '@nestjs/common';
import { ConsoleModule as NestConsoleModule } from 'nestjs-console';
import { BaseModule } from './base.module';
import { ProductConsoleModule } from '@modules/product/product.module';

const consoleModules = [
  ProVendorConsoleModule,
  SearchAlertConsoleModule,
  OrderConsoleModule,
  ProductConsoleModule,
  IndexationConsoleModule,
];

@Module({
  imports: [NestConsoleModule, BaseModule, ...consoleModules],
})
export class ConsoleModule {}
