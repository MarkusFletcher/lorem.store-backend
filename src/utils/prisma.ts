// import { PrismaClient } from '@prisma/client'

// type ModelName = keyof PrismaClient

// const prisma = new PrismaClient()

// export async function isFieldExists<T>(
//   tableName: T,
//   fieldName: keyof T,
//   fieldValue: any,
// ): Promise<boolean> {
//   if (tableName && fieldName && fieldValue) {
//     const model = prisma[tableName]
//     const count = await model.count({
//       where: {
//         [fieldName]: fieldValue,
//       },
//     })
//     return count > 0
//   }
//   return false
// }
