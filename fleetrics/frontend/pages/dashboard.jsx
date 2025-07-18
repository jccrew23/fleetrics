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
    console.log('Checking auth with:', `${BASE_URL}/api/auth/me`);
    api
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => {
        console.log('Auth response:', res.data);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log('Auth error:', err.response?.status, err.response?.data);
        if (err.response && err.response.status === 401) {
          setUser(null);
          console.log("User not authenticated, redirecting to login.");
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
    console.log("🚪 Logging out...");
    api
      .get("/api/auth/logout", { withCredentials: true })
      .then((response) => {
        console.log("✅ Logout response:", response.data);
        setUser(null);
        setAuthChecked(false); // Reset auth check
        console.log("User logged out successfully.");
        // Force a page reload to clear any cached state
        window.location.reload();
      })
      .catch((err) => {
        console.error("❌ Logout error:", err);
        // Still try to clear user state even if logout fails
        setUser(null);
        setAuthChecked(false);
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

        {/* Work Orders
        <div className="card p-4 shadow-sm mb-5">
          <h2 className="mb-3">Work Orders</h2>
          {loading ? (
            <p>Loading work orders...</p>
          ) : !workOrders || workOrders.length === 0 ? (
            <p>No work orders found.</p>
          ) : (
            <p>{workOrders.length} work orders found.</p>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default Dashboard;
