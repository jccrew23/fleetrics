import React, { useState, useEffect } from "react";
import api from '../api';
export default function GenReport() {
  const [reportType, setReportType] = useState("work_orders");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVehicles, setSelectedVehicles] = useState(["all"]);
  const [vehicles, setVehicles] = useState([]);

  //function to fetch vehicles for dropdown (if needed)
  useEffect(() => {
    api
      .get("/api/fleetio/vehicles")
      .then((res) => {
        const records = res.data.vehicles?.records || [];
        setVehicles(records);
      })
      .catch((err) => {
        console.error(err);
        console.log("Failed to fetch vehicles. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/api/fleetio/reports",
        {
          reportType,
          startDate,
          endDate,
          vehicleId: selectedVehicles[0],
        },
        {responseType: "blob"} // Expecting a file response
      );

      // Create a URL for the generated report
      const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Fleet_Report_${reportType}_${startDate}_to_${endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // You can send this data to your backend when ready:
      // await axios.post('/api/reports', { reportType, startDate, endDate, vehicleIds: selectedVehicles });
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div className="container-fluid bg-light p-3 border-bottom">
      <form
        className="row g-3 align-items-center justify-content-between"
        onSubmit={handleSubmit}
      >
        {/* Vehicle Select */}
        <div className="col-auto">
          <select
            className="form-select"
            id="vehicleSelect"
            value={selectedVehicles[0] || "all"}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedVehicles(value === "all" ? ["all"] : [value]);
            }}
          >
            <option value="all">All Vehicles</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="col-auto">
          <label htmlFor="startDate" className="form-label me-2 mb-0">
            From:
          </label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div className="col-auto">
          <label htmlFor="endDate" className="form-label me-2 mb-0">
            To:
          </label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">
            Generate
          </button>
        </div>
      </form>
    </div>
  );
}
