import dotenv from "dotenv";
import { connect } from "mongoose";

import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { TourRoutes } from "./routes";

const app: Application = express();

app.use(morgan("dev"));
app.use(express.json());

// Middlewares

// Routes
app.use("/api/v1/tours", TourRoutes);

dotenv.config({ path: "./config.env" });

const remoteDB: string = process.env.DATABASE?.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD as string
) as string;

const connectToMongo = async (DB: string) => {
	try {
		await connect(DB);
		console.log("Connected to Mongo");
	} catch (err) {
		console.log("Error Connecting to Mongo", err);
	}
};

connectToMongo(remoteDB);

// Start Server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App Running on Port: ${port}`));
