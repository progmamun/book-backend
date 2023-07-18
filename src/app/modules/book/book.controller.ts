import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { IBook } from './book.interface';
import pick from '../../../shared/pick';
import { Request, Response } from 'express';
import { bookFilterableFields } from './book.constant';
import sendResponse from '../../../shared/sendResponse';
import { BookService } from './book.service';

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

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BookService.getSingleBook(id);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book fetched successfully !',
    data: result,
  });
});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  // const paginationOptions = pick(req.query, paginationFields);

  const result = await BookService.getAllBooks(filters);

  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books fetched successfully !',
    data: result.data,
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await BookService.updateBook(id, updatedData);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully !',
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BookService.deleteBook(id);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book deleted successfully !',
    data: result,
  });
});

export const BookController = {
  createBook,
  getSingleBook,
  getAllBooks,
  updateBook,
  deleteBook,
};
