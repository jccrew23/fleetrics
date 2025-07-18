import crypto from 'crypto';
import { Buffer } from 'buffer';

/**
 * Verifies the signature of a payload using HMAC SHA256.
 * 
 * This function takes a payload, a signature, and a secret key,
 * and verifies if the signature matches the HMAC SHA256 hash of the payload.
 *
 * @param {Object} payload
 * @param {string} signature
 * @param {string} secret
 * @returns {boolean}
 */
export default function verifySignature(rawBodyBuffer, signature, secret) {
    if (!signature || !secret) {
        console.log('❌ Missing signature or secret');
        return false;
    }
    
    // Log inputs for debugging
    console.log('🔍 Debug Info:');
    console.log('Raw Body Type:', typeof rawBodyBuffer);
    console.log('Raw Body Length:', rawBodyBuffer ? rawBodyBuffer.length : 'null');
    console.log('Signature Received:', signature);
    console.log('Secret Length:', secret ? secret.length : 'null');
    
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBodyBuffer)
        .digest('hex');

    console.log('🧠 Expected Signature:', expectedSignature);
    console.log('📥 Received Signature:', signature);
    console.log('🔍 Signatures Match:', expectedSignature === signature);

    try {
        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        );
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
}
