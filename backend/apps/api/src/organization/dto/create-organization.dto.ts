import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ['MASJID', 'MADRASA', 'EDUCATION', 'BURIAL', 'WELFARE', 'BUSINESS', 'NGO'] })
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  authorityId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primaryContact?: string;
}
