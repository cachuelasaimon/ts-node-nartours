import { Router } from "express";
import TourController from "controllers/TourControllers/tourController";

const router = Router();

// Special Routes
router
	.route("/top-5-tours")
	.get(TourController.topTours, TourController.getAllTours);

router.route("/tour-stats").get(TourController.getTourStats);

// Regular Routes
router
	.route("/")
	.get(TourController.getAllTours)
	.post(TourController.createTour);

router
	.route("/:id")
	.get(TourController.getTourById)
	.patch(TourController.updateTour)
	.delete(TourController.deleteTour);

export default router;
