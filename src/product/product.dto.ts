import { IsString, MinLength, IsOptional, IsNumber } from 'class-validator'

export class ProductDto {
  @IsString()
  @MinLength(3)
  name: string

  @IsString()
  description: string

  @IsNumber()
  price: number

  @IsString({ each: true })
  images: string[]

  @IsNumber()
  categoryId: number
}
