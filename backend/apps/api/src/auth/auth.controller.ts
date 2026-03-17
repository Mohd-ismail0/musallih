import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthTokenService } from './auth-token.service';
import { ExchangeTokenDto } from './dto/exchange-token.dto';
import { Public } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authToken: AuthTokenService) {}

  @Post('token')
  @Public()
  @ApiOperation({
    summary: 'Exchange Firebase ID token for Musallih JWT',
    description:
      'Validates Firebase ID token and returns a Musallih JWT with user claims (sub, scopes, org_id, authority_level, jurisdiction_codes). Creates user on first login.',
  })
  async exchangeToken(@Body() dto: ExchangeTokenDto) {
    return this.authToken.exchangeToken(dto.id_token);
  }
}
