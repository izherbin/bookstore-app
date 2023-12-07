import { Injectable } from '@nestjs/common'
import { CreateBookInput } from './dto/create-book.input'
import { UpdateBookInput } from './dto/update-book.input'
import { Book, BookDocument } from './entities/book.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Schema as MongooSchema } from 'mongoose'

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: Model<BookDocument>
  ) {}

  create(createBookInput: CreateBookInput) {
    const createBook = new this.bookModel(createBookInput)
    return createBook.save()
  }

  async findAll(limit: number, skip: number) {
    const booksCount = await this.bookModel.find().countDocuments()
    const books = await this.bookModel
      .find()
      .populate('author')
      .skip(skip)
      .limit(limit)

    return {
      books,
      booksCount
    }
  }

  getBookById(
    id: MongooSchema.Types.ObjectId,
    skipReaders: number,
    limitReaders: number
  ) {
    return this.bookModel
      .findById(id)
      .populate('author')
      .populate({
        path: 'users',
        options: {
          skip: skipReaders,
          limit: limitReaders
        }
      })
  }

  updateBook(
    id: MongooSchema.Types.ObjectId,
    updateBookInput: UpdateBookInput
  ) {
    return this.bookModel.findById(id, updateBookInput, {
      new: true
    })
  }

  remove(id: MongooSchema.Types.ObjectId) {
    return this.bookModel.deleteOne({ _id: id })
  }
}
