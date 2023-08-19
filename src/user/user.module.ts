import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from 'src/prisma.service'
import { ProductService } from 'src/product/product.service'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ProductService],
  exports: [UserService],
})
export class UserModule {}
