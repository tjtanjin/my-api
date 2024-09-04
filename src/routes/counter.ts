import express from 'express';
import controller from '../controllers/counter';
const router = express.Router();

// refer to swagger api docs for detailed info on each route
router.get('/get/:key', controller.getCounter);
router.get('/get', controller.getAllCounters);
router.post('/create', controller.createCounter);
router.post('/update', controller.updateCounter);
router.delete('/delete', controller.deleteCounter);

export = router;