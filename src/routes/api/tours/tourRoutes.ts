import { Router } from 'express';
import TourController from 'controllers/TourControllers/tourController';

const router = Router();

// Special Routes

// Regular Routes
router.route('/').get(TourController.getAllTours);
export default router;
