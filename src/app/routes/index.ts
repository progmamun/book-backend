import express from 'express';
import { UserRoutes } from '../modules/users/user.routes';
import { BookRoutes } from '../modules/book/book.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/',
    route: UserRoutes,
  },
  {
    path: '/book/',
    route: BookRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
