// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { Grid } from "@mui/material"; // ✅ New Grid system
import { fetchLatestSignals, fetchSignalStats } from "./api/signals";

function App() {
  const [loading, setLoading] = useState(false);
  const [signals, setSignals] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [signalData, statsData] = await Promise.all([
        fetchLatestSignals(),
        fetchSignalStats(),
      ]);
      setSignals(signalData);
      setStats(statsData);
    } catch (err) {
      setError("Unable to fetch data from backend");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Futures Portal Dashboard
      </Typography>

      <Box display="flex" justifyContent="center" mb={4}>
        <Button variant="contained" onClick={loadData} disabled={loading}>
          {loading ? "Loading..." : "Refresh Data"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && stats && (
        <Grid container spacing={3} justifyContent="center">
          <Grid>
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Signals
                </Typography>
                <Typography variant="h4">{stats.total_signals}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Active Signals
                </Typography>
                <Typography variant="h4">{stats.active_signals}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {!loading && signals && signals.length > 0 && (
        <Box mt={5}>
          <Typography variant="h5" gutterBottom>
            Latest Signals
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {signals.map((signal, index) => (
              <Grid key={index}>
                <Card sx={{ minWidth: 250, backgroundColor: "#f8f9fa" }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {signal.symbol || "N/A"} ({signal.direction || "?"})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Entry: {signal.entry?.toFixed(2) || "N/A"} | Stop Loss:{" "}
                      {signal.sl?.toFixed(2) || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      TP1: {signal.tp1?.toFixed(2) || "N/A"} | TP2:{" "}
                      {signal.tp2?.toFixed(2) || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prediction:{" "}
                      {signal.prediction_time
                        ? new Date(signal.prediction_time).toLocaleString()
                        : "Invalid Date"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default App;