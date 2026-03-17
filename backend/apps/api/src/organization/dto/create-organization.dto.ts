import { IsString, IsOptional, IsIn, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const BRANCH_TYPES = ['STANDALONE', 'HEADQUARTERS', 'BRANCH'] as const;
export type BranchType = (typeof BRANCH_TYPES)[number];

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

  @ApiPropertyOptional({ description: 'Parent organization ID when creating a branch' })
  @IsOptional()
  @IsString()
  parentOrganizationId?: string;

  @ApiPropertyOptional({
    enum: BRANCH_TYPES,
    description: 'STANDALONE (default), HEADQUARTERS (has branches), BRANCH (child of parent)',
  })
  @IsOptional()
  @IsString()
  @IsIn(BRANCH_TYPES)
  @ValidateIf((o) => o.branchType != null)
  branchType?: BranchType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  primaryContact?: string;
}
