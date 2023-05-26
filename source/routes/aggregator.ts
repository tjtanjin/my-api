import express from 'express';
import controller from '../controllers/aggregator';
const router = express.Router();

// refer to swagger api docs for detailed info on each route
router.get('/get/:key', controller.getAggregate);

export = router;