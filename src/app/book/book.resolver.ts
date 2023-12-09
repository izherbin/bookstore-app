import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { BookService } from './book.service'
import { Book, GetBooksPaginatedResponse } from './entities/book.entity'
import { CreateBookInput } from './dto/create-book.input'
import { UpdateBookInput } from './dto/update-book.input'
import { Schema as MongooSchema } from 'mongoose'
import { GetPaginatedArgs } from '../common/dto/get-paginated.args'
import { GetPaginatedSubDocumentsArgs } from '../common/dto/get-paginated-sub-document.args'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guards'

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.bookService.create(createBookInput)
  }

  @Query(() => GetBooksPaginatedResponse, { name: 'allBook' })
  async findAll(@Args() args: GetPaginatedArgs) {
    const { skip, limit } = args
    const res = await this.bookService.findAll(skip, limit)
    return res
  }

  @Query(() => Book, { name: 'book' })
  getBookById(@Args() args: GetPaginatedSubDocumentsArgs) {
    const { _id, skip, limit } = args
    return this.bookService.getBookById(_id, skip, limit)
  }

  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.bookService.updateBook(updateBookInput._id, updateBookInput)
  }

  @Mutation(() => Book)
  @UseGuards(JwtAuthGuard)
  removeBook(
    @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId
  ) {
    return this.bookService.remove(id)
  }
}
