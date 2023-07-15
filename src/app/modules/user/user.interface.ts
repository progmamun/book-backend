/* eslint-disable no-unused-vars */

import { Model } from 'mongoose';

export type IUser = {
  email: string;
  role: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
};

export type UserModel = {
  isUserExist(
    email: string,
  ): Promise<
    Pick<IUser, 'email' | 'password' | 'role' | 'needsPasswordChange'>
  >;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
