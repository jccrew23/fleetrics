import { fetchWorkOrderData } from "../services/fleetio.js";
import { fetchVehicleData } from "../services/fleetio.js";
import { generateFleetReport } from "../services/reportService.js";

export async function getWorkOrders(req, res) {
  const { reportType, startDate, endDate, vehicleId } = req.body;
  const vehicleIds = vehicleId === "all" ? [] : [vehicleId];

  try {
    const { work_orders } = await fetchWorkOrderData({
      reportType,
      startDate,
      endDate,
      vehicleIds,
    });

    res.status(200).json({ work_orders });
  } catch (error) {
    console.error("Error fetching work order data:", error);
    res.status(500).json({ error: "Failed to fetch work order data" });
  }
}

export async function getVehicles(req, res) {
  try {
    const { vehicles } = await fetchVehicleData();
    res.status(200).json({ vehicles });
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    res.status(500).json({ error: "Failed to fetch vehicle data" });
  }
}

export async function generateReport(req, res) {
  const { reportType, startDate, endDate, vehicleId } = req.body;
  const vehicleIds = vehicleId === "all" ? [] : [vehicleId];

  try {
    const workbook = await generateFleetReport({
      reportType,
      startDate,
      endDate,
      vehicleIds,
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Fleet_Report_${reportType}_${startDate}_to_${endDate}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
}
