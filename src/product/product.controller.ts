import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { AllProductsDto } from './dto/all.products.dto'
import { ProductDto } from './dto/product.dto'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async getAll(@Query() dto: AllProductsDto) {
    return this.productService.findAll(dto)
  }

  @Get('/similar/:id')
  async getSimilar(@Param() id: string) {
    return this.productService.findSimilar(+id)
  }

  @Get('/category/:code')
  async getByCategory(@Param() code: string) {
    return this.productService.findByCategoryId(code)
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
