import express from 'express';
import { BookController } from './book.controller';

const router = express.Router();

router.post('/create-book', BookController.createBook);

router.get('/new-books/', BookController.getTopBooks);

router.get('/:slug', BookController.getSingleBook);

router.get('/', BookController.getAllBooks);

router.patch('/:slug', BookController.updateBook);

router.delete('/:slug', BookController.deleteBook);

export const BookRoutes = router;
