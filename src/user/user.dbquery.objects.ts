import { Prisma } from '@prisma/client'

export const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  login: true,
  password: false,
  name: true,
  avatarPath: true,
  phone: true,
}
