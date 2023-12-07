import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { AuthorService } from './author.service'
import { Author, GetAuthorsPaginatedResponse } from './entities/author.entity'
import { CreateAuthorInput } from './dto/create-author.input'
import { UpdateAuthorInput } from './dto/update-author.input'
import { Schema as MongooSchema } from 'mongoose'
import { GetPaginatedArgs } from '../common/dto/get-paginated.args'

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Mutation(() => Author)
  createAuthor(
    @Args('createAuthorInput') createAuthorInput: CreateAuthorInput
  ) {
    return this.authorService.create(createAuthorInput)
  }

  @Query(() => GetAuthorsPaginatedResponse, { name: 'allAuthor' })
  findAll(@Args() args: GetPaginatedArgs) {
    const { skip, limit } = args
    return this.authorService.findAll(skip, limit)
  }

  @Query(() => Author, { name: 'author' })
  getAuthorById(
    @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId
  ) {
    return this.authorService.getAuthorById(id)
  }

  @Mutation(() => Author)
  updateAuthor(
    @Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput
  ) {
    return this.authorService.updateAuthor(
      updateAuthorInput._id,
      updateAuthorInput
    )
  }

  @Mutation(() => Author)
  removeAuthor(
    @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId
  ) {
    return this.authorService.remove(id)
  }
}
