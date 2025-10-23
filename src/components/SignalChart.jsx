// src/components/SignalChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Typography, Paper } from "@mui/material";

const SignalChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Typography
        variant="body2"
        align="center"
        color="textSecondary"
        sx={{ mt: 4 }}
      >
        No chart data available
      </Typography>
    );
  }

  const chartData = data.map((signal) => ({
    name: signal.symbol || "N/A",
    Entry: signal.entry ?? 0,
    TakeProfit1: signal.tp1 ?? 0,
    TakeProfit2: signal.tp2 ?? 0,
    StopLoss: signal.sl ?? 0,
  }));

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Signal Performance Overview
      </Typography>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Entry" stroke="#1976d2" />
          <Line type="monotone" dataKey="TakeProfit1" stroke="#2e7d32" />
          <Line type="monotone" dataKey="TakeProfit2" stroke="#9c27b0" />
          <Line type="monotone" dataKey="StopLoss" stroke="#d32f2f" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SignalChart;