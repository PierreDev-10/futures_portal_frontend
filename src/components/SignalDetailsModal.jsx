// src/components/SignalDetailsModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Grid,
} from "@mui/material";

export default function SignalDetailsModal({ open, onClose, signal }) {
  if (!signal) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {signal.symbol} ({signal.direction})
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Entry:</strong> {signal.entry}
            </Typography>
            <Typography variant="body2">
              <strong>Stop Loss:</strong> {signal.sl}
            </Typography>
            <Typography variant="body2">
              <strong>Take Profit 1:</strong> {signal.tp1}
            </Typography>
            <Typography variant="body2">
              <strong>Take Profit 2:</strong> {signal.tp2}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Leverage:</strong> {signal.leverage}
            </Typography>
            <Typography variant="body2">
              <strong>ATR:</strong> {signal.atr}
            </Typography>
            <Typography variant="body2">
              <strong>Confidence:</strong>{" "}
              {signal.blended_prob
                ? (signal.blended_prob * 100).toFixed(1) + "%"
                : "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {signal.status}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <strong>Prediction Time:</strong>{" "}
          {new Date(signal.prediction_time).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          <strong>Valid From:</strong>{" "}
          {new Date(signal.valid_from).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          <strong>Valid To:</strong>{" "}
          {new Date(signal.valid_to).toLocaleString()}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}