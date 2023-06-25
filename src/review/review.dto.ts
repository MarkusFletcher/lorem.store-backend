import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator'

export class ReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @IsString()
  @MaxLength(200)
  text: string
}
