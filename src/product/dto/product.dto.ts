import { Prisma } from '@prisma/client'
import { IsString, MinLength, IsNumber } from 'class-validator'

export class ProductDto implements Prisma.ProductUpdateInput {
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
