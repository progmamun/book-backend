import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { BookController } from './book.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/create-book', BookController.createBook);

router.get('/new-books/', BookController.getTopBooks);

router.get('/:slug', BookController.getSingleBook);

router.get('/', BookController.getAllBooks);

router.patch(
  '/:slug',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.AUTHOR),
  BookController.updateBook
);

router.delete(
  '/:slug',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.AUTHOR),
  BookController.deleteBook
);

export const BookRoutes = router;
