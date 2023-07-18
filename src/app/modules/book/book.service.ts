import mongoose from 'mongoose';
import { IGenericResponse } from '../../../interfaces/common';
import { bookSearchableFields } from './book.constant';
import { IBook, IBookFilters } from './book.interface';
import { Book } from './book.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../users/user.model';
import { JwtPayload } from 'jsonwebtoken';

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
  slug: string,
  payload: Partial<IBook>,
  user: JwtPayload | null
) => {
  const isExist = await Book.findOne({ slug });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book Not Found');
  }
  // console.log(isExist.id, user?.slug);
  if (isExist.id !== user?.userEmail) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  try {
    const result = await Book.findOneAndUpdate(
      { slug },
      { $set: payload },
      {
        new: true,
      }
    );
    if (!result) {
      return new ApiError(httpStatus.NOT_FOUND, 'Book Not Found');
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

const deleteBook = async (slug: string): Promise<IBook | null> => {
  // check if the Book is exist
  const isExist = await Book.findOne({ slug });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete Book first
    const book = await Book.findOneAndDelete({ slug }, { session });
    if (!book) {
      throw new ApiError(404, 'Failed to delete book');
    }
    //delete user
    await User.deleteOne({ slug });
    session.commitTransaction();
    session.endSession();

    return book;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

const review = async (slug: string, payload: any) => {
  const isExist = await Book.findOne({ slug });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book Not Found');
  }
  try {
    const result = await Book.updateOne(
      { slug },
      { $push: { reveiws: payload } }
    );
    if (!result.modifiedCount) {
      return new ApiError(
        httpStatus.NOT_FOUND,
        'Book Not Found or post review failed'
      );
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const BookService = {
  createBook,
  getSingleBook,
  getAllBooks,
  updateBook,
  deleteBook,
  review,
};
