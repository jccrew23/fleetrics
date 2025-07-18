import { useEffect, useState } from "react";
import api from "../api";
import GoogleCalEmbed from "../components/GoogleCalEmbed";
import GenReport from "../components/genReport";
import Header from "../components/header";
import GoogleSheetButton from "../components/googleSheetButton";
import { BASE_URL } from "../config";

function Dashboard() {
  const [workOrders, setWorkOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Fetch user data
useEffect(() => {
  api
    .get("/api/auth/me", { withCredentials: true })
    .then((res) => {
      setUser(res.data.user);
    })
    .catch((err) => {
      if (err.response && err.response.status === 401) {
        // User is not authenticated
        setUser(null);
        console.log("User not authenticated, redirecting to login.");
        window.location.href = BASE_URL + "/api/auth/google";
      }
      else {
        console.error("Unexpected error:", err);
      }
    })
    .finally(() => {
      setAuthChecked(true);
    });
}, []);

  // Fetch work orders
  useEffect(() => {
    api
      .get("/api/fleetio/work_orders", { withCredentials: true })
      .then((res) => {
        setWorkOrders(res.data.work_orders);
      })
      .catch((err) => {
        console.error(err);
        console.log("Failed to fetch work orders. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle logout
  const handleLogout = () => {
    api
      .get("/api/auth/logout", { withCredentials: true })
      .then(() => {
        window.location.href = import.meta.env.FRONTEND_URL;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Handle Login
  const handleLogin = () => {
    window.location.href = BASE_URL + "/api/auth/google";
  };

if (!authChecked) return <p>Loading...</p>;

if (!user) {
  return (
    <div>
      <h2>Please log in</h2>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

  return (
    <div>
      {/* Header component */}
      <div className="container-fluid mt-4">
        <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />
      </div>

      {/* GenReport component */}
      <div className="mb-4">
        <GenReport />
      </div>

      {/* Welcome section */}
      <div className="card p-4 mb-4 shadow-sm">
        <h1 className="mb-3">Dashboard</h1>
      </div>

      {/* Calendar */}
      <div className="mb-4">
        <GoogleCalEmbed />
      </div>

      {/* Sidebar */}
      <div style={{ flex: 1, minWidth: "250px" }}>
        {/* Google Sheet Button */}
        <div className="mb-4">
          <GoogleSheetButton />
        </div>

        {/* Work Orders */}
        <div className="card p-4 shadow-sm mb-5">
          <h2 className="mb-3">Work Orders</h2>
          {loading ? (
            <p>Loading work orders...</p>
          ) : !workOrders || workOrders.length === 0 ? (
            <p>No work orders found.</p>
          ) : (
            <p>{workOrders.length} work orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
