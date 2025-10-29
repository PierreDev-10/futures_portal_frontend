// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Modal,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { API_BASE_URL } from "../api/config";
import SignalChart from "../components/SignalChart";

function Dashboard() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);

  // Fetch signals from backend
  const fetchSignals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/signals/latest`);
      const data = response.data;
      console.debug("Latest payload:", data);

      // Normalize for both single object and array responses
      if (Array.isArray(data)) {
        setSignals(data);
      } else if (data && typeof data === "object") {
        setSignals([data]); // Wrap single signal in array
      } else if (data.results) {
        setSignals(data.results);
      } else {
        setSignals([]);
      }
    } catch (error) {
      console.error("Error fetching signals:", error);
      setSignals([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch immediately + auto-refresh every minute
  useEffect(() => {
    fetchSignals();
    const interval = setInterval(() => {
      fetchSignals();
    }, 20000); // every 20 seconds
    return () => clearInterval(interval);
  }, []);

  // Format UTC datetime
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
  };
 // Safe numeric formatter
const fmt = (v) => {
  if (v === null || v === undefined || v === "") return "-";
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : "-";
};

  // DataGrid columns (drop-in replacement)
const columns = [
  { field: "symbol", headerName: "Symbol", width: 120 },
  { field: "direction", headerName: "Direction", width: 110 },
  {
    field: "entry",
    headerName: "Entry Price",
    width: 130,
    valueGetter: (params) => params.row.entry,          // read raw
    renderCell: (params) => fmt(params.value),          // display robustly
  },
  {
    field: "tp1",
    headerName: "TP1",
    width: 100,
    valueGetter: (p) => p.row.tp1,
    renderCell: (p) => fmt(p.value),
  },
  {
    field: "tp2",
    headerName: "TP2",
    width: 100,
    valueGetter: (p) => p.row.tp2,
    renderCell: (p) => fmt(p.value),
  },
  {
    field: "sl",
    headerName: "Stop Loss",
    width: 120,
    valueGetter: (p) => p.row.sl,
    renderCell: (p) => fmt(p.value),
  },
  {
    field: "prediction_time",
    headerName: "Prediction Time",
    width: 220,
    valueGetter: (p) => p.row.prediction_time || p.row.created_at, // fallback
    renderCell: (p) =>
      p.value ? formatDate(p.value) : "N/A",
  },
  { field: "status", headerName: "Status", width: 120 },
];

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 6,
        backgroundColor: "#f9f9f9",
        p: 5,
        borderRadius: "12px",
      }}
    >
      <Typography variant="h4" textAlign="center" gutterBottom>
        Futures Portal Dashboard
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={fetchSignals}
        disabled={loading}
        sx={{ mb: 4 }}
      >
        {loading ? "Refreshing..." : "Refresh Data"}
      </Button>

      {/* KPI Section */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 4,
          display: "flex",
          justifyContent: "center",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6">
          Total Signals: <b>{signals.length}</b>
        </Typography>
        <Typography variant="h6">
          Pending:{" "}
          <b>{signals.filter((s) => s.status === "PENDING").length}</b>
        </Typography>
      </Paper>

      {/* DataGrid Table */}
      <Paper sx={{ height: 420, width: "100%", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Latest Signals
        </Typography>
        <DataGrid
          rows={signals.map((signal, index) => ({ id: signal.id || index + 1, ...signal }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          loading={loading}
          onRowClick={(params) => setSelectedSignal(params.row)}
        />
      </Paper>

      {/* Modal for detailed signal info */}
      <Modal
        open={!!selectedSignal}
        onClose={() => setSelectedSignal(null)}
        aria-labelledby="signal-details"
      >
        <Box sx={modalStyle}>
          {selectedSignal && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedSignal.symbol} ({selectedSignal.direction})
              </Typography>
              <Typography>Entry: {selectedSignal.entry}</Typography>
              <Typography>TP1: {selectedSignal.tp1}</Typography>
              <Typography>TP2: {selectedSignal.tp2}</Typography>
              <Typography>Stop Loss: {selectedSignal.sl}</Typography>
              <Typography>
                Confidence:{" "}
                {selectedSignal.blended_prob
                  ? (selectedSignal.blended_prob * 100).toFixed(1) + "%"
                  : "N/A"}
              </Typography>
              <Typography>
                Prediction Time: {formatDate(selectedSignal.prediction_time)}
              </Typography>
              <Typography>
                Valid: {formatDate(selectedSignal.valid_from)} →{" "}
                {formatDate(selectedSignal.valid_to)}
              </Typography>
              <Typography>Status: {selectedSignal.status}</Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* Chart Section */}
      <SignalChart data={signals} />
    </Container>
  );
}

export default Dashboard;