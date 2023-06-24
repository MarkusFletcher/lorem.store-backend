import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UserDto {
  @IsOptional()
  @MinLength(4, { message: 'Логин должен быть больше 5 символов' })
  login: string

  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email' })
  email: string

  @IsOptional()
  @MinLength(5, { message: 'Пароль должен быть больше 5 символов' })
  @IsString()
  password: string

  @IsOptional()
  name: string
}
