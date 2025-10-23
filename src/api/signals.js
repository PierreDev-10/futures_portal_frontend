// src/api/signals.js
import axios from "axios";
import { API_BASE_URL } from "./config";

// Fetch the latest signals
export async function fetchLatestSignals() {
  const response = await axios.get(`${API_BASE_URL}/api/signals/latest`);
  return response.data;
}

// Fetch signal statistics
export async function fetchSignalStats() {
  const response = await axios.get(`${API_BASE_URL}/api/signals/stats`);
  return response.data;
}

// Fetch a specific signal by ID
export async function fetchSignalById(signalId) {
  const response = await axios.get(`${API_BASE_URL}/api/signals/${signalId}`);
  return response.data;
}

// Push a new signal to backend
export async function pushSignal(data) {
  const response = await axios.post(`${API_BASE_URL}/signals/push`, data);
  return response.data;
}