import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Product } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { reviewSelect } from 'src/review/review.dbquery.object'
import { codeGenerator } from 'src/utils/code.generator'
import { productSelect } from './product.dbquery.object'
import { ProductDto } from './product.dto'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(productDto: ProductDto) {
    const isProductExists: boolean = await this.isFieldExists(
      'name',
      productDto.name,
    )

    if (isProductExists) throw new BadRequestException('Товар уже существует')

    const product: Product = await this.prisma.product.create({
      data: {
        ...productDto,
        code: codeGenerator(productDto.name),
      },
    })

    return product
  }

  async findAll() {
    return await this.prisma.product.findMany({
      select: productSelect,
    })
  }

  async findOne(id: number | string) {
    let product

    if (typeof id === 'number') {
      product = await this.prisma.product.findUnique({
        where: {
          id,
        },
        select: {
          ...productSelect,
          reviews: {
            select: reviewSelect,
          },
        },
      })
    } else if (typeof id === 'string') {
      product = await this.prisma.product.findUnique({
        where: {
          code: id,
        },
        select: {
          ...productSelect,
          reviews: {
            select: reviewSelect,
          },
        },
      })
    } else throw new BadRequestException('Укажите id или code товара')

    if (!product) throw new NotFoundException('Товар не найден')

    return product
  }

  async update(id: number, productDto: ProductDto) {
    const product: Product = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...productDto,
        code: codeGenerator(productDto.name),
      },
    })

    if (!product) throw new NotFoundException('Товар не найден')

    return product
  }

  async remove(id: number) {
    const product: Product = await this.prisma.product.delete({
      where: {
        id,
      },
    })

    if (!product) throw new NotFoundException('Товар не найден')

    return { message: 'Товар удален' }
  }

  private async isFieldExists(
    fieldName: keyof Product,
    fieldValue: any,
  ): Promise<boolean> {
    if (fieldName && fieldValue) {
      const count = await this.prisma.product.count({
        where: {
          [fieldName]: fieldValue,
        },
      })
      return count > 0
    }
    return false
  }
}
