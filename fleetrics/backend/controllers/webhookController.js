import verifySignature from "../utils/verifySignature.js";
import { Buffer } from "buffer";
import WebhookEvent from "../models/webhookEvent.js";
import dotenv from "dotenv";
import { handleCalendarEvent, addWebhookToSheet } from "../services/calendar/calendarService.js";

dotenv.config();

export async function handleWebhook(req, res) {
  // Verify the signature of the incoming request

  const signature = req.headers["x-fleetio-webhook-signature"];
  const secret = process.env.FLEETIO_WEBHOOK_SECRET;

  // const rawBody = Buffer.isBuffer(req.body)
  //   ? req.body.toString("utf8")
  //   : JSON.stringify(req.body);

  const isValid = verifySignature(req.body, signature, secret);

  console.log("Signature header:", signature);

  if (!isValid) {
    return res.status(401).send("Forbidden: Invalid signature");
  }

  // Process the webhook payload
 const payload = JSON.parse(req.body.toString("utf8"));

  const event = payload.event || "unknown_event";
  const eventData = payload.payload;

  //extract relevant data from the payload
  const fleetioEventId = eventData.id;
  const startedAt = eventData.started_at;
  const completedAt = eventData.completed_at || null;
  const vehicleName = eventData.vehicle_name;
  const status = eventData.work_order_status_name;
  const issuedBy = eventData.issued_by_name;

  console.log(fleetioEventId, event, startedAt, completedAt, vehicleName, status, issuedBy);


  // Save the webhook event to the database
  try {
    await WebhookEvent.create({
      eventType: event,
      eventData: payload,
    });
    console.log("Webhook event saved successfully:", event);
  } catch (error) {
    console.error("Error saving webhook event:", error);
  }

  try {
    await handleCalendarEvent({
      fleetioId: fleetioEventId,
      title: event,
      start: startedAt,
      end: completedAt,
      vehicle: vehicleName,
      status: status,
      issuedBy: issuedBy,
    });

    await addWebhookToSheet({
      fleetioId: fleetioEventId,
      title: event,
      start: startedAt,
      end: completedAt,
      vehicle: vehicleName,
      status: status,
      issuedBy: issuedBy,
    });

    res.status(200).send("Webhook processed, calendar and sheet updated");
  } catch (err) {
    console.error("Error handling event:", err);
    res.status(500).send("Error processing event");
  }
}
