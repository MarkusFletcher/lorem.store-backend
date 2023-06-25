import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ProductDto } from './product.dto'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getAll() {
    return this.productService.findAll()
  }

  @UsePipes(new ValidationPipe())
  @Get('/:id')
  async getById(@Param('id') id: string) {
    if (isNaN(Number(id))) {
      const code: string = id
      return this.productService.findOne(code)
    }
    return this.productService.findOne(+id)
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth()
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(+id, dto)
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth()
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(+id)
  }
}
