import express from 'express';
import { createRide, updateRideStatus, acceptRide, getMyRides,createNews,getAllNews } from '../controllers/ride.js';

const router = express.Router();

router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

router.post('/create', createRide);
router.patch('/accept/:rideId', acceptRide);
router.patch('/update/:rideId', updateRideStatus);
router.get('/rides', getMyRides);

router.post('/news-create', createNews);
router.get('/news-list', getAllNews);

export default router;
