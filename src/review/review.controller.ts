import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common'
import { ReviewService } from './review.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ReviewDto } from './review.dto'

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth()
  @Post('/:productId')
  async create(
    @CurrentUser('id') userId: number,
    @Param('productId') productId: string,
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService.create(userId, +productId, dto)
  }

  @UsePipes(new ValidationPipe())
  @Get('/:productId')
  async findAllByProductId(@Param('productId') productId: string) {
    return this.reviewService.findAllByProductId(+productId)
  }

  @UsePipes(new ValidationPipe())
  @Get('/detail/:id')
  async findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id)
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth()
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: ReviewDto) {
    return this.reviewService.update(+id, dto)
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Auth()
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return this.reviewService.remove(+id)
  }

  @UsePipes(new ValidationPipe())
  @Get('/rating/average/:productId')
  async getAverageRatingByProductId(@Param('productId') productId: string) {
    return this.reviewService.getAverageRatingByProductId(+productId)
  }
}
