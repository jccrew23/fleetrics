import express from 'express';
import { handleWebhook } from '../controllers/webhookController.js';


const router = express.Router();

// Middleware to handle incoming webhook requests
router.post(
    '/fleetio', 
    express.raw({ type: 'application/json' }), 
    handleWebhook
);

export default router;