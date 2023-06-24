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
import { CategoryDto } from './category.dto'
import { CategoryService } from './category.service'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getAll() {
    return this.categoryService.findAll()
  }

  @UsePipes(new ValidationPipe())
  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.categoryService.findOne(+id)
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth()
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: CategoryDto) {
    return this.categoryService.update(+id, dto)
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth()
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return this.categoryService.remove(+id)
  }
}
