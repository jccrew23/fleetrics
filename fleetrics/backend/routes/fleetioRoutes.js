import express from 'express';
import { getWorkOrders, getVehicles, generateReport } from '../controllers/fleetioController.js';

const router = express.Router();

router.get('/work_orders', getWorkOrders);

router.get('/vehicles', getVehicles);

router.post('/reports', generateReport);

export default router;
