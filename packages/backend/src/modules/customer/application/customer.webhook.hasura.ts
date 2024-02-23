import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { routesV1 } from '@config/routes.config';
import { CustomerService } from '../domain/customer.service';
import { SignupEventPayload } from './types';

@Controller(routesV1.version)
export class CustomerWebhooksHasuraController {
  private readonly logger = new Logger(CustomerWebhooksHasuraController.name);

  constructor(protected readonly customerService: CustomerService) {}

  @Post(routesV1.customer.signupHasuraEvent)
  @UseGuards(AuthGuard('header-api-key'))
  async handleSignupHasuraEvent(@Body() customerData: SignupEventPayload) {
    const userData = customerData.event.data.new;
    const [firstName, ...lastNameEntries] = userData.display_name.split(' ');

    await this.customerService.handleSignup({
      id: userData.id,
      email: userData.email,
      firstName: userData.metadata.firstName ?? firstName,
      lastName: userData.metadata.lastName ?? lastNameEntries.join(' '),
      phone: userData.phone_number,
      userName: userData.password_hash ? userData.display_name : '',
      profilePictureUrl: userData.avatar_url,
    });
  }
}
