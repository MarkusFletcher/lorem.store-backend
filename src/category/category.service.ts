import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Category } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { codeGenerator } from 'src/utils/code.generator'
import { CategoryDto } from './category.dto'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(categoryDto: CategoryDto) {
    const isCategoryExists: boolean = await this.isFieldExists(
      'name',
      categoryDto.name,
    )

    if (isCategoryExists) throw new BadRequestException('Раздел уже существует')

    const category: Category = await this.prisma.category.create({
      data: {
        name: categoryDto.name,
        code: codeGenerator(categoryDto.name),
      },
    })

    return category
  }

  async findAll() {
    const categories: Category[] = await this.prisma.category.findMany()
    return categories
  }

  async findOne(id: number | string) {
    let category: Category | null

    if (typeof id === 'number') {
      category = await this.prisma.category.findUnique({
        where: {
          id,
        },
      })
    } else if (typeof id === 'string') {
      category = await this.prisma.category.findUnique({
        where: {
          code: id,
        },
      })
    } else throw new BadRequestException('Укажите id или code раздела')

    if (!category) throw new NotFoundException('Раздел не найден')

    return category
  }

  async update(id: number, categoryDto: CategoryDto) {
    const category: Category | null = await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        ...categoryDto,
        code: codeGenerator(categoryDto.name),
      },
    })

    if (!category) throw new NotFoundException('Раздел не найден')

    return category
  }

  async remove(id: number) {
    const category: Category | null = await this.prisma.category.delete({
      where: {
        id,
      },
    })

    if (!category) throw new NotFoundException('Раздел не найден')

    return { message: 'Раздел удален' }
  }

  private async isFieldExists(
    fieldName: keyof Category,
    fieldValue: any,
  ): Promise<boolean> {
    if (fieldName && fieldValue) {
      const count = await this.prisma.category.count({
        where: {
          [fieldName]: fieldValue,
        },
      })
      return count > 0
    }
    return false
  }
}
