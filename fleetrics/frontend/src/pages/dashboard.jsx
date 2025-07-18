import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleCalEmbed from "../components/GoogleCalEmbed";
import GenReport from "../components/genReport";
import Header from "../components/header";
import GoogleSheetButton from "../components/googleSheetButton";

function Dashboard() {
  const [workOrders, setWorkOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setAuthChecked(true);
      })
      .catch((err) => {
        navigate("http://localhost:5000/api/auth/google");
        console.error(err);
        console.log("Failed to fetch user data. Please try again later.");
      });
  }, []);

  // Fetch work orders
  useEffect(() => {
    axios
      .get("/api/fleetio/work_orders")
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
    axios
      .get("http://localhost:5000/api/auth/logout", { withCredentials: true })
      .then(() => {
        window.location.href = "http://localhost:5173";
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Handle Login
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

    if (loading) return <p>Loading...</p>;

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
      <div style={{ flex: 1, minWidth: '250px' }}>
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
