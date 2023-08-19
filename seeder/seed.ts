import { faker } from '@faker-js/faker'
import { PrismaClient, Product } from '@prisma/client'
import * as dotenv from 'dotenv'
import { codeGenerator } from '../src/utils/code.generator'
import { getIntRandom } from '../src/utils/random.generator'
import { updateProductImages } from './updateProductImages'

dotenv.config()

const prisma = new PrismaClient()

const createProducts = async (count: number) => {
  const products: Product[] = []
  for (let i = 0; i < count; i++) {
    const productName = `${faker.commerce.product()} ${faker.commerce.productMaterial()} ${faker.finance.creditCardCVV()}`
    const categoryName: string = faker.commerce.department()
    const product: Product = await prisma.product.create({
      data: {
        name: productName,
        code: codeGenerator(productName),
        description: faker.commerce.productDescription(),
        price: getIntRandom(100, 30000),
        images: Array.from({ length: getIntRandom(2, 5) }).map(() =>
          faker.image.urlLoremFlickr(),
        ),
        category: {
          connectOrCreate: {
            create: {
              name: categoryName,
              code: codeGenerator(categoryName),
            },
            where: {
              name: categoryName,
            },
          },
        },
        reviews: {
          create: [
            ...Array.from({ length: getIntRandom(1, 4) }).map(() => ({
              rating: getIntRandom(1, 5),
              text: faker.lorem.paragraph(getIntRandom(1, 5)),
              user: {
                connect: {
                  id: getIntRandom(1, 15),
                },
              },
            })),
          ],
        },
      },
    })
    products.push(product)
  }
  console.log(`Created ${products.length} products`)
}

async function main() {
  console.log('Start seeding ...')
  await createProducts(100)
  // updateProductImages()
}

main()
  .catch(e => {
    console.error(e)
  })
  .finally(async () => {
    console.log('Finish seeding')
    await prisma.$disconnect()
  })
