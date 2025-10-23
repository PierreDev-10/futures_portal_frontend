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

  // Fetch signals
  const fetchSignals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/signals/latest`);
      const data = response.data;
      if (Array.isArray(data)) setSignals(data);
      else if (data.results) setSignals(data.results);
      else setSignals([]);
    } catch (error) {
      console.error("Error fetching signals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  // Format date from UTC
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
          hour12: true,
        });
  };

  // Table columns
  const columns = [
    { field: "symbol", headerName: "Symbol", width: 120 },
    { field: "direction", headerName: "Direction", width: 100 },
    {
      field: "entry",
      headerName: "Entry Price",
      width: 130,
      valueFormatter: (params) => params.value?.toFixed(2),
    },
    {
      field: "tp1",
      headerName: "TP1",
      width: 100,
      valueFormatter: (params) => params.value?.toFixed(2),
    },
    {
      field: "tp2",
      headerName: "TP2",
      width: 100,
      valueFormatter: (params) => params.value?.toFixed(2),
    },
    {
      field: "sl",
      headerName: "Stop Loss",
      width: 120,
      valueFormatter: (params) => params.value?.toFixed(2),
    },
    {
      field: "prediction_time",
      headerName: "Prediction Time",
      width: 200,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
  ];

  // Modal style
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
          rows={signals.map((signal, index) => ({ id: index + 1, ...signal }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          loading={loading}
          onRowClick={(params) => setSelectedSignal(params.row)}
        />
      </Paper>

      {/* Expanded Modal */}
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