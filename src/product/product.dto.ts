import {
  IsString,
  MinLength,
  isArray,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator'

export class ProductDto {
  @IsString()
  @MinLength(3)
  name: string

  @IsString()
  description: string

  @IsNumber()
  price: number

  @IsArray()
  images: string[]

  @IsOptional()
  @IsNumber()
  categoryId: number

  @IsOptional()
  @IsNumber()
  favoriteForUserId: number
}
