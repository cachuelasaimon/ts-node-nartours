import mongoose, { Schema, model, Query } from "mongoose";
import slugify from "slugify";

const tourSchema = new Schema({
	name: {
		type: String,
		required: [true, "A tour must have a name"],
		minlength: [10, "tour name must be at least 10 characters"],
		maxlength: [40, "A tour name must not exceed 40 characters"],
		unique: true,
		trim: true,
	},
	secretTour: {
		type: Boolean,
		default: false,
	},
	maxGroupSize: {
		type: Number,
		required: [true, "A tour must have a maxGroupSize"],
		min: [3, "A tour must at least have 3 people"],
		max: [10, "A tour must not exceed 10 people"],
	},
	difficulty: {
		type: String,
		required: [true, "A tour must have a difficulty"],
		enum: {
			values: ["easy", "medium", "difficult"],
			message: "difficulty must either be easy, medium or difficult",
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
		required: [true, "A tour must have a price"],
	},
	summary: {
		type: String,
		required: [true, "A tour must have a summary"],
	},
	imageCover: {
		type: String,
		required: [true, "A tour must have an imageCover"],
	},
	slug: String,
});

// Document hooks
tourSchema.pre("save", function (this, next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

// Query Hooks
tourSchema.pre(/^find/, function (this, next) {
	(this as any).find({ secretTour: { $ne: true } });
	console.log("this bitch");
	next();
});

// Aggregate hooks
tourSchema.pre("aggregate", function (next) {
	(this as any).pipeline().unshift({ $match: { secretTour: { $ne: true } } });

	next();
});

const Tour = model("Tour", tourSchema);

export default Tour;
