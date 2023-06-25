import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Review } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { reviewSelect } from './review.dbquery.object'
import { ReviewDto } from './review.dto'

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, productId: number, reviewDto: ReviewDto) {
    return await this.prisma.review.create({
      data: {
        ...reviewDto,
        user: {
          connect: {
            id: userId,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
      },
    })
  }

  async findAllByProductId(productId: number) {
    return await this.prisma.review.findMany({
      where: {
        productId,
      },
      select: reviewSelect,
    })
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: {
        id,
      },
      select: reviewSelect,
    })

    if (!review) throw new NotFoundException('Отзыв не найден')

    return review
  }

  async update(id: number, reviewDto: ReviewDto) {
    const review: Review | null = await this.prisma.review.update({
      where: {
        id,
      },
      data: {
        ...reviewDto,
      },
    })

    if (!review) throw new NotFoundException('Отзыв не найден')

    return review
  }

  async remove(id: number) {
    const review: Review | null = await this.prisma.review.delete({
      where: {
        id,
      },
    })

    if (!review) throw new NotFoundException('Отзыв не найден')

    return { message: 'Отзыв удален' }
  }
  async getAverageRatingByProductId(productId: number) {
    const averageRating = await this.prisma.review.aggregate({
      where: {
        productId,
      },
      _avg: {
        rating: true,
      },
    })

    return averageRating._avg.rating.toFixed(2)
  }
}
