import { Optional } from '@nestjs/common'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
  @MinLength(4, { message: 'Логин должен быть больше 5 символов' })
  login: string

  @IsEmail({}, { message: 'Некорректный email' })
  email: string

  @MinLength(5, { message: 'Пароль должен быть больше 5 символов' })
  @IsString()
  password: string

  @Optional()
  name: string
}
