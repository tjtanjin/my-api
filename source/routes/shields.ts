import express from 'express';
import controller from '../controllers/shields';
const router = express.Router();

// refer to swagger api docs for detailed info on each route
router.get('/get/:key', controller.getShield);

export = router;