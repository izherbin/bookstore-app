import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { LoginUserInput } from './dto/login-user.input'
import * as bcrypt from 'bcrypt'
import { User } from '../user/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { CreateUserInput } from '../user/dto/create-user.input'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput

    const user = await this.userService.findOne(email)
    const isMatch = await bcrypt.compare(password, user.password)

    if (user && isMatch) {
      return user
    }

    return null
  }

  login(user: User) {
    return {
      user,
      authToken: this.jwtService.sign(
        {
          email: user.email,
          name: user.name,
          sub: user._id
        },
        {
          secret: this.configService.get<string>('JWT_SECRET')
        }
      )
    }
  }

  async signup(payload: CreateUserInput) {
    const user = await this.userService.findOne(payload.email)

    if (user) {
      throw new Error('User already exists, login instead')
    }

    const hash = await bcrypt.hash(
      payload.password,
      Number(this.configService.get<string>('SALT_ROUNDS'))
    )

    return this.userService.createUser({ ...payload, password: hash })
  }
}
