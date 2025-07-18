import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true,
    },
    eventData: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    collection: 'work_orders'
});

const WebhookEvent = mongoose.model("WebhookEvent", webhookEventSchema);

export default WebhookEvent;
