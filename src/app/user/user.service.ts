import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Schema as MongooSchema } from 'mongoose'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { User, UserDocument } from './entities/user.entity'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { LoginUserInput } from '../auth/dto/login-user.input'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly configService: ConfigService
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const hash = await bcrypt.hash(
      createUserInput.password,
      Number(this.configService.get<string>('SALT_ROUND'))
    )
    const createdUser = new this.userModel({
      ...createUserInput,
      password: hash
    })

    return createdUser.save()
  }

  async findOne(email: string) {
    const user = await this.userModel.findOne({ email })
    return user
  }

  async loginUser(loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput
    const user = await this.userModel.findOne({ email })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isMatch = bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error('Password or email address incorrect')
    }

    return user
  }

  findAll() {
    return this.userModel.find()
  }

  getUserById(id: MongooSchema.Types.ObjectId) {
    return this.userModel.findById(id)
  }

  updateUser(
    id: MongooSchema.Types.ObjectId,
    updateUserInput: UpdateUserInput
  ) {
    return this.userModel.findByIdAndUpdate(id, updateUserInput, { new: true })
  }

  remove(id: MongooSchema.Types.ObjectId) {
    return this.userModel.deleteOne({ _id: id })
  }
}
