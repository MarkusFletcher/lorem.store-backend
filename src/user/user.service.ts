import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { userSelect } from './user.dbquery.objects'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: number, select: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...userSelect,
        ...select,
        favorites: {
          select: {
            id: true,
            name: true,
            code: true,
            price: true,
            images: true,
          },
        },
      },
    })

    if (!user) throw new NotFoundException('Пользователь не найден')

    return user
  }

  async updateProfile(id: number, userDto: UserDto) {
    // Если user не найден, сразу отдаст 404
    const user: Partial<User> = await this.getById(id)

    // Проверка, заняты ли почта и логин
    const isEmailBusy = await this.isFieldExists('email', userDto.email)

    // Вторая часть выражения для исключение из проверки текущего пользователя
    if (isEmailBusy && user.email !== userDto.email)
      throw new BadRequestException('Email занят')
    const isLoginBusy = await this.isFieldExists('login', userDto.login)
    if (isLoginBusy && user.login !== userDto.login)
      throw new BadRequestException('Login занят')

    return this.prisma.user.update({
      where: { id },
      data: {
        ...userDto,
        id: user.id,
        // если пароль передается в dto, обновляет, если нет, оставляет старый пароль
        password: userDto.password
          ? await hash(userDto.password)
          : user.password,
      },
    })
  }

  async toggleFavorites(id: number, productId: number) {
    const user = await this.getById(id)
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    })

    if (!product) throw new NotFoundException('Товар не найден')

    const isExists: boolean = user.favorites.some(
      product => product.id === productId,
    )

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        favorites: {
          [isExists ? 'disconnect' : 'connect']: {
            id: productId,
          },
        },
      },
    })

    return { message: 'Информация о пользователе обновлена' }
  }

  // Плохое решение
  async calculateTotalOrders(id) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        orders: {
          include: {
            items: true,
          },
        },
      },
    })

    if (!user) throw new NotFoundException('Пользователь не найден')

    const totalOrders = user.orders.reduce((totalSum, currentOrder) => {
      return (
        totalSum +
        currentOrder.items.reduce((totalOrderSum, currentOrderItem) => {
          return totalOrderSum + currentOrderItem.price
        }, 0)
      )
    }, 0)

    return totalOrders
  }

  private async isFieldExists(
    fieldName: keyof User,
    fieldValue: any,
  ): Promise<boolean> {
    if (fieldName && fieldValue) {
      const count = await this.prisma.user.count({
        where: {
          [fieldName]: fieldValue,
        },
      })
      return count > 0
    }
    return false
  }
}
