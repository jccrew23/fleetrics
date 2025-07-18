import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// This file is responsible for fetching vehicle data from the Fleetio API.
// url, key and token are stored in environment variables for security.
const API_BASE_URL = "https://secure.fleetio.com/api/";
const API_KEY = process.env.FLEETIO_API;
const API_TOKEN = process.env.FLEETIO_TOKEN_KEY;

const headers = {
    Accept: "application/json",
Authorization: "Token " + API_KEY,
    "Account-Token": API_TOKEN,
}

export async function fetchWorkOrderData({  startDate, endDate, vehicleIds }) {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: API_BASE_URL + "work_orders",
      params: {
        per_page: 100,
        page: 1,
        start_date: startDate,
        end_date: endDate,
      },
      headers: headers
    };

    if (
        vehicleIds && Array.isArray(vehicleIds) && vehicleIds.length > 0 &&
        !vehicleIds.includes("all")
    ) {
      config.params.vehicle_ids = vehicleIds.join(",");
    }

    const results = await axios.request(config);
    return { work_orders: results.data.records || [] };

  } catch (error) {
    console.error("Error fetching work order data:", error);
    throw new Error("Failed to fetch vehicle data");
  }

}

export async function fetchVehicleData() {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: API_BASE_URL + "vehicles",
      params: {
        per_page: 100,
        page: 1,
      },
      headers: {
        Accept: "application/json",
        Authorization: "Token " + API_KEY,
        "Account-Token": API_TOKEN,
      },
    };

    const results = await axios.request(config);
    return { vehicles: results.data || [] };
  } catch (error) {
    console.error("Fleetio API error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error("Failed to fetch vehicle data");
  }
}

