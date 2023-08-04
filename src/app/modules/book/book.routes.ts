import express from 'express';
import { BookController } from './book.controller';

const router = express.Router();

router.post('/create-book', BookController.createBook);

router.get('/new-books/', BookController.getTopBooks);

router.get('/:id', BookController.getSingleBook);

router.get('/', BookController.getAllBooks);

router.delete('/:id', BookController.deleteBook);

router.patch('/:id', BookController.updateBook);

router.patch('/review/:id', BookController.review);

export const BookRoutes = router;
