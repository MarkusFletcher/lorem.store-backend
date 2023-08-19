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
        value: user.orders.length,
      },
      {
        name: 'Reviews',
        value: user.orders.length,
      },
      {
        name: 'Favorites',
        value: user.favorites.length,
      },
      {
        name: 'Total orders',
        value: totalAmount,
      },
    ]
  }
}
