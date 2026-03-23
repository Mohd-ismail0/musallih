import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class NearbyOrganizationsQueryDto {
  @ApiPropertyOptional({
    description: 'Bounding box: minLng,minLat,maxLng,maxLat',
    example: '101.636,3.089,101.736,3.189',
  })
  @IsOptional()
  @IsString()
  bbox?: string;

  @ApiPropertyOptional({ description: 'Category label from frontend map tabs' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Comma-separated sect filters' })
  @IsOptional()
  @IsString()
  sect?: string;

  @ApiPropertyOptional({ description: 'Comma-separated timing filters' })
  @IsOptional()
  @IsString()
  timing?: string;

  @ApiPropertyOptional({ description: 'Distance band filter (e.g. 1km, 3km)' })
  @IsOptional()
  @IsString()
  distanceBand?: string;

  @ApiPropertyOptional({ description: 'Comma-separated facilities filters' })
  @IsOptional()
  @IsString()
  facilities?: string;
}
