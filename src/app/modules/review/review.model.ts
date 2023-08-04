import { Schema, model } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

const ReviewSchema = new Schema<IReview, ReviewModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = model<IReview, ReviewModel>('Review', ReviewSchema);
