import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Schema as MongooSchema } from 'mongoose'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { User, UserDocument } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>
  ) {}

  create(createUserInput: CreateUserInput) {
    const createUser = new this.userModel(createUserInput)
    return createUser.save()
  }

  findAll() {
    return []
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