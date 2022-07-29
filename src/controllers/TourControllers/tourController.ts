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

	getTourById: async (req) => {},
};

export default tourController;
