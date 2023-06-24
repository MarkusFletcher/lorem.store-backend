import { faker } from '@faker-js/faker'
import { PrismaClient, Product } from '@prisma/client'
import { codeGenerator } from '../src/utils/code.generator'
import { getIntRandom } from '../src/utils/random.generator'

const prisma = new PrismaClient()

export const updateProductImages = async () => {
  try {
    const products: Product[] = await prisma.product.findMany()

    for (const product of products) {
      const updatedProduct = await prisma.product.update({
        where: { id: product.id },
        data: {
          images: Array.from({ length: getIntRandom(2, 5) }).map(() =>
            faker.image.urlLoremFlickr(),
          ),
        },
      })

      console.log(`Updated images for product with ID ${updatedProduct.id}`)
    }
  } catch (error) {
    console.error('Error updating product images:', error)
  } finally {
    await prisma.$disconnect()
  }
}
