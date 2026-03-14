import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuditService } from './audit.service';
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
  providers: [JwtStrategy, AuditService],
  exports: [AuditService],
})
export class AuthModule {}
