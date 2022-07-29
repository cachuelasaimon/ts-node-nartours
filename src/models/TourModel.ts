import { Schema, model } from 'mongoose';

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    minlength: [10, 'tour name must be at least 10 characters'],
    maxlength: [40, 'A tour name must not exceed 40 characters'],
    unique: true,
    trim: true,
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a maxGroupSize'],
    min: [3, 'A tour must at least have 3 people'],
    max: [10, 'A tour must not exceed 10 people'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: [],
      message: 'difficulty must either be easy, medium or difficult',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 2.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  summary: {
    type: String,
    required: [true, 'A tour must have a summary'],
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have an imageCover'],
  },
});

const Tour = model('Tour', tourSchema);

export default Tour;
