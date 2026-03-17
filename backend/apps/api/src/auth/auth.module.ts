import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuditService } from './audit.service';
import { AuthTokenService } from './auth-token.service';
import { AuthController } from './auth.controller';
import { getEnv } from '../config/env';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        const env = getEnv();
        return {
          secret: env.JWT_SECRET,
          signOptions: { expiresIn: env.JWT_EXPIRES_IN_SECONDS },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuditService, AuthTokenService],
  exports: [AuditService],
})
export class AuthModule {}
