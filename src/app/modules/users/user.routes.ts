import express from 'express';
import { UserController } from './user.controller';
const router = express.Router();

router.post('/auth/signup', UserController.createUser);
router.post('/auth/login', UserController.loginUser);
router.post('/auth/refresh-token', UserController.refreshToken);

export const UserRoutes = router;
