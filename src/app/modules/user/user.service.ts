import { IUser } from './user.interface';
import { User } from './user.model';

const createUser = async (user: IUser): Promise<IUser | null> => {
  const createUser = await User.create(user);
  if (!createUser) {
    throw new Error('Failed to create user!');
  }
  return createUser;
};

export const UserService = {
  createUser,
};
