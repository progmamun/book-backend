/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

// export type UserName = {
//   firstName: string;
//   lastName: string;
// };

export type IUser = {
  // name: UserName;
  email: string;
  password: string;
  role: string;
};
export type UserModel = {
  isUserExist(
    email: string
  ): Promise<Pick<IUser, 'email' | 'password' | 'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
