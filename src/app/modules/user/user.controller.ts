import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IUser } from './user.interface';
import { UserService } from './user.service';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...user } = req.body;
    const result = await UserService.createUser(user);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  },
);

export const UserController = {
  createUser,
};
