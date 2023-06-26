import { Prisma } from '@prisma/client'
import { categorySelect } from 'src/category/category.dbquery.object'
import { reviewSelect } from 'src/review/review.dbquery.object'

export const productSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  code: true,
  description: true,
  price: true,
  images: true,
}

export const productSelectFull: Prisma.ProductSelect = {
  ...productSelect,
  category: {
    select: categorySelect,
  },
  reviews: {
    select: reviewSelect,
  },
}
