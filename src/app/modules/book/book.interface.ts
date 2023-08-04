import { Model, Types } from 'mongoose';
import { IUser } from '../users/user.interface';

export type IBook = {
  title: string;
  slug: string;
  author: string;
  genre: string;
  img: string;
  publicationDate: string;
  publicationYear: string;
  email: string;
  reviews?: string[];
  user?: Types.ObjectId | IUser;
};

export type BookModel = Model<IBook, Record<string, unknown>>;

export type IBookFilters = {
  searchTerm?: string;
};
