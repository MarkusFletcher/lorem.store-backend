import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, Product } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { reviewSelect } from 'src/review/review.dbquery.object'
import { codeGenerator } from 'src/utils/code.generator'
import { productSelect } from './product.dbquery.object'
import { ProductDto } from './dto/product.dto'
import { AllProductsDto, EnumProductSort } from './dto/all.products.dto'
import { PaginationService } from 'src/pagination/pagination.service'

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

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

  async findAll(dto: AllProductsDto = {}) {
    const { sort, searchTerm } = dto

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

    switch (sort) {
      case EnumProductSort.HIGHT_PRICE:
        prismaSort.push({ price: 'asc' })
        break
      case EnumProductSort.LOW_PRICE:
        prismaSort.push({ price: 'desc' })
        break
      case EnumProductSort.NEWEST:
        prismaSort.push({ createdAt: 'desc' })
        break
      case EnumProductSort.OLDEST:
        prismaSort.push({ createdAt: 'asc' })
        break
      default:
        break
    }

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}

    const { perPage, skip } = await this.paginationService.getPagination(dto)

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
      select: productSelect,
    })

    const length = await this.prisma.product.count({
      where: prismaSearchTermFilter,
    })

    return { products, length }
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
        },
      })
    } else if (typeof id === 'string') {
      product = await this.prisma.product.findUnique({
        where: {
          code: id,
        },
        select: {
          ...productSelect,
        },
      })
    } else throw new BadRequestException('Укажите id или code товара')

    if (!product) throw new NotFoundException('Товар не найден')

    return product
  }

  async findByCategoryId(categoryCode: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          code: categoryCode,
        },
      },
    })

    if (!products) throw new NotFoundException('Товары не найден')

    return products
  }

  async findSimilar(id: number) {
    const currentProduct = await this.findOne(id)

    if (!currentProduct) throw new NotFoundException('Товар не найден')

    const products = await this.prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        NOT: {
          id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: productSelect,
    })

    if (!products) return []

    return products
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
