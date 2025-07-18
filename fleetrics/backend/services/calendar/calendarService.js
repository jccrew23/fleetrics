import { google } from "googleapis";
import dotenv from "dotenv";
import CalendarMapping from "../../models/calendarMapping.js";
import { getServiceAccountAuth } from "../../utils/utils.js";

dotenv.config();

export async function handleCalendarEvent({
  fleetioId,
  title,
  start,
  end,
  vehicle,
  status,
  issuedBy,
}) {
  try {
    const auth = await getServiceAccountAuth();
    const calendar = google.calendar({ version: "v3", auth });

    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!start) {
      throw new Error("Missing required 'start' date");
    }

    const isClosed = status?.toLowerCase() === "closed";
    const startDateTime = new Date(start);

    if (isNaN(startDateTime.getTime())) {
      throw new Error(`Invalid start date: ${start}`);
    }

    const endDateTime = isClosed
      ? new Date(end || startDateTime.getTime() + 30 * 60 * 1000)
      : new Date(startDateTime.getTime() + 3 * 24 * 60 * 60 * 1000);

    if (isNaN(endDateTime.getTime())) {
      throw new Error(`Invalid end date: ${end}`);
    }

    const eventDetails = {
      summary: `${title} - ${vehicle || "Vehicle"}`,
      description: `Vehicle: ${vehicle}\nStatus: ${status}\nIssued By: ${issuedBy}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "America/New_York",
      },
    };

    const existingMapping = await CalendarMapping.findOne({ fleetioId });

    if (existingMapping) {
      // Update existing event
      await calendar.events.update({
        calendarId,
        eventId: existingMapping.googleEventId,
        requestBody: eventDetails,
      });

      console.log(
        `✅ Updated Google Calendar event for Fleetio ID: ${fleetioId}`
      );
    } else {
      // Create new event
      const response = await calendar.events.insert({
        calendarId,
        requestBody: eventDetails,
      });

      const googleEventId = response.data.id;
      await CalendarMapping.create({ fleetioId, googleEventId });

      console.log(
        `✅ Created new Google Calendar event for Fleetio ID: ${fleetioId}`
      );
    }
  } catch (error) {
    console.error("❌ Error handling calendar event:", error);
    throw error;
  }
}

export async function addWebhookToSheet({
  fleetioId,
  title,
  start,
  end,
  vehicle,
  status,
  issuedBy,
}) {
  try {
    const auth = await getServiceAccountAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = "Work_Orders!A:H"; // Adjust the range as needed


    const values = [
      [
        new Date().toISOString(),// timestamp
        fleetioId,
        title,
        vehicle,
        status,
        issuedBy,
        start ? new Date(start).toISOString() : "",
        end ? new Date(end).toISOString() : "",
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    console.log(`✅ Added webhook data to Google Sheet for Fleetio ID: ${fleetioId}`);
  } catch (error) {
    console.error("❌ Error adding webhook to Google Sheet:", error);
    throw error;
  }
}
