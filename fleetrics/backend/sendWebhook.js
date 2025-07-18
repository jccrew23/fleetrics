import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const FLEETIO_SECRET = process.env.FLEETIO_WEBHOOK_SECRET;
const NGROK_URL = 'https://5aa0a15046c6.ngrok-free.app/webhooks/fleetio'; // ← Change to your current tunnel URL

// Load payload as raw string
const payloadPath = './payload.json';
const payloadObj = JSON.parse(fs.readFileSync(payloadPath, 'utf-8'));
const rawPayload = JSON.stringify(payloadObj); // compact version (no pretty formatting)


// Generate HMAC SHA-256 signature
const signature = crypto
  .createHmac('sha256', FLEETIO_SECRET)
  .update(rawPayload)
  .digest('hex');

// Log for debugging
console.log('🔐 Signature:', signature);
console.log('📦 Payload:', rawPayload);

// Send to your webhook via axios
async function sendWebhook() {
  try {
    const res = await axios.post(NGROK_URL, rawPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Fleetio-Event': 'work_order_created',
        'X-Fleetio-Signature': signature
      }
    });
    console.log('✅ Webhook sent! Status:', res.status);
    console.log(res.data);
  } catch (err) {
    if (err.response) {
      console.error('❌ Error response:', err.response.status, err.response.data);
    } else {
      console.error('❌ Send error:', err.message);
    }
  }
}

console.log('🔒 Sending signature:', signature);
console.log('📤 Raw payload string:', JSON.stringify(rawPayload));

sendWebhook();
