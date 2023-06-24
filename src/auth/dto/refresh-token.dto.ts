import { IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsString({ message: 'Неверный токен' })
  refreshToken: string
}
