import { Prisma } from '@prisma/client'
import { categorySelect } from 'src/category/category.dbquery.object'

export const productSelect: Prisma.ProductSelect = {
  id: true,
  name: true,
  code: true,
  description: true,
  price: true,
  images: true,
  category: {
    select: categorySelect,
  },
}
