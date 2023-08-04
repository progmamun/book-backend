import { Model, Types } from 'mongoose';
import { IUser } from '../users/user.interface';
import { IBook } from '../book/book.interface';

export type IReview = {
  userId: Types.ObjectId | IUser;
  bookId: Types.ObjectId | IBook;
  review: string;
};

export type ReviewModel = Model<IReview, Record<string, unknown>>;
