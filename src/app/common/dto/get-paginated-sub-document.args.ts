import { Field, ArgsType, PartialType } from '@nestjs/graphql'
import { Schema as MongooSchema } from 'mongoose'
import { GetPaginatedArgs } from './get-paginated.args'

@ArgsType()
export class GetPaginatedSubDocumentsArgs extends PartialType(
  GetPaginatedArgs
) {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId
}
