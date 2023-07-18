import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { IBook } from './book.interface';
import pick from '../../../shared/pick';
import { Request, Response } from 'express';
import { bookFilterableFields } from './book.constant';
import sendResponse from '../../../shared/sendResponse';
import { BookService } from './book.service';
import { Book } from './book.model';

const createBook = catchAsync(async (req: Request, res: Response) => {
  const { ...bookData } = req.body;
  const result = await BookService.createBook(bookData);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Create new book successfully !',
    data: result,
  });
});

const getTopBooks = catchAsync(async (req: Request, res: Response) => {
  const books = await Book.find().sort({ createdAt: -1 }).limit(10);

  res.status(200).json({
    success: true,
    message: 'Recent 10 books fetched successfully!',
    data: books,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await BookService.getSingleBook(slug);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Book successfully !',
    data: result,
  });
});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);

  const result = await BookService.getAllBooks(filters);

  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books fetched successfully !',
    data: result.data,
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const updatedData = req.body;
  const result = await BookService.updateBook(slug, updatedData);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully !',
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await BookService.deleteBook(slug);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book deleted successfully !',
    data: result,
  });
});

export const BookController = {
  createBook,
  getTopBooks,
  getSingleBook,
  getAllBooks,
  updateBook,
  deleteBook,
};
