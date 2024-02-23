import { appConfig } from '@config/app.config';
import { PrismaModule } from '@libs/domain/prisma.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ShopifyController } from './application/shopify.web';
import { ApiKeyStrategy } from './domain/strategies/api-key/api-key.strategy';
import { AuthService } from './domain/strategies/api-key/auth.service';
import { JwtStrategy } from './domain/strategies/jwt/jwt.strategy';

@Module({
  controllers: [ShopifyController],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: appConfig.loginJwtSecret,
    }),
  ],
  providers: [AuthService, ApiKeyStrategy, JwtStrategy],
})
export class AuthModule {}
