import mongoose from 'mongoose';
import { IGenericResponse } from '../../../interfaces/common';
import { bookSearchableFields } from './book.constant';
import { IBook, IBookFilters } from './book.interface';
import { Book } from './book.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../users/user.model';

const createBook = async (payload: IBook) => {
  const result = await Book.create(payload);
  return result;
};

const getSingleBook = async (slug: string): Promise<IBook | null> => {
  const result = await Book.findOne({ slug });

  return result;
};

const getAllBooks = async (
  filters: IBookFilters
): Promise<IGenericResponse<IBook[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  // const { page, limit, skip, sortBy, sortOrder } =
  //   paginationHelpers.calculatePagination(paginationOptions);

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

  // Dynamic  Sort needs  field to  do sorting
  // const sortConditions: { [key: string]: SortOrder } = {};
  // if (sortBy && sortOrder) {
  //   sortConditions[sortBy] = sortOrder;
  // }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions);
  // .sort(sortConditions)
  // .skip(skip)
  // .limit(limit);

  // const total = await Book.countDocuments(whereConditions);

  // return {
  //   meta: {
  //     page,
  //     limit,
  //     total,
  //   },
  //   data: result,
  // };
  return {
    data: result,
  };
};

const updateBook = async (
  id: string,
  payload: Partial<IBook>
): Promise<IBook | null> => {
  const isExist = await Book.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }

  const { title, ...BookData } = payload;
  const updatedBookData: Partial<IBook> = { ...BookData };

  if (title && Object.keys(title).length > 0) {
    Object.keys(title).forEach(key => {
      const titleKey = `title.${key}` as keyof Partial<IBook>;
      (updatedBookData as any)[titleKey] = title[key as keyof typeof title];
    });
  }

  const result = await Book.findOneAndUpdate({ id }, updatedBookData, {
    new: true,
  });
  return result;
};

const deleteBook = async (id: string): Promise<IBook | null> => {
  // check if the Book is exist
  const isExist = await Book.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete Book first
    const book = await Book.findOneAndDelete({ id }, { session });
    if (!book) {
      throw new ApiError(404, 'Failed to delete book');
    }
    //delete user
    await User.deleteOne({ id });
    session.commitTransaction();
    session.endSession();

    return book;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const BookService = {
  createBook,
  getSingleBook,
  getAllBooks,
  updateBook,
  deleteBook,
};
