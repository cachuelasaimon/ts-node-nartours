import { Request, Response, IRouterHandler, NextFunction } from "express";

import { appendSpecialOperations } from "utils";
import { TourModel } from "models";

const tourController: Record<
	string,
	(req: Request, res: Response, next: NextFunction) => Promise<any>
> = {
	getAllTours: async (req, res) => {
		try {
			let query = TourModel.find();

			query = appendSpecialOperations(TourModel, query, {
				...req.query,
			});

			const tours = await query;

			res.status(200).json({
				status: "success",
				result: tours.length,
				data: tours,
			});
		} catch (err) {
			res.status(400).json({
				status: "failed",
				error: err,
				message: "Error getting all tours",
			});
		}
	},

	getTourById: async (req, res) => {
		try {
			const { id } = req.params;
			if (!id) {
				throw new Error("Invalid ID");
			}
			const query = TourModel.findById(id);
			const tours = await query;

			res.status(200).json({
				status: "success",
				data: tours,
			});
		} catch (err) {
			res.status(400).json({
				status: "failed",
				error: err,
				message: "Error getting all tours",
			});
		}
	},

	createTour: async (req, res) => {
		try {
			const newTour = req.body;
			const query = TourModel.create(newTour);
			const tour = await query;

			res.status(200).json({
				status: "success",
				data: tour,
			});
		} catch (err) {
			res.status(400).json({
				status: "failed",
				error: err,
				message: "Error creating tours",
			});
		}
	},

	updateTour: async (req, res) => {
		try {
			const { id } = req.params;
			if (!id) {
				throw new Error("Invalid ID");
			}
			const query = TourModel.findByIdAndUpdate(id, { new: true });
			const tour = await query;

			res.status(200).json({
				status: "success",
				data: tour,
			});
		} catch (err) {
			res.status(400).json({
				status: "failed",
				error: err,
				message: "Error updating tour",
			});
		}
	},

	deleteTour: async (req, res) => {
		try {
			const { id } = req.params;
			if (!id) {
				throw new Error("Invalid ID");
			}
			const query = TourModel.findByIdAndDelete(id);
			const tour = await query;

			res.status(201).json({
				status: "success",
			});
		} catch (err) {
			res.status(400).json({
				status: "failed",
				error: err,
				message: "Error deleting tour",
			});
		}
	},

	topTours: async (req, res, next) => {
		try {
			const params: {
				param: "limit" | "fields" | "sort" | "page";
				value: string;
			}[] = [
				{
					param: "limit",
					value: "5",
				},
				{
					param: "sort",
					value: "ratingsAverage,-price",
				},
			];

			params.forEach(({ param, value }) => {
				req.query = Object.assign(req.query, { [param]: value });
			});

			next();
		} catch (err) {
			res.status(400).json({
				status: "failed",
				error: err,
				message: "Error getting all tours",
			});
		}
	},

	getTourStats: async (req, res) => {
		try {
			const query = TourModel.aggregate([
				{ $unwind: "$startDates" },
				{
					$group: {
						_id: { $month: "$startDates" },
						numOfTours: { $sum: 1 },
						numRatings: { $sum: "$ratingsQuantity" },
						avgRating: {
							$avg: "$ratingsAverage",
						},
						minPrice: { $min: "$price" },
						maxPrice: { $max: "$price" },
						avgPice: { $avg: "$price" },
					},
				},
				{
					$addFields: { month: "$_id" },
				},
				{ $unset: "_id" },
			]);

			const tourStats = await query;

			res.status(200).json({
				status: "success",
				data: tourStats,
			});
		} catch (err) {
			res.status(400).json({
				status: "failed",
				error: err,
				message: "Error getting tour stats",
			});
		}
	},
};

export default tourController;
