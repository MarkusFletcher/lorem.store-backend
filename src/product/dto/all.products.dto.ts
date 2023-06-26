import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/pagination.dto'

export enum EnumProductSort {
  HIGHT_PRICE = 'hight-price',
  LOW_PRICE = 'low-price',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class AllProductsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EnumProductSort)
  sort?: EnumProductSort

  @IsOptional()
  @IsString()
  searchTerm?: string
}
