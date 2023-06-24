import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Product } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { codeGenerator } from 'src/utils/code.generator'
import { ProductDto } from './product.dto'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(productDto: ProductDto) {
    const isProductExists: boolean = await this.isFieldExists(
      'name',
      productDto.name,
    )

    if (isProductExists) throw new BadRequestException('Раздел уже существует')

    const product: Product = await this.prisma.product.create({
      data: {
        ...productDto,
        code: codeGenerator(productDto.name),
      },
    })

    return product
  }

  async findAll() {
    const categories: Product[] = await this.prisma.product.findMany()
    return categories
  }

  async findOne(id: number) {
    const product: Product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    })

    if (!product) throw new NotFoundException('Раздел не найден')

    return product
  }

  async update(id: number, productDto: ProductDto) {
    const product: Product = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...productDto,
      },
    })

    if (!product) throw new NotFoundException('Раздел не найден')

    return product
  }

  async remove(id: number) {
    const product: Product = await this.prisma.product.delete({
      where: {
        id,
      },
    })

    if (!product) throw new NotFoundException('Раздел не найден')

    return { message: 'Раздел удален' }
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
