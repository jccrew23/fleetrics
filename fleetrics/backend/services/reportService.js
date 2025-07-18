import ExcelJS from "exceljs";
import { fetchWorkOrderData } from "./fleetio.js";

export async function generateFleetReport({
  reportType,
  startDate,
  endDate,
  vehicleIds,
}) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Fleet Report");

  let data = [];

  if (reportType === "work_orders") {
    const result = await fetchWorkOrderData({ startDate, endDate, vehicleIds });
    data = result.work_orders || [];
  }

  sheet.columns = [
    { header: "Work Order ID", key: "id", width: 15 },
    { header: "Vehicle", key: "vehicle_name", width: 30 },
    { header: "Status", key: "status", width: 15 },
    { header: "Start Date", key: "date", width: 15 },
    { header: "Completed At", key: "completed_at", width: 15 },
  ];

  data.forEach((item) => {
    sheet.addRow({
      id: item.id,
      vehicle_name: item.vehicle_name,
      status: item.work_order_status_name,
      date: item.started_at
        ? new Date(item.started_at).toLocaleDateString()
        : "N/A",
      completed_at: item.completed_at
        ? new Date(item.completed_at).toLocaleDateString()
        : "N/A",
    });
  });

  return workbook;
}
