import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'
import { User } from '@prisma/client'

export const CurrentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest()
      const user = request.user
      return data ? user[data] : user
    } catch (error) {
      throw new InternalServerErrorException('Something wrong')
    }
  },
)
