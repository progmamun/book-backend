import express from 'express';
import { UserRoutes } from '../modules/users/user.routes';
import { BookRoutes } from '../modules/book/book.routes';
import { ReviewRoute } from '../modules/review/review.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/',
    route: UserRoutes,
  },
  {
    path: '/book',
    route: BookRoutes,
  },
  {
    path: '/review',
    route: ReviewRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
