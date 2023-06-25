import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class StatisticService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getMain(userId: number) {
    const user = await this.userService.getById(userId, {
      orders: {
        select: {
          items: true,
        },
      },
      reviews: true,
    })

    const totalAmount = await this.userService.calculateTotalOrders(userId)

    return [
      {
        name: 'Orders',
        number: user.orders.length,
      },
      {
        name: 'Reviews',
        number: user.orders.length,
      },
      {
        name: 'Favorites',
        number: user.favorites.length,
      },
      {
        name: 'Total orders',
        number: totalAmount,
      },
    ]
  }
}
