import { Schema, Types, model } from 'mongoose';
import { BookModel, IBook } from './book.interface';
import slugify from 'slugify';

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'A book must have a name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    publicationDate: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

BookSchema.index({ slug: 1 });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
BookSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

export const Book = model<IBook, BookModel>('Book', BookSchema);
