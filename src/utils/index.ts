import { Model, Query } from "mongoose";

/**
 *
 * @param model - Mongoose model
 * @param query - Mongoose Query
 * @param queryParams - Query parameters from express Response
 *
 */

export const appendSpecialOperations = <T>(
	model: Model<T>,
	query: Query<any, any, any>,
	queryParams: any
) => {
	let specialOperations = ["limit", "fields", "sort", "page"];
	specialOperations.forEach((el) => {
		queryParams = Object.assign(queryParams, {
			[el]: queryParams[el] || null,
		});
	});

	const { limit, fields, sort, page } = queryParams;

	if (sort !== null) {
		const sortBy = sort.split(",").join(" ");
		query.sort(sortBy);
	} else {
		query.sort("-createdAt");
	}

	if (fields !== null) {
		const showFields = fields.split(",").join(" ");
		query.select(showFields);
	} else {
		query.select("-__v");
	}

	if (limit !== null) {
		query.skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
	} else {
		query.limit(100);
	}

	return query;
};
