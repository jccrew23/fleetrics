// sign.js
import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.FLEETIO_WEBHOOK_SECRET;
const payload = fs.readFileSync('./payload.json', 'utf-8');

const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

console.log('Payload:', payload);
console.log('Secret:', secret);
console.log(process.env.FLEETIO_WEBHOOK_SECRET);

console.log('Signature:', signature);
