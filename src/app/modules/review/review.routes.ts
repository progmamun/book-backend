import express from 'express';
import { ReviewController } from './review.controller';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(ENUM_USER_ROLE.USER), ReviewController.createReview);
router.get('/:id', ReviewController.getReviews);

export const ReviewRoute = router;
