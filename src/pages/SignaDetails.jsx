// src/pages/SignalDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Typography, Paper, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../api/config";

function SignalDetails() {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/signals/${id}`);
        setSignal(response.data);
      } catch (error) {
        console.error("Error fetching signal details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSignal();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 8 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>Loading signal details...</Typography>
      </Container>
    );
  }

  if (!signal) {
    return (
      <Container sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="error">Signal not found</Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Signal Details — {signal.symbol}
        </Typography>
        <Typography>Direction: {signal.direction}</Typography>
        <Typography>Entry: {signal.entry}</Typography>
        <Typography>Take Profit 1: {signal.tp1}</Typography>
        <Typography>Take Profit 2: {signal.tp2}</Typography>
        <Typography>Stop Loss: {signal.sl}</Typography>
        <Typography>ATR: {signal.atr}</Typography>
        <Typography>Leverage: {signal.leverage}x</Typography>
        <Typography>Status: {signal.status}</Typography>
        <Typography>
          Prediction Time: {new Date(signal.prediction_time).toLocaleString()}
        </Typography>
        <Typography>
          Valid From: {new Date(signal.valid_from).toLocaleString()}
        </Typography>
        <Typography>
          Valid To: {new Date(signal.valid_to).toLocaleString()}
        </Typography>

        <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
          Back to Dashboard
        </Button>
      </Paper>
    </Container>
  );
}

export default SignalDetails;