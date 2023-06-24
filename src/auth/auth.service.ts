import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from './dto/auth.dto'
import { faker } from '@faker-js/faker'
import { hash, verify } from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const candidate: User = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { login: dto.login }],
      },
    })
    if (candidate) throw new BadRequestException('Пользователь уже существует')

    const user: User = await this.prisma.user.create({
      data: {
        login: `${faker.person.firstName()}${faker.person.lastName()}${faker.person.suffix()}`,
        email: faker.internet.email(),
        name: faker.person.firstName(),
        phone: faker.phone.number('+7 (###) ###-##-##'),
        avatarPath: faker.image.avatar(),
        password: await hash(dto.password),
      },
    })

    const tokens = await this.issueTokens(user.id)

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  async login(dto: AuthDto) {
    const user: User = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { login: dto.login }],
      },
    })
    if (!user) throw new NotFoundException('Неверный(покайся) логин или пароль')

    const isValidPassword = await verify(user.password, dto.password)

    if (!isValidPassword)
      throw new NotFoundException('Неверный(покайся) логин или пароль')

    const tokens = await this.issueTokens(user.id)

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  async getNewTokens(dto: RefreshTokenDto) {
    const result = await this.jwt.verifyAsync(dto.refreshToken)
    console.log(result)
    if (!result) throw new UnauthorizedException('Неверный токен')

    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    })

    if (!user) throw new NotFoundException('Пользователь не найден')

    const tokens = await this.issueTokens(user.id)

    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  private async issueTokens(userId: number) {
    const data = { id: userId }

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    })

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '10d',
    })

    return { accessToken, refreshToken }
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
      login: user.login,
    }
  }
}
