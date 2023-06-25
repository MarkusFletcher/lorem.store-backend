import { Prisma } from '@prisma/client'
import { userSelect } from 'src/user/user.dbquery.objects'

export const reviewSelect: Prisma.ReviewSelect = {
  id: true,
  createdAt: true,
  rating: true,
  text: true,
  user: {
    select: userSelect,
  },
}
