/*eslint-disable @typescript-eslint/no-non-null-assertion*/
/*eslint-disable @typescript-eslint/consistent-type-definitions*/

import mongoose from 'mongoose';
import { IGenericResponse } from '../../../interfaces/common';
import { bookSearchableFields } from './book.constant';
import { IBook, IBookFilters } from './book.interface';
import { Book } from './book.model';
import ApiError from '../../../errors/ApiError';

interface IUpdateReviewPayload {
  review: string;
}

const createBook = async (payload: IBook) => {
  const result = await Book.create(payload);
  return result;
};

const getSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findOne({ _id: new mongoose.Types.ObjectId(id) });
  return result;
};

const getAllBooks = async (
  filters: IBookFilters
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  // Filters needs $and to fullfill all the conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions);

  return {
    data: result,
  };
};

export const updateBook = async (
  id: string,
  payload: Partial<IBook>
): Promise<IBook | null> => {
  const isExist = await Book.findOne({ _id: new mongoose.Types.ObjectId(id) });

  if (!isExist) {
    throw new ApiError(404, 'Book not found !');
  }

  const { ...bookData } = payload;

  const updatedBookData: Partial<IBook> = { ...bookData };

  const result = await Book.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    updatedBookData,
    {
      new: true,
    }
  );
  return result;
};

const deleteBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findByIdAndDelete({
    _id: new mongoose.Types.ObjectId(id),
  });
  return result;
};

const review = async (
  id: string,
  payload: IUpdateReviewPayload
): Promise<IBook | null> => {
  const isExist = await Book.findOne({ _id: new mongoose.Types.ObjectId(id) });

  const { review } = payload;
  isExist?.reviews?.push(review);

  const result = await Book.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    isExist!,
    {
      new: true,
    }
  );
  return result;
};

export const BookService = {
  createBook,
  getSingleBook,
  getAllBooks,
  updateBook,
  deleteBook,
  review,
};
