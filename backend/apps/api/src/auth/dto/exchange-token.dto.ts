import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExchangeTokenDto {
  @ApiProperty({
    description: 'Firebase ID token from signInWithCredential or similar',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  id_token: string;
}
