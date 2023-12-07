import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooSchema } from 'mongoose'
import { Author } from 'src/app/author/entities/author.entity'
import { User } from 'src/app/user/entities/user.entity'

@ObjectType()
@Schema()
export class Book {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId

  @Field(() => String)
  @Prop()
  title: string

  @Field(() => Float)
  @Prop()
  description: string

  @Field(() => Number)
  @Prop()
  price: number

  @Field(() => String)
  @Prop()
  coverImage: string

  @Field(() => String)
  @Prop({ unique: true })
  isbn: string

  @Field(() => Author)
  @Prop({ type: { type: MongooSchema.Types.ObjectId, ref: 'Author' } })
  author: Author

  @Field(() => [User])
  @Prop({ type: [{ type: MongooSchema.Types.ObjectId, ref: 'User' }] })
  readers: User[]
}

@ObjectType()
export class GetBooksPaginatedResponse {
  @Field(() => [Book], { nullable: false, defaultValue: [] })
  books: Book[]

  @Field(() => Int, { nullable: false, defaultValue: 0 })
  booksCount: number
}

export type BookDocument = Book & Document
export const BookSchema = SchemaFactory.createForClass(Book)
